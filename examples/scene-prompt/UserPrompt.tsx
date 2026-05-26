/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from '../../src/index'

export interface TimelineRow {
  subtitle: string | null
  duration: number
}

export interface UserPromptInput {
  sceneDesc: string
  theme: string
  timeline: TimelineRow[]
}

export function UserPrompt(props: { input: UserPromptInput }) {
  const { input } = props
  return (
    <>
      ## Scene goal
      {'\n\n'}
      {input.sceneDesc.trim()}
      {'\n\n'}
      Theme color: {input.theme}
      {(input.timeline.length > 0) && (
        <>
          {'\n\n'}
          ## Voiceover segments
          {'\n\n'}
          {input.timeline.map((row, i) => {
            const sub = row.subtitle == null ? 'null' : String(row.subtitle)
            return `${i + 1}. (~${row.duration}s) ${sub}`
          }).join('\n')}
        </>
      )}
    </>
  )
}
