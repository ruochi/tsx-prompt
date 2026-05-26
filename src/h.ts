import type { Child, VNode } from './types'

const FRAGMENT = Symbol.for('tsx-prompt.fragment')

export function flattenChildren(children: Child[]): Child[] {
  const result: Child[] = []
  for (const child of children) {
    if (child == null || typeof child === 'boolean') continue
    if (Array.isArray(child)) {
      result.push(...flattenChildren(child))
      continue
    }
    result.push(child)
  }
  return result
}

export function Fragment(props: { children?: Child }): VNode {
  const raw = props.children
  const children = raw == null ? [] : flattenChildren(Array.isArray(raw) ? raw : [raw])
  return { type: FRAGMENT, props: null, children }
}

export function isFragmentType(type: unknown): type is typeof FRAGMENT {
  return type === FRAGMENT
}

export function createFragmentVNode(...rawChildren: Child[]): VNode {
  return { type: FRAGMENT, props: null, children: flattenChildren(rawChildren) }
}

export function h(
  type: string | symbol | Function,
  props: Record<string, unknown> | null,
  ...rawChildren: Child[]
): VNode {
  const children = flattenChildren(rawChildren)
  let mergedProps: Record<string, unknown> | null = props

  if (children.length > 0) {
    mergedProps = { ...(props ?? {}) }
    const existing = mergedProps.children
    if (existing != null) {
      mergedProps.children = flattenChildren([existing as Child, ...children])
    } else {
      mergedProps.children = children.length === 1 ? children[0] : children
    }
  }

  return { type, props: mergedProps, children }
}
