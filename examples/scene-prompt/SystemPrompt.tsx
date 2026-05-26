/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from '../../src/index'
import { OutputRules, SegmentsContract } from './components/OutputRules'

export function SystemPrompt() {
  return (
    <>
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
    </>
  )
}
