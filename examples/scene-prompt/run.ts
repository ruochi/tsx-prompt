/**
 * Run: npm run example
 */
import { buildPrompt } from './buildPrompt'

const parts = buildPrompt({
  sceneDesc: '  Explain the key drivers of quarterly sales growth.  ',
  theme: '#377CFB',
  timeline: [
    { subtitle: 'Intro: overall trend', duration: 5 },
    { subtitle: 'Breakdown by channel', duration: 8 },
  ],
})

console.log('=== system ===\n')
console.log(parts.system)
console.log('\n=== user ===\n')
console.log(parts.user)
