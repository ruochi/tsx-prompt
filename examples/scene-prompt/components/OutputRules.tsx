/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from '../../../src/index'

/**
 * JSON root output rules (written to system prompt "Output contract" section).
 *
 * - Output **one** valid JSON root object only; **no** Markdown fences;
 */
export function OutputRules() {
  return <>- Output **one** valid JSON root object only; **no** Markdown fences;</>
}

/**
 * segments field contract (written to system prompt).
 *
 * - Root object must include `title` and `items`.
 * - `items` is a string array listing bullet points in order.
 */
export function SegmentsContract() {
  return (
    <>
      - Root object must include `title` and `items`.
      - `items` is a string array listing bullet points in order.
    </>
  )
}
