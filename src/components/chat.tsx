import { h } from '../h'
import type { Child, VNode } from '../types'
import { MESSAGE_TAG } from '../types'

export interface MessageProps {
  role: string
  children?: Child
  [key: string]: unknown
}

export function Message(props: MessageProps): VNode {
  const { role, children, ...meta } = props
  return h(MESSAGE_TAG, { role, ...meta }, children)
}
