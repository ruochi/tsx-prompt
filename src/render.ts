import { dedent, normalizeBlankLines } from './dedent'
import { isFragmentType, flattenChildren, createFragmentVNode } from './h'
import type { ChatMessage, Child, VNode } from './types'
import { isMessageTag } from './types'

export interface PromptPartsOutput {
  systemRole: string
  userRole: string
  userRoleParts?: string[]
}

function isRenderableChild(child: Child): child is VNode | string | number {
  return child != null && typeof child !== 'boolean'
}

function renderChildrenToRawString(children: Child[], separator = ''): string {
  const parts = children
    .filter(isRenderableChild)
    .map((child) => renderNodeToRawString(child))
  return parts.join(separator)
}

function renderNodeToRawString(node: VNode | string | number): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  const { type, props, children } = node

  if (isFragmentType(type)) {
    return renderChildrenToRawString(children)
  }

  if (typeof type === 'function') {
    const rendered = type(props ?? {})
    if (rendered == null || typeof rendered === 'boolean') return ''
    if (Array.isArray(rendered)) {
      return renderChildrenToRawString(rendered)
    }
    return renderNodeToRawString(rendered as VNode | string | number)
  }

  if (isMessageTag(type)) {
    return renderChildrenToRawString(children)
  }

  // Unknown intrinsic element: treat as transparent wrapper
  return renderChildrenToRawString(children)
}

export function renderToString(node: Child): string {
  if (node == null || typeof node === 'boolean') return ''
  if (Array.isArray(node)) {
    const raw = renderChildrenToRawString(flattenChildren(node))
    return finalizeString(raw)
  }
  const raw = renderNodeToRawString(node)
  return finalizeString(raw)
}

function finalizeString(raw: string): string {
  return dedent(raw).replace(/^\n+/, '')
}

function collectChatMessages(node: Child, messages: ChatMessage[]): void {
  if (node == null || typeof node === 'boolean') return

  if (typeof node === 'string' || typeof node === 'number') {
    throw new Error(
      'renderToMessages requires root-level Message tags; found bare text node.',
    )
  }

  if (Array.isArray(node)) {
    for (const child of flattenChildren(node)) {
      collectChatMessages(child, messages)
    }
    return
  }

  const { type, props, children } = node

  if (isFragmentType(type)) {
    for (const child of children) {
      collectChatMessages(child, messages)
    }
    return
  }

  if (typeof type === 'function') {
    const rendered = type(props ?? {})
    collectChatMessages(rendered as Child, messages)
    return
  }

  if (isMessageTag(type)) {
    const content = normalizeBlankLines(renderToString(createFragmentVNode(...children)))
    const { role, children: _children, ...meta } = props ?? {}
    messages.push({
      role: String(role ?? ''),
      content,
      ...meta,
    })
    return
  }

  throw new Error(
    `renderToMessages encountered unknown element type "${String(type)}". Use Message tags.`,
  )
}

export function renderToMessages(node: Child): ChatMessage[] {
  const messages: ChatMessage[] = []
  collectChatMessages(node, messages)
  if (messages.length === 0) {
    throw new Error(
      'renderToMessages requires at least one Message tag at the root.',
    )
  }
  return messages
}

export function renderToPromptParts(node: Child): PromptPartsOutput {
  const messages = renderToMessages(node)
  const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content)
  const userParts = messages.filter((m) => m.role === 'user').map((m) => m.content)

  if (systemParts.length === 0) {
    throw new Error('renderToPromptParts requires at least one Message with role="system".')
  }
  if (userParts.length === 0) {
    throw new Error('renderToPromptParts requires at least one Message with role="user".')
  }

  return {
    systemRole: systemParts.join('\n\n'),
    userRole: userParts[0],
    userRoleParts: userParts.length > 1 ? userParts.slice(1) : undefined,
  }
}
