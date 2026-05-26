import { describe, expect, it } from 'vitest'
import { renderToPromptParts } from '../../src/index'
import { ScenePrompt } from './ScenePrompt'

describe('examples/scene-prompt', () => {
  it('renders system and user parts with smart dedent', () => {
    const parts = renderToPromptParts(
      ScenePrompt({
        input: {
          sceneDesc: '  Explain sales growth.  ',
          theme: '#377CFB',
          timeline: [{ subtitle: 'First line', duration: 5 }],
        },
      }),
    )

    expect(parts.systemRole).toContain('**scene creative planner**')
    expect(parts.systemRole).toContain('## Output contract')
    expect(parts.systemRole).toContain('Output **one** valid JSON')
    expect(parts.systemRole.startsWith('You are')).toBe(true)

    expect(parts.userRole).toContain('## Scene goal')
    expect(parts.userRole).toContain('Explain sales growth.')
    expect(parts.userRole).toContain('Theme color: #377CFB')
    expect(parts.userRole).toContain('## Voiceover segments')
    expect(parts.userRole).toContain('1. (~5s) First line')
  })

  it('omits timeline section when empty', () => {
    const parts = renderToPromptParts(
      ScenePrompt({
        input: {
          sceneDesc: 'Scene without voiceover',
          theme: '#000',
          timeline: [],
        },
      }),
    )

    expect(parts.userRole).not.toContain('## Voiceover segments')
    expect(parts.userRole).not.toContain('no voiceover')
  })
})
