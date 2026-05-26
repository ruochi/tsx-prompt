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

**tsx-prompt** 让你像写 UI 一样写 prompt：组件组合、类型安全，一键渲染成纯文本或对话消息数组。零运行时依赖，体积只有几 KB。

```bash
npm install tsx-prompt
```

---

## Smart Dedent（智能清缩进）—— 按习惯缩进写，输出自动对齐

很多方案逼你把每行 prompt 顶格写，或者在每个模板里手写 `.trim()`。**tsx-prompt 内置 Smart Dedent（智能清缩进）**：

- **自然缩进**：在嵌套 JSX、函数组件、`<Message>` 里照常排版，和写 React 一样。
- **自动剥离**：计算非空行的公共前导空白并统一去掉（空行不参与计算）。
- **智能整理**：去掉尾部多余空白，把连续空行压成合理间距，发给模型的 payload 更干净。
- **开箱即用**：`renderToString` / `renderToMessages` 全路径自动应用，无需配置。

```tsx
<Message role="system">
  你是领域专家。
  ## 规则
  - 规则一
  - 规则二
</Message>
// 输出从第 0 列开始 —— 不会因为编辑器缩进而多出 8 个空格
```

大段 prompt 模板终于可以当普通 TypeScript 维护，而不是 whitespace 解谜游戏。

---

## JSDoc hover —— 引用组件时，悬停即可看到完整 prompt 正文

把重复说明抽成**共享组件**，在 `export function` 上写 **与 JSX 渲染正文一致的 JSDoc**：

```tsx
/**
 * segments[].pptSpec 字段说明（写入 system prompt）。
 *
 * - 必须为**非空 markdown 字符串**。
 * - 按口播顺序描述每段重点、图标语义、布局倾向与承接关系。
 */
export function PptSpecFieldIntro() {
  return (
    <>
      - 必须为**非空 markdown 字符串**。
      - 按口播顺序描述每段重点、图标语义、布局倾向与承接关系。
    </>
  )
}
```

在使用处：

```tsx
<PptSpecFieldIntro />
//     ^ 在 VS Code / Cursor 悬停 → tooltip 显示完整 bullet 列表
```

**主文件看结构，hover 看内容。** 不必再顺着 import 链考古。

---

## 架构

| 层级 | 导出 | 作用 |
|------|------|------|
| **核心** | `h`, `Fragment`, `Message`, `renderToString`, `renderToMessages`, `renderToPromptParts` | JSX 运行时 + 消息解析 |
| **语法糖** | `If`, `For` | 可选（原生 `&&` / `.map()` 同样支持） |
| **你的代码** | 自定义组件、inline `##` 标题、JSDoc | 完整 JS 表达力 |

## 快速开始

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, Message, renderToPromptParts } from 'tsx-prompt';

function MyPrompt(props: { theme: string; items: string[] }) {
  return (
    <>
      <Message role="system">
        你是领域专家。

        ## 规则
        - 严格遵守 schema。
      </Message>
      <Message role="user">
        主题：{props.theme}

        {props.items.length > 0 && (
          <>
            ## 条目
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

## TypeScript 配置

文件头 pragma（推荐）：

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
```

或全局 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

## 对话消息与可扩展 role

```tsx
import { h, renderToMessages, Message } from 'tsx-prompt'

const messages = renderToMessages(
  <>
    <Message role="system">你是 SVG 动画专家。</Message>
    <Message role="user">画一个脉动红圈。</Message>
    <Message role="assistant">{'```xml\n<svg>...</svg>\n```'}</Message>
  </>,
)

<Message role="developer">平台级指令。</Message>
<Message role="tool" tool_call_id="call_abc">{"result": 42}</Message>
```

## 自定义排版（自带组件）

`Section`、`Quote` 等**不内置**，按需自己写：

```tsx
import { Fragment, renderToString, type Child } from 'tsx-prompt'

export function Section(props: { title: string; children?: Child }): string {
  const body = renderToString(<Fragment>{props.children}</Fragment>).trim()
  return body ? `## ${props.title}\n\n${body}` : `## ${props.title}`
}
```

也可以直接在 JSX 里写 `##` 标题。

## API

**核心**

- `h`, `Fragment` — JSX 运行时
- `Message` — 对话块（`role` + 可选元数据 props）
- `renderToString(node)` — 纯文本 + **Smart Dedent（智能清缩进）**
- `renderToMessages(node)` — `{ role, content, ...meta }[]`
- `renderToPromptParts(node)` — `{ systemRole, userRole, userRoleParts? }`

**可选语法糖**

- `<If condition={boolean}>`, `<For each={...} render={...} />`
- 原生 `{cond && ...}`、`{arr.map()}` — 完全支持

## 许可

MIT — Copyright (c) 2026 ruochi
