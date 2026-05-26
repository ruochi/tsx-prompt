/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from '../../../src/index'
import { promptTexts } from '../promptTexts'

export function OutputRules() {
  return <>{promptTexts.outputRules}</>
}

export function SegmentsContract() {
  return <>{promptTexts.segmentsContract}</>
}
