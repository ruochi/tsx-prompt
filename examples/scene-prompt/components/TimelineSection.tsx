/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, If, For } from '../../../src/index'

export interface TimelineRow {
  subtitle: string | null
  duration: number
}

/**
 * Voiceover segments list (written to user prompt when timeline is non-empty).
 *
 * ## Voiceover segments
 *
 * 1. (~Ns) subtitle
 * ...
 */
export function TimelineSection(props: { timeline: TimelineRow[] }) {
  return (
    <If condition={props.timeline.length > 0}>
      ## Voiceover segments
      {'\n\n'}
      <For
        each={props.timeline}
        render={(row, i) => {
          const sub = row.subtitle == null ? 'null' : String(row.subtitle)
          return `${i + 1}. (~${row.duration}s) ${sub}`
        }}
      />
    </If>
  )
}
