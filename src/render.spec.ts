/** @jsxImportSource ./jsx-runtime */
import { describe, expect, it } from 'vitest'
import { h, Fragment } from './h'
import { dedent, normalizeBlankLines } from './dedent'
import { renderToString, renderToMessages, renderToPromptParts } from './render'
import { If } from './components/If'
import { For } from './components/For'
import { Message } from './components/chat'

describe('dedent', () => {
  it('removes common leading spaces', () => {
    const input = '    line one\n    line two'
    expect(dedent(input)).toBe('line one\nline two')
  })

  it('ignores blank lines when computing indent', () => {
    const input = '  a\n\n  b'
    expect(dedent(input)).toBe('a\n\nb')
  })

  it('normalizeBlankLines collapses excessive blank lines', () => {
    expect(normalizeBlankLines('a\n\n\n\nb')).toBe('a\n\nb')
  })
})

describe('h', () => {
  it('flattens nested children arrays', () => {
    const node = h(Fragment, null, ['a', ['b', 'c']])
    expect(renderToString(node)).toBe('abc')
  })

  it('filters null and boolean children', () => {
    const node = h(Fragment, null, 'a', null, false, undefined, 'b')
    expect(renderToString(node)).toBe('ab')
  })
})

describe('renderToString', () => {
  it('renders plain text with interpolation', () => {
    const lang = 'TypeScript'
    const out = renderToString(
      h(Fragment, null, 'Write ', lang, ' code.'),
    )
    expect(out).toBe('Write TypeScript code.')
  })

  it('dedents indented JSX blocks', () => {
    const out = renderToString(
      h(If, { condition: true }, '\n        - first\n        - second\n      '),
    )
    expect(out).toBe('- first\n- second')
  })

  it('If false renders nothing', () => {
    const out = renderToString(
      h(Fragment, null, 'before', h(If, { condition: false }, 'hidden'), 'after'),
    )
    expect(out).toBe('beforeafter')
  })

  it('For renders list items with newline separator', () => {
    const out = renderToString(
      h(For, {
        each: ['x', 'y'],
        render: (item, i) => `${i}:${item}`,
      }),
    )
    expect(out).toBe('0:x\n1:y')
  })

  it('native && conditional renders when truthy', () => {
    const show = true
    const out = renderToString(
      h(Fragment, null, 'before', show && 'visible', 'after'),
    )
    expect(out).toBe('beforevisibleafter')
  })

  it('native && conditional renders nothing when falsy', () => {
    const show = false
    const out = renderToString(
      h(Fragment, null, 'before', show && 'hidden', 'after'),
    )
    expect(out).toBe('beforeafter')
  })

  it('native map renders list items', () => {
    const items = ['a', 'b']
    const out = renderToString(
      h(Fragment, null, items.map((item, i) => `${i + 1}. ${item}`)),
    )
    expect(out).toBe('1. a2. b')
  })

  it('nested Fragment flattens correctly', () => {
    const out = renderToString(
      h(Fragment, null, h(Fragment, null, 'inner')),
    )
    expect(out).toBe('inner')
  })
})

describe('renderToPromptParts', () => {
  it('maps system and user Message to prompt parts', () => {
    const parts = renderToPromptParts(
      h(Fragment, null,
        h(Message, { role: 'system' }, 'system text'),
        h(Message, { role: 'user' }, 'user text'),
      ),
    )
    expect(parts).toEqual({
      systemRole: 'system text',
      userRole: 'user text',
    })
  })

  it('maps multiple user Message blocks to userRoleParts', () => {
    const parts = renderToPromptParts(
      h(Fragment, null,
        h(Message, { role: 'system' }, 'sys'),
        h(Message, { role: 'user' }, 'user1'),
        h(Message, { role: 'user' }, 'user2'),
      ),
    )
    expect(parts.userRole).toBe('user1')
    expect(parts.userRoleParts).toEqual(['user2'])
  })

  it('throws without system Message', () => {
    expect(() => renderToPromptParts(h(Message, { role: 'user' }, 'only user'))).toThrow(
      /requires at least one Message with role="system"/,
    )
  })
})

describe('nested layout', () => {
  it('system Message with inline heading and If', () => {
    const messages = renderToMessages(
      h(Message, { role: 'system' },
        'intro',
        '\n## Constraints\n\nalways',
        h(If, { condition: true }, 'conditional'),
      ),
    )
    expect(messages[0].content).toContain('intro')
    expect(messages[0].content).toContain('## Constraints')
    expect(messages[0].content).toContain('conditional')
  })

  it('inline heading with For list inside user Message', () => {
    const messages = renderToMessages(
      h(Message, { role: 'user' },
        '## Elements\n\n',
        h(For, {
          each: [{ name: 'a' }, { name: 'b' }],
          render: (el, i) => `${i + 1}. ${el.name}`,
        }),
      ),
    )
    expect(messages[0].content).toContain('1. a\n2. b')
  })
})

describe('renderToMessages', () => {
  it('splits system user assistant Message into messages', () => {
    const messages = renderToMessages(
      h(Fragment, null,
        h(Message, { role: 'system' }, 'sys text'),
        h(Message, { role: 'user' }, 'user text'),
        h(Message, { role: 'assistant' }, 'assistant text'),
      ),
    )
    expect(messages).toEqual([
      { role: 'system', content: 'sys text' },
      { role: 'user', content: 'user text' },
      { role: 'assistant', content: 'assistant text' },
    ])
  })

  it('Message with custom role', () => {
    const messages = renderToMessages(
      h(Message, { role: 'developer' }, 'dev instructions'),
    )
    expect(messages).toEqual([
      { role: 'developer', content: 'dev instructions' },
    ])
  })

  it('Message passes through extra metadata', () => {
    const messages = renderToMessages(
      h(Message, { role: 'tool', tool_call_id: 'abc' }, 'tool result'),
    )
    expect(messages).toEqual([
      { role: 'tool', content: 'tool result', tool_call_id: 'abc' },
    ])
  })

  it('throws when no chat tags at root', () => {
    expect(() => renderToString(h(Fragment, null, 'bare'))).not.toThrow()
    expect(() => renderToMessages(h(Fragment, null, 'bare'))).toThrow(
      /requires root-level Message tags/,
    )
  })

  it('throws on bare text at root', () => {
    expect(() =>
      renderToMessages(
        h(Fragment, null, 'orphan', h(Message, { role: 'user' }, 'ok')),
      ),
    ).toThrow(/bare text node/)
  })

  it('dedents message content', () => {
    const messages = renderToMessages(
      h(Message, { role: 'user' }, '\n        hello\n        world\n      '),
    )
    expect(messages[0].content).toBe('hello\nworld')
  })
})

describe('function components', () => {
  function Greeting(props: { name: string }) {
    return h(Fragment, null, 'Hello ', props.name)
  }

  it('renders function components', () => {
    expect(renderToString(h(Greeting, { name: 'World' }))).toBe('Hello World')
  })
})

describe('numbers', () => {
  it('coerces numbers to strings', () => {
    expect(renderToString(h(Fragment, null, 'count: ', 42))).toBe('count: 42')
  })
})

describe('empty input', () => {
  it('renderToString of null is empty', () => {
    expect(renderToString(null)).toBe('')
  })
})
