/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, Message } from '../../src/index'
import { OutputRules, SegmentsContract } from './components/OutputRules'
import { TimelineSection } from './components/TimelineSection'
import type { TimelineRow } from './components/TimelineSection'

export interface ScenePromptInput {
  sceneDesc: string
  theme: string
  timeline: TimelineRow[]
}

/**
 * Example: scene-level prompt template.
 * - system: contract + style rules (Smart Dedent with nested indent)
 * - user: scene goal + conditional voiceover list
 * - shared components with JSDoc — hover `<OutputRules />` at call site for full text
 */
export function ScenePrompt(props: { input: ScenePromptInput }) {
  const { input } = props
  return (
    <>
      <Message role="system">
        You are a **scene creative planner** producing structured creative briefs.

        ## Output contract
        {'\n\n'}
        <OutputRules />
        {'\n'}
        <SegmentsContract />
        {'\n\n'}
        ## Style
        {'\n\n'}
        - Keep language concise and voiceover-friendly.
        - Do not wrap the JSON in Markdown fences.
      </Message>

      <Message role="user">
        ## Scene goal
        {'\n\n'}
        {input.sceneDesc.trim()}
        {'\n\n'}
        Theme color: {input.theme}
        {'\n\n'}
        <TimelineSection timeline={input.timeline} />
      </Message>
    </>
  )
}
