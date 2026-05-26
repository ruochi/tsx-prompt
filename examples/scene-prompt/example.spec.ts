import { describe, expect, it } from 'vitest'
import { buildPrompt } from './buildPrompt'

describe('examples/scene-prompt', () => {
  it('renders system and user via dual renderToString', () => {
    const parts = buildPrompt({
      sceneDesc: '  Explain sales growth.  ',
      theme: '#377CFB',
      timeline: [{ subtitle: 'First line', duration: 5 }],
    })

    expect(parts.system).toContain('**scene creative planner**')
    expect(parts.system).toContain('## Output contract')
    expect(parts.system).toContain('Output **one** valid JSON')
    expect(parts.system.startsWith('You are')).toBe(true)

    expect(parts.user).toContain('## Scene goal')
    expect(parts.user).toContain('Explain sales growth.')
    expect(parts.user).toContain('Theme color: #377CFB')
    expect(parts.user).toContain('## Voiceover segments')
    expect(parts.user).toContain('1. (~5s) First line')
  })

  it('omits timeline section when empty', () => {
    const parts = buildPrompt({
      sceneDesc: 'Scene without voiceover',
      theme: '#000',
      timeline: [],
    })

    expect(parts.user).not.toContain('## Voiceover segments')
  })
})
