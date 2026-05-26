export type Child =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | Child[]

export interface VNode {
  type: string | symbol | Function
  props: Record<string, unknown> | null
  children: Child[]
}

export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: string
  content: string
  [key: string]: unknown
}

export const MESSAGE_TAG = '__tsx_prompt_message__' as const

export type MessageTagType = typeof MESSAGE_TAG

export function isMessageTag(type: unknown): type is MessageTagType {
  return type === MESSAGE_TAG
}
