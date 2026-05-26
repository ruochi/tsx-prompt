/**
 * Run: npm run example
 *
 * Demonstrates Message, Smart Dedent, shared components, If/For conditional timeline.
 * Hover component refs in ScenePrompt.tsx / OutputRules.tsx for full JSDoc text.
 */
import { renderToPromptParts } from '../../src/index'
import { ScenePrompt } from './ScenePrompt'

const parts = renderToPromptParts(
  ScenePrompt({
    input: {
      sceneDesc: '  Explain the key drivers of quarterly sales growth.  ',
      theme: '#377CFB',
      timeline: [
        { subtitle: 'Intro: overall trend', duration: 5 },
        { subtitle: 'Breakdown by channel', duration: 8 },
      ],
    },
  }),
)

console.log('=== systemRole ===\n')
console.log(parts.systemRole)
console.log('\n=== userRole ===\n')
console.log(parts.userRole)
