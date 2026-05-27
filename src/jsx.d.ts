import type { VNode } from './types'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface IntrinsicElements {
      [elemName: string]: Record<string, unknown>
    }
  }
}

/** Published package path for `jsxImportSource: "tsx-prompt"`. */
declare module 'tsx-prompt/jsx-runtime' {
  export function jsx(
    type: unknown,
    props: Record<string, unknown>,
    key?: string | number,
  ): VNode
  export const jsxs: typeof jsx
  export { Fragment } from 'tsx-prompt'
}

declare module 'tsx-prompt/jsx-dev-runtime' {
  export function jsxDEV(
    type: unknown,
    props: Record<string, unknown>,
    key: string | number | undefined,
    isStaticChildren: boolean,
    source: unknown,
    self: unknown,
  ): VNode
  export const jsxsDEV: typeof jsxDEV
  export { jsx, jsxs, Fragment } from 'tsx-prompt/jsx-runtime'
}

export {}
