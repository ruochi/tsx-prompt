/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from '../../src/index'
import { promptTexts } from './promptTexts'

export interface TimelineRow {
  subtitle: string | null
  duration: number
}

export interface ScenePromptInput {
  sceneDesc: string
  theme: string
  timeline: TimelineRow[]
}

export function SystemPrompt() {
  return (
    <>
      {promptTexts.roleIntro}

      ## Output contract

      {promptTexts.outputRules}
      {promptTexts.segmentsContract}

      ## Style

      {promptTexts.styleRules}
    </>
  )
}

export function UserPrompt(props: { input: ScenePromptInput }) {
  return (
    <>
      ## Scene goal

      {props.input.sceneDesc.trim()}

      Theme color: {props.input.theme}

      {(props.input.timeline.length > 0) && (
        <>
          ## Voiceover segments

          {props.input.timeline.map((row, i) => (
            <>
              {i > 0 && '\n'}
              {i + 1}. (~{row.duration}s) {row.subtitle == null ? 'null' : String(row.subtitle)}
            </>
          ))}
        </>
      )}
    </>
  )
}

export function buildPrompt(input: ScenePromptInput) {
  return {
    system: renderToString(<SystemPrompt />),
    user: renderToString(<UserPrompt input={input} />),
  }
}
