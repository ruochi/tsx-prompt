export const promptTexts = {
  /**
   * Planner role (system prompt opening).
   */
  roleIntro: 'You are a **scene creative planner** producing structured creative briefs.',

  /**
   * JSON root output rules (system prompt "Output contract").
   */
  outputRules: '- Output **one** valid JSON root object only; **no** Markdown fences;',

  /**
   * segments field contract (system prompt).
   */
  segmentsContract: `- Root object must include \`title\` and \`items\`.
- \`items\` is a string array listing bullet points in order.`,

  /**
   * Style guidelines (system prompt "Style" section).
   */
  styleRules: `- Keep language concise and voiceover-friendly.
- Do not wrap the JSON in Markdown fences.`,
} as const
