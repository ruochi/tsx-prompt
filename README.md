# tsx-prompt

[English](README.md) · [中文](README.zh-CN.md)

**Write prompts with JSX. Render plain text.**

Zero runtime dependencies · type-safe · a few kilobytes.

```bash
npm install tsx-prompt
```

---

## Still fighting prompt strings?

- **Tired of** `` `...${x}...` `` spaghetti and `.join('\n')` everywhere?
- **Sick of** copy-pasting the same system instructions across branches — and they drift out of sync?
- **Hate** opening a 500-line template just to remember what one reusable block actually outputs?
- **Struggling** to split `system` / `user` / `assistant` messages by hand for every API call?
- **Annoyed** that beautiful JSX indentation turns into ugly leading spaces in the final prompt?

**tsx-prompt** lets you write prompts like UI — compose with components, render to plain text. The engine does one thing well: **`renderToString`**. No runtime deps. A few kilobytes.

---

## Three core ideas

| | What you get |
|---|-------------|
| **Compose** | Prompts as components — split `system` / `user`, branch with TypeScript, reuse blocks across files. |
| **Clean output** | `renderToString` → plain text for the API. Smart spacing between markdown blocks; no invented DSL. |
| **Traceable copy** | Static bullets live in `promptTexts`; hover a reference to see the full body in your IDE. |

---

## Quick start

Two components, two renders. See [`examples/scene-prompt/`](examples/scene-prompt/) (`promptTexts.ts` + `buildPrompt.tsx`).

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from 'tsx-prompt';
import { promptTexts } from './promptTexts';
// h / Fragment: for JSX compile only — you rarely call them directly

function SystemPrompt() {
  return (
    <>
      You are an expert.

      ## Rules

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
          ## Items
          {props.items.map((item, i) => (
            <>
              {i > 0 && '\n'}
              - {i + 1}. {item}
            </>
          ))}
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

---

## Smart Dedent

Indent JSX naturally — like React. **Smart Dedent** strips common leading whitespace on every `renderToString`, so editor nesting never leaks into the API payload.

```tsx
function SystemPrompt() {
  return (
    <>
      You are an expert.
      ## Rules
      - Rule one
    </>
  )
}
// → output starts at column 0
```

---

## Text dictionary

Write static copy once in `promptTexts.ts` (with JSDoc). Reference it in TSX — **structure in the file, content on hover**:

```tsx
{promptTexts.segmentsContract}
//  ^ hover → full bullet text in tooltip
```

![Hover `promptTexts.segmentsContract` in Cursor / VS Code](./image.png)

---

## TypeScript setup

### Classic (recommended)

Matches the example above — explicit and easy to copy.

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from 'tsx-prompt';
```

Or in `tsconfig.json`: `"jsx": "react"`, `"jsxFactory": "h"`, `"jsxFragmentFactory": "Fragment"`.

### Automatic JSX Runtime (optional)

If your project already uses `"jsx": "react-jsx"`, set `"jsxImportSource": "tsx-prompt"`. Prompt files then only need:

```tsx
import { renderToString } from 'tsx-prompt';
```

The compiler pulls factories from `tsx-prompt/jsx-runtime`. Rendering is identical to Classic.

---

## Compatibility (legacy APIs)

You rarely need these in new projects.

| API | Notes |
|-----|--------|
| `Message` + `renderToMessages` | Build `{ role, content }[]` from tagged blocks |
| `renderToPromptParts` | Magic-split system/user from one tree — prefer two `renderToString` calls |
| `<If>` / `<For>` | Use native `{cond && ...}` and `{arr.map()}` instead |

`Section`, `Quote`, etc. are **not** built in — use inline `##` headings or your own helpers.

---

## License

MIT — Copyright (c) 2026 ruochi
