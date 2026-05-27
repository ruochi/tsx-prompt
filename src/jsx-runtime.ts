import { h, Fragment, flattenChildren } from './h'
import type { Child, VNode } from './types'

export { Fragment }

function jsxImpl(
  type: unknown,
  rawProps: Record<string, unknown> | null,
  key?: string | number,
): VNode {
  const props = rawProps ?? {}
  const { children, ...rest } = props
  const mergedRest = key != null ? { ...rest, key } : rest
  const finalProps = Object.keys(mergedRest).length > 0 ? mergedRest : null
  const nodeType = type as string | symbol | Function

  if (children === undefined) {
    return h(nodeType, finalProps)
  }

  const childList = flattenChildren(
    Array.isArray(children) ? (children as Child[]) : [children as Child],
  )
  return h(nodeType, finalProps, ...childList)
}

/** Automatic JSX runtime entry (TS `react-jsx` transform). */
export function jsx(
  type: unknown,
  props: Record<string, unknown>,
  key?: string | number,
): VNode {
  return jsxImpl(type, props, key)
}

/** Static multi-child JSX; same implementation as `jsx` for this engine. */
export const jsxs = jsx
