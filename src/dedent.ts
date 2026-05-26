/**
 * Smart dedent: remove common leading whitespace from non-empty lines.
 */
export function dedent(text: string): string {
  const lines = text.split('\n')
  let minIndent = Infinity

  for (const line of lines) {
    if (line.trim() === '') continue
    const match = line.match(/^([ \t]*)/)
    const indent = match ? match[1].length : 0
    if (indent < minIndent) minIndent = indent
  }

  if (!Number.isFinite(minIndent) || minIndent === 0) {
    return normalizeBlankLines(text)
  }

  const dedented = lines
    .map((line) => {
      if (line.trim() === '') return line
      return line.slice(minIndent)
    })
    .join('\n')

  return normalizeBlankLines(dedented)
}

/** Trim trailing whitespace and collapse 3+ consecutive blank lines to at most 1. */
export function normalizeBlankLines(text: string): string {
  const trimmed = text.replace(/\s+$/, '')
  return trimmed.replace(/\n{3,}/g, '\n\n')
}
