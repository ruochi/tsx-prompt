import { renderToString } from '../render'
import type { Child } from '../types'

export interface ForProps<T> {
  each: readonly T[]
  render: (item: T, index: number) => Child
  separator?: string
}

export function For<T>(props: ForProps<T>): string {
  const separator = props.separator ?? '\n'
  return props.each
    .map((item, index) => renderToString(props.render(item, index)))
    .join(separator)
}
