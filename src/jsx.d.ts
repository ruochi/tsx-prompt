import type { VNode } from './types'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface IntrinsicElements {
      [elemName: string]: Record<string, unknown>
    }
  }
}

export {}
