import type { Nomination } from './fetchNominations'

/**
 * Simple djb2-style hash for strings.
 */
function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}

/**
 * Returns a stable, shareable ID for a nomination.
 * Uses sheet ID when present; falls back to content hash for legacy rows.
 */
export function getNominationId(nomination: Nomination): string {
  if (nomination.id && nomination.id.trim()) return nomination.id.trim()
  const parts = [
    nomination.timestamp ?? '',
    nomination.nomineeName ?? '',
    nomination.nominatorName ?? '',
    nomination.story ?? '',
  ]
  const str = parts.join('|')
  if (!str.trim()) return ''
  const h = hashString(str)
  return h.toString(36).slice(0, 8)
}
