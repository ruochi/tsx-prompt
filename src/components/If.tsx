import type { Child } from '../types'

export interface IfProps {
  condition: boolean
  children?: Child
}

export function If(props: IfProps): Child {
  if (!props.condition) return null
  return props.children
}
