import { jsx } from './jsx-runtime'

export { Fragment, jsx, jsxs } from './jsx-runtime'

/** Dev JSX runtime; debug/source args are ignored. */
export function jsxDEV(
  type: unknown,
  props: Record<string, unknown>,
  key: string | number | undefined,
  _isStaticChildren: boolean,
  _source: unknown,
  _self: unknown,
): ReturnType<typeof jsx> {
  return jsx(type, props, key)
}

export const jsxsDEV = jsxDEV
