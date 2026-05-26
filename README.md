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

**tsx-prompt** lets you write prompts like UI — compose with components, render to plain text. The engine does one thing well: **`renderToString`**. No runtime deps. A few kilobytes.

```bash
npm install tsx-prompt
```

---

## Smart Dedent — write indented JSX, ship clean prompts

Most prompt libraries force you to left-align every line or call `.trim()` yourself. **tsx-prompt bakes in Smart Dedent**:

- **Indent naturally** inside nested JSX and functions — the way you already write React.
- **Automatically strips** the common leading whitespace from non-empty lines (blank lines ignored when computing indent).
- **Normalizes** trailing space and collapses runaway blank lines so API payloads stay tight.
- **Zero config** — every `renderToString` call applies it for you.

```tsx
function SystemPrompt() {
  return (
    <>
      You are an expert.
      ## Rules
      - Rule one
      - Rule two
    </>
  )
}
// Output starts at column 0 — no accidental 8-space prefix from your editor indent.
```

This is the feature that makes large prompt templates *feel* like normal TypeScript instead of a whitespace puzzle.

---

## Quick start — split system / user, render twice

**No magic split.** Define two focused components and call `renderToString` twice:

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from 'tsx-prompt';
import { promptTexts } from './promptTexts';

function SystemPrompt() {
  return (
    <>
      You are an expert.
      {'\n\n'}
      ## Rules
      {'\n\n'}
      {promptTexts.rules}
    </>
  );
}

function UserPrompt(props: { theme: string; items: string[] }) {
  return (
    <>
      Theme: {props.theme}
      {props.items.length > 0 && (
        <>
          {'\n\n'}
          ## Items
          {'\n\n'}
          {props.items.map((item, i) => `- ${i + 1}. ${item}`)}
        </>
      )}
    </>
  );
}

export function buildPrompt(theme: string, items: string[]) {
  return {
    system: renderToString(<SystemPrompt />),
    user: renderToString(<UserPrompt theme={theme} items={items} />),
  };
}
```

Zero new control-flow syntax — only TypeScript `&&` and `.map()`.

---

## Text dictionary — hover without duplicating JSDoc

Duplicating the same bullets in JSDoc and JSX drifts over time. **Write static copy once** in a `promptTexts` module; hover the constant at the call site:

```ts
// promptTexts.ts
export const promptTexts = {
  /**
   * - Must be a **non-empty markdown string**.
   * - Describe each segment's focus, icon semantics, and layout.
   */
  pptSpecIntro: `
    - Must be a **non-empty markdown string**.
    - Describe each segment's focus, icon semantics, and layout.
  `,
} as const;
```

```tsx
function SystemPrompt() {
  return (
    <>
      ## PPT spec
      {'\n\n'}
      {promptTexts.pptSpecIntro}
    </>
  );
}
//            ^ hover `promptTexts.pptSpecIntro` → full text in tooltip
```

**Structure in the TSX file; content on hover.** See [`examples/scene-prompt/`](examples/scene-prompt/).

![Hover `promptTexts.segmentsContract` or thin wrapper components in Cursor / VS Code](./docs/jsdoc-hover.png)

---

## Architecture

| Layer | Exports | Role |
|-------|---------|------|
| **Core** | `h`, `Fragment`, `renderToString` | JSX runtime + Smart Dedent |
| **Sugar** | `Message`, `renderToMessages`, `renderToPromptParts`, `If`, `For` | Optional — see below |
| **Your code** | `promptTexts`, native `&&` / `.map()`, custom components | Full TS expressiveness |

---

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

---

## Chat messages (`renderToMessages`)

When you need an array of `{ role, content }` for the API:

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

---

## Custom formatting (bring your own)

`Section`, `Quote`, etc. are **not** built in — define what you need, or use inline `##` headings.

---

## Example project

[`examples/scene-prompt/`](examples/scene-prompt/) — `SystemPrompt` + `UserPrompt` + `buildPrompt()` + `promptTexts.ts`:

```bash
npm run example
npm test
```

---

## Optional sugar (you rarely need these)

### `Message` + `renderToPromptParts`

For a **single file** that reads top-to-bottom with multiple `<Message role="...">` blocks, you can let the engine split roles:

```tsx
import { Message, renderToPromptParts } from 'tsx-prompt';

const { systemRole, userRole } = renderToPromptParts(
  <>
    <Message role="system">...</Message>
    <Message role="user">...</Message>
  </>,
);
```

Prefer **two components + two `renderToString` calls** when you want explicit, zero-magic boundaries.

### `<If>` and `<For>`

Legacy helpers. Native `{cond && ...}` and `{arr.map()}` work identically — use those in new code.

```tsx
// Prefer:
{items.length > 0 && items.map((x) => `- ${x}`)}

// Instead of:
<If condition={items.length > 0}>
  <For each={items} render={(x) => `- ${x}`} />
</If>
```

---

## License

MIT — Copyright (c) 2026 ruochi
