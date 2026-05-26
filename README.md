# tsx-prompt

[English](README.md) · [中文](README.zh-CN.md)

Zero-dependency, type-safe **JSX Prompt Engine** for LLMs.

---

## Still fighting prompt strings?

- **Tired of** `` `...${x}...` `` spaghetti and `.join('\n')` everywhere?
- **Sick of** copy-pasting the same system instructions across branches — and they drift out of sync?
- **Hate** opening a 500-line template just to remember what one reusable block actually outputs?
- **Struggling** to split `system` / `user` / `assistant` messages by hand for every API call?
- **Annoyed** that beautiful JSX indentation turns into ugly leading spaces in the final prompt?

**tsx-prompt** lets you write prompts like UI — compose with components, render to plain text or chat message arrays. No runtime deps. A few kilobytes.

```bash
npm install tsx-prompt
```

---

## Smart Dedent — write indented JSX, ship clean prompts

Most prompt libraries force you to left-align every line or call `.trim()` yourself. **tsx-prompt bakes in Smart Dedent**:

- **Indent naturally** inside nested JSX, functions, and `<Message>` blocks — the way you already write React.
- **Automatically strips** the common leading whitespace from non-empty lines (blank lines ignored when computing indent).
- **Normalizes** trailing space and collapses runaway blank lines so API payloads stay tight.
- **Zero config** — every `renderToString` / `renderToMessages` path applies it for you.

```tsx
<Message role="system">
  You are an expert.
  ## Rules
  - Rule one
  - Rule two
</Message>
// Output starts at column 0 — no accidental 8-space prefix from your editor indent.
```

This is the feature that makes large prompt templates *feel* like normal TypeScript instead of a whitespace puzzle.

---

## JSDoc hover — see the full prompt without leaving the call site

Extract repeated instructions into **shared components**. Put a JSDoc block on each `export function` whose body **matches the rendered prompt text**.

![Hover `<SegmentsContract />` in Cursor / VS Code to read the full segments contract](./docs/jsdoc-hover.png)

*From [`examples/scene-prompt/ScenePrompt.tsx`](examples/scene-prompt/ScenePrompt.tsx) — structure in the main file, content on hover.*

```tsx
/**
 * segments[].pptSpec field rules (written to system prompt).
 *
 * - Must be a **non-empty markdown string**.
 * - Describe each segment's focus, icon semantics, and layout for the slide tree.
 */
export function PptSpecFieldIntro() {
  return (
    <>
      - Must be a **non-empty markdown string**.
      - Describe each segment's focus, icon semantics, and layout for the slide tree.
    </>
  )
}
```

At the usage site:

```tsx
<PptSpecFieldIntro />
//     ^ hover in VS Code / Cursor → full bullet list in the tooltip
```

**Read the orchestration file for structure; hover for content.** No more archaeology through nested imports.

---

## Architecture

| Layer | Exports | Role |
|-------|---------|------|
| **Core** | `h`, `Fragment`, `Message`, `renderToString`, `renderToMessages`, `renderToPromptParts` | JSX runtime + message parsing |
| **Sugar** | `If`, `For` | Optional helpers (native `&&` / `.map()` work too) |
| **Your code** | custom components, inline `##` headings, JSDoc | Full JS expressiveness |

## Quick start

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, Message, renderToPromptParts } from 'tsx-prompt';

function MyPrompt(props: { theme: string; items: string[] }) {
  return (
    <>
      <Message role="system">
        You are an expert.

        ## Rules
        - Follow the schema strictly.
      </Message>
      <Message role="user">
        Theme: {props.theme}

        {props.items.length > 0 && (
          <>
            ## Items
            {props.items.map((item, i) => `- ${i + 1}. ${item}`)}
          </>
        )}
      </Message>
    </>
  );
}

const { systemRole, userRole } = renderToPromptParts(
  <MyPrompt theme="demo" items={['a', 'b']} />,
);
```

## TypeScript config

Per-file pragma (recommended):

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
```

Or global `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

## Chat messages & extensible roles

```tsx
import { h, renderToMessages, Message } from 'tsx-prompt'

const messages = renderToMessages(
  <>
    <Message role="system">You are an SVG animation expert.</Message>
    <Message role="user">Draw a pulsing red circle.</Message>
    <Message role="assistant">{'```xml\n<svg>...</svg>\n```'}</Message>
  </>,
)

<Message role="developer">Platform instructions.</Message>
<Message role="tool" tool_call_id="call_abc">{"result": 42}</Message>
```

## Custom formatting (bring your own)

`Section`, `Quote`, etc. are **not** built in — define what you need:

```tsx
import { Fragment, renderToString, type Child } from 'tsx-prompt'

export function Section(props: { title: string; children?: Child }): string {
  const body = renderToString(<Fragment>{props.children}</Fragment>).trim()
  return body ? `## ${props.title}\n\n${body}` : `## ${props.title}`
}
```

Or inline markdown headings directly in JSX.

## Example project

Full runnable sample under [`examples/scene-prompt/`](examples/scene-prompt/):

- `ScenePrompt.tsx` — orchestrates `<Message role="system|user">`
- `components/OutputRules.tsx` — shared blocks with **JSDoc** (hover at call site)
- `components/TimelineSection.tsx` — `<If>` + `<For>` conditional timeline section

```bash
npm run example   # print systemRole + userRole to stdout
npm test          # includes example.spec.ts
```

## API

**Core**

- `h`, `Fragment` — JSX runtime
- `Message` — chat role block (`role` + optional metadata props)
- `renderToString(node)` — plain text + **Smart Dedent**
- `renderToMessages(node)` — `{ role, content, ...meta }[]`
- `renderToPromptParts(node)` — `{ systemRole, userRole, userRoleParts? }`

**Optional sugar**

- `<If condition={boolean}>`, `<For each={...} render={...} />`
- Native `{cond && ...}` and `{arr.map()}` — fully supported

## License

MIT — Copyright (c) 2026 ruochi
