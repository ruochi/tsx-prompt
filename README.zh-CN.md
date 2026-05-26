# tsx-prompt

[English](README.md) · [中文](README.zh-CN.md)

零依赖、类型安全的 **JSX Prompt 引擎**，专为 LLM 提示词设计。

---

## 还在为这些 prompt 问题头疼吗？

- **受够了** 满屏的 `` `...${变量}...` `` 拼接和 `.join('\n')`？
- **烦透了** 同一段 system 说明在多个分支里复制粘贴，改一处漏一处？
- **不想** 为了看清某个复用块到底输出什么，再去翻 500 行模板文件？
- **苦恼于** 每次调 API 都要手搓 `system` / `user` / `assistant` 消息数组？
- **明明** 在编辑器里把 JSX 缩进排得整整齐齐，最终 prompt 却多出一截行首空格？

**tsx-prompt** 让你像写 UI 一样写 prompt。引擎只做一件事：**`renderToString`**。零运行时依赖，体积只有几 KB。

```bash
npm install tsx-prompt
```

---

## Smart Dedent（智能清缩进）—— 按习惯缩进写，输出自动对齐

**tsx-prompt 内置 Smart Dedent（智能清缩进）**：

- **自然缩进**：在嵌套 JSX、函数里照常排版，和写 React 一样。
- **自动剥离**：计算非空行的公共前导空白并统一去掉。
- **智能整理**：去掉尾部多余空白，压缩连续空行。
- **开箱即用**：每次 `renderToString` 自动应用。

```tsx
function SystemPrompt() {
  return (
    <>
      你是领域专家。
      ## 规则
      - 规则一
    </>
  )
}
// 输出从第 0 列开始
```

---

## 快速开始 —— 拆分 system / user，渲染两次

**不做魔法拆分。** 两个组件 + 两次 `renderToString`：

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from 'tsx-prompt';
import { promptTexts } from './promptTexts';

function SystemPrompt() {
  return (
    <>
      你是领域专家。
      {'\n\n'}
      ## 规则
      {'\n\n'}
      {promptTexts.rules}
    </>
  );
}

function UserPrompt(props: { theme: string; items: string[] }) {
  return (
    <>
      主题：{props.theme}
      {props.items.length > 0 && (
        <>
          {'\n\n'}
          ## 条目
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

零新语法 —— 只用 TypeScript 的 `&&` 和 `.map()`。

---

## 文本字典 —— hover 溯源，无需 JSDoc 双写

同一段 bullet 写在 JSDoc 和 JSX 里容易漂移。**静态文案只写一遍**，放在 `promptTexts` 模块，引用处 hover 常量即可：

```ts
export const promptTexts = {
  /**
   * - 必须为**非空 markdown 字符串**。
   * - 按口播顺序描述每段重点、图标语义、布局倾向。
   */
  pptSpecIntro: `
    - 必须为**非空 markdown 字符串**。
    - 按口播顺序描述每段重点、图标语义、布局倾向。
  `,
} as const;
```

```tsx
{promptTexts.pptSpecIntro}
//  ^ hover 即可看到完整正文
```

详见 [`examples/scene-prompt/`](examples/scene-prompt/)。

![悬停 `promptTexts.segmentsContract` 或薄包装组件](./docs/jsdoc-hover.png)

---

## 架构

| 层级 | 导出 | 作用 |
|------|------|------|
| **核心** | `h`, `Fragment`, `renderToString` | JSX 运行时 + Smart Dedent |
| **语法糖** | `Message`, `renderToMessages`, `renderToPromptParts`, `If`, `For` | 可选 —— 见文末 |
| **你的代码** | `promptTexts`、原生 `&&` / `.map()` | 完整 TS 表达力 |

---

## TypeScript 配置

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
```

---

## 对话消息（`renderToMessages`）

```tsx
import { h, renderToMessages, Message } from 'tsx-prompt'

const messages = renderToMessages(
  <>
    <Message role="system">你是 SVG 动画专家。</Message>
    <Message role="user">画一个脉动红圈。</Message>
  </>,
)
```

---

## 示例项目

[`examples/scene-prompt/`](examples/scene-prompt/)：`SystemPrompt` + `UserPrompt` + `buildPrompt()` + `promptTexts.ts`

```bash
npm run example
npm test
```

---

## 可选语法糖（新项目一般不需要）

### `Message` + `renderToPromptParts`

单文件自上而下、多个 `<Message role="...">` 时，可由引擎按 role 拆分：

```tsx
const { systemRole, userRole } = renderToPromptParts(
  <>
    <Message role="system">...</Message>
    <Message role="user">...</Message>
  </>,
);
```

需要**明确边界、零黑盒**时，优先「两个组件 + 两次 `renderToString`」。

### `<If>` 与 `<For>`

遗留辅助。请用原生 `{cond && ...}` 与 `{arr.map()}`。

---

## 许可

MIT — Copyright (c) 2026 ruochi
