export interface NominationData {
  nominatorName: string
  nominatorDepartment: string
  nomineeName: string
  nomineeDepartment: string
  coreValue: string
  behavior: string
  story: string
}

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined

export async function submitToSheet(data: NominationData): Promise<void> {
  const url = APPS_SCRIPT_URL
  if (!url) {
    throw new Error('Google Apps Script URL is not configured. Set VITE_APPS_SCRIPT_URL in your .env file.')
  }

  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  })

  // no-cors mode returns opaque response, so we can't read it.
  // If the fetch itself didn't throw, we treat it as success.
  if (response.type === 'opaque') return

  if (!response.ok) {
    throw new Error(`Submission failed: ${response.statusText}`)
  }
}
