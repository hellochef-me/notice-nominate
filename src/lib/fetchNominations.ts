export interface Nomination {
  id?: string;
  timestamp?: string;
  nominatorName: string;
  nominatorDepartment: string;
  nomineeName: string;
  nomineeDepartment: string;
  coreValue: string;
  behavior: string;
  story: string;
}

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as
  | string
  | undefined;

function getVal(raw: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const v = raw[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return "";
}

function normalizeRow(raw: Record<string, string>): Nomination {
  return {
    id: getVal(raw, "ID", "id") || undefined,
    timestamp: getVal(raw, "Submitted At", "Timestamp", "timestamp") || undefined,
    nominatorName: getVal(raw, "Name", "nominatorName"),
    nominatorDepartment: getVal(raw, "Department", "nominatorDepartment"),
    nomineeName: getVal(raw, "Nominee Name", "nomineeName"),
    nomineeDepartment: getVal(raw, "Nominee's Department", "nomineeDepartment"),
    coreValue: getVal(raw, "Core Value", "coreValue"),
    behavior: getVal(raw, "Behavior", "behavior"),
    story: getVal(raw, "Story", "story"),
  };
}

export async function fetchNominations(): Promise<Nomination[]> {
  const url = APPS_SCRIPT_URL;
  if (!url) {
    throw new Error(
      "Google Apps Script URL is not configured. Set VITE_APPS_SCRIPT_URL in your .env file.",
    );
  }

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Failed to fetch nominations: ${response.statusText}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map((row: Record<string, string>) => normalizeRow(row));
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return [];
}
