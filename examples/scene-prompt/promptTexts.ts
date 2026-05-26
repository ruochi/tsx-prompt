export const promptTexts = {
  /**
   * JSON root output rules (system prompt "Output contract").
   *
   * - Output **one** valid JSON root object only; **no** Markdown fences;
   */
  outputRules: '- Output **one** valid JSON root object only; **no** Markdown fences;',

  /**
   * segments field contract (system prompt).
   *
   * - Root object must include `title` and `items`.
   * - `items` is a string array listing bullet points in order.
   */
  segmentsContract: `
- Root object must include \`title\` and \`items\`.
- \`items\` is a string array listing bullet points in order.
`.trim(),
} as const
