import OpenAI from "openai";
import { coreValues } from "@/data/coreValues";
import { departments } from "@/data/departments";
import type { Employee } from "@/lib/fetchEmployees";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as
  | string
  | undefined;

export interface ParsedNomination {
  nominatorName: string;
  nominatorDepartment: string;
  nomineeName: string;
  nomineeDepartment: string;
  coreValue: string;
  behavior: string;
  story: string;
}

interface RawExtraction {
  nominator_name?: string;
  nominator_department?: string;
  nominee_name?: string;
  nominee_department?: string;
  core_value?: string;
  behavior?: string;
  story?: string;
}

const CORE_VALUE_LABELS = coreValues.map((v) => v.label);
const ALL_BEHAVIORS = coreValues.flatMap((v) =>
  v.behaviors.map((b) => ({ coreValueId: v.id, behavior: b }))
);

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function bestNameMatch(
  extracted: string,
  employees: Employee[]
): string {
  if (!extracted) return "";
  const norm = normalize(extracted);

  const exact = employees.find((e) => normalize(e.name) === norm);
  if (exact) return exact.name;

  const includes = employees.find(
    (e) =>
      normalize(e.name).includes(norm) || norm.includes(normalize(e.name))
  );
  if (includes) return includes.name;

  let best: Employee | null = null;
  let bestDist = Infinity;
  for (const emp of employees) {
    const dist = levenshtein(norm, normalize(emp.name));
    const threshold = Math.max(3, Math.floor(emp.name.length * 0.35));
    if (dist < bestDist && dist <= threshold) {
      bestDist = dist;
      best = emp;
    }
  }
  return best ? best.name : extracted.trim();
}

function bestDepartmentMatch(extracted: string): string {
  if (!extracted) return "";
  const norm = normalize(extracted);

  const exact = departments.find((d) => normalize(d) === norm);
  if (exact) return exact;

  const includes = departments.find(
    (d) => normalize(d).includes(norm) || norm.includes(normalize(d))
  );
  if (includes) return includes;

  let best = "";
  let bestDist = Infinity;
  for (const dept of departments) {
    const dist = levenshtein(norm, normalize(dept));
    if (dist < bestDist && dist <= 4) {
      bestDist = dist;
      best = dept;
    }
  }
  return best;
}

function bestCoreValueMatch(extracted: string): string {
  if (!extracted) return "";
  const norm = normalize(extracted);

  for (const cv of coreValues) {
    if (normalize(cv.label) === norm || normalize(cv.id) === norm) return cv.id;
  }

  for (const cv of coreValues) {
    if (
      normalize(cv.label).includes(norm) ||
      norm.includes(normalize(cv.label))
    )
      return cv.id;
  }

  let best = "";
  let bestDist = Infinity;
  for (const cv of coreValues) {
    const dist = levenshtein(norm, normalize(cv.label));
    if (dist < bestDist && dist <= 5) {
      bestDist = dist;
      best = cv.id;
    }
  }
  return best;
}

function bestBehaviorMatch(
  extracted: string,
  coreValueId: string
): string {
  if (!extracted) return "";
  const norm = normalize(extracted);

  const candidates = coreValueId
    ? ALL_BEHAVIORS.filter((b) => b.coreValueId === coreValueId)
    : ALL_BEHAVIORS;

  const exact = candidates.find((b) => normalize(b.behavior) === norm);
  if (exact) return exact.behavior;

  const includes = candidates.find(
    (b) =>
      normalize(b.behavior).includes(norm) ||
      norm.includes(normalize(b.behavior))
  );
  if (includes) return includes.behavior;

  let best = "";
  let bestDist = Infinity;
  for (const b of candidates) {
    const dist = levenshtein(norm, normalize(b.behavior));
    if (dist < bestDist && dist <= 5) {
      bestDist = dist;
      best = b.behavior;
    }
  }
  return best;
}

export async function parseNominationPhoto(
  base64Image: string,
  employees: Employee[]
): Promise<ParsedNomination> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured.");
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const coreValueList = CORE_VALUE_LABELS.join(", ");
  const behaviorList = coreValues
    .map((cv) => `${cv.label}: ${cv.behaviors.join(", ")}`)
    .join("; ");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You extract employee nomination data from photos of nomination forms. Return ONLY valid JSON with these fields:
{
  "nominator_name": "string or empty",
  "nominator_department": "string or empty",
  "nominee_name": "string or empty",
  "nominee_department": "string or empty",
  "core_value": "string or empty",
  "behavior": "string or empty",
  "story": "string or empty"
}

Known core values: ${coreValueList}
Known behaviors per value: ${behaviorList}

If you cannot determine a field with reasonable confidence, return an empty string for that field. Do not guess wildly.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the nomination details from this photo. Return only the JSON object.",
          },
          {
            type: "image_url",
            image_url: {
              url: base64Image.startsWith("data:")
                ? base64Image
                : `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 800,
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  let raw: RawExtraction;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    raw = JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    raw = {};
  }

  const coreValueId = bestCoreValueMatch(raw.core_value ?? "");

  return {
    nominatorName: bestNameMatch(raw.nominator_name ?? "", employees),
    nominatorDepartment: bestDepartmentMatch(raw.nominator_department ?? ""),
    nomineeName: bestNameMatch(raw.nominee_name ?? "", employees),
    nomineeDepartment: bestDepartmentMatch(raw.nominee_department ?? ""),
    coreValue: coreValueId,
    behavior: bestBehaviorMatch(raw.behavior ?? "", coreValueId),
    story: (raw.story ?? "").trim(),
  };
}
