# tsx-prompt

Zero-dependency, type-safe JSX-based Prompt Engine for LLMs.

Use TSX component composition instead of string concatenation to build prompts. Renders to plain text or chat message arrays.

## Architecture

Two layers — core engine plus your own components:

| Layer | Exports | Role |
|-------|---------|------|
| **Core** | `h`, `Fragment`, `Message`, `renderToString`, `renderToMessages`, `renderToPromptParts` | JSX runtime + message parsing |
| **Sugar** | `If`, `For` | Optional list/conditional helpers |
| **Your code** | `{cond && ...}`, `{arr.map()}`, custom fn components, inline `##` headings | Full JS expressiveness |

## Install

```bash
npm install tsx-prompt
```

## TypeScript config

Global config:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

Or per-file pragma (no global jsxFactory required):

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, Message, renderToPromptParts } from 'tsx-prompt';
```

## Prompt parts (system + user)

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

`If` / `For` are optional helpers — native `{cond && ...}` and `{arr.map()}` work identically.

## Chat messages

```tsx
import { h, renderToMessages, Message } from 'tsx-prompt'

const messages = renderToMessages(
  <>
    <Message role="system">You are an SVG animation expert.</Message>
    <Message role="user">Draw a pulsing red circle.</Message>
    <Message role="assistant">{'```xml\n<svg>...</svg>\n```'}</Message>
  </>,
)
// [{ role: 'system', content: '...' }, ...]
```

### Extensible roles

`<Message>` accepts any role string and forwards extra props as metadata:

```tsx
<Message role="developer">Platform instructions.</Message>
<Message role="tool" tool_call_id="call_abc">{"result": 42}</Message>
// => { role: 'tool', content: '...', tool_call_id: 'call_abc' }
```

## String output

```tsx
import { h, Fragment, renderToString } from 'tsx-prompt'

const text = renderToString(
  <>
    Write TypeScript code.
    {true && (
      <>
        ### Rules:
        {['Rule A'].map((rule, i) => `- [${i + 1}] ${rule}`)}
      </>
    )}
  </>,
)
```

## Custom formatting components

Formatting helpers like `Section` are **not** built into the core. Define your own:

```tsx
import { Fragment, renderToString, type Child } from 'tsx-prompt'

export function Section(props: { title: string; children?: Child }): string {
  const body = renderToString(<Fragment>{props.children}</Fragment>).trim()
  return body ? `## ${props.title}\n\n${body}` : `## ${props.title}`
}

export function Quote(props: { children: string }): string {
  return props.children.split('\n').map((line) => `> ${line}`).join('\n')
}
```

Or use inline markdown headings directly in JSX:

```tsx
<Message role="system">
  ## Output contract
  - Return valid JSON only.
</Message>
```

## API

**Core**

- `h`, `Fragment` — JSX runtime
- `Message` — chat role block with extensible `role` and metadata props
- `renderToString(node)` — plain text with smart dedent
- `renderToMessages(node)` — `{ role, content, ...meta }[]`
- `renderToPromptParts(node)` — `{ systemRole, userRole, userRoleParts? }`

**Syntax sugar (optional)**

- `<If condition={boolean}>` — conditional block
- `<For each={array} render={(item, i) => ...} separator="\n" />` — list rendering

**Native JS (fully supported)**

- `{condition && <Fragment>...</Fragment>}` — conditional rendering
- `{array.map((item, i) => ...)}` — list rendering

## Sync to standalone GitHub repo

Develop in the DC monorepo (`packages/tsx-prompt`). To export and commit to [github.com/ruochi/tsx-prompt](https://github.com/ruochi/tsx-prompt):

```bash
# from monorepo root
npm run export:tsx-prompt              # export to ../tsx-prompt
npm run export:tsx-prompt -- --push    # export + git push + tag

# custom path / repo
GITHUB_REPO=ruochi/tsx-prompt ./scripts/export-tsx-prompt.sh /path/to/export --push
```

Create the empty GitHub repository before the first `--push`.

## License

MIT — Copyright (c) 2026 ruochi
