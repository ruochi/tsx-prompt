/** @jsxImportSource tsx-prompt */
import { describe, expect, it } from 'vitest'
import { renderToString } from './render'

function Greeting(props: { name: string }) {
  return <>Hello {props.name}</>
}

describe('jsx-runtime (automatic transform)', () => {
  it('renders JSX without importing h or Fragment', () => {
    const out = renderToString(
      <>
        Write TypeScript code.
        <Greeting name="World" />
      </>,
    )
    expect(out).toBe('Write TypeScript code.Hello World')
  })

  it('supports native && and map', () => {
    const show = true
    const items = ['a', 'b']
    const out = renderToString(
      <>
        before
        {show && 'visible'}
        after
        {items.map((item, i) => (
          <>
            {i > 0 && '\n'}
            {i + 1}. {item}
          </>
        ))}
      </>,
    )
    expect(out).toBe('beforevisibleafter1. a\n2. b')
  })

  it('joins block strings with blank line via smart join', () => {
    const out = renderToString(
      <>
        - first rule
        {`- second block line one
- second block line two`}
      </>,
    )
    expect(out).toBe('- first rule\n\n- second block line one\n- second block line two')
  })
})
