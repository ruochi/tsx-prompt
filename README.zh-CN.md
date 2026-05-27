# tsx-prompt

[English](README.md) · [中文](README.zh-CN.md)

**用 JSX 写 prompt，输出纯文本。**

零运行时依赖 · 类型安全 · 体积几 KB。

```bash
npm install tsx-prompt
```

---

## 还在为这些 prompt 问题头疼吗？

- **受够了** 满屏的 `` `...${变量}...` `` 拼接和 `.join('\n')`？
- **烦透了** 同一段 system 说明在多个分支里复制粘贴，改一处漏一处？
- **不想** 为了看清某个复用块到底输出什么，再去翻 500 行模板文件？
- **苦恼于** 每次调 API 都要手搓 `system` / `user` / `assistant` 消息数组？
- **明明** 在编辑器里把 JSX 缩进排得整整齐齐，最终 prompt 却多出一截行首空格？

**tsx-prompt** 让你像写 UI 一样写 prompt —— 用组件组合，渲染成纯文本。引擎只做一件事：**`renderToString`**。零运行时依赖，体积只有几 KB。

---

## 三个核心价值

| | 你得到什么 |
|---|-----------|
| **可组合** | Prompt 像组件 —— 拆分 system / user、TypeScript 分支、跨文件复用块。 |
| **干净输出** | `renderToString` → 纯文本；markdown 块之间智能换行，无额外 DSL。 |
| **可追踪文案** | 静态 bullet 放 `promptTexts`；引用处 hover 即可看到完整正文。 |

---

## 快速开始

两个组件，渲染两次。完整示例见 [`examples/scene-prompt/`](examples/scene-prompt/)（`promptTexts.ts` + `buildPrompt.tsx`）。

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from 'tsx-prompt';
import { promptTexts } from './promptTexts';
// h / Fragment 供 JSX 编译，通常不必手写

function SystemPrompt() {
  return (
    <>
      你是领域专家。

      ## 规则

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
          ## 条目
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

## Smart Dedent（智能清缩进）

像写 React 一样自然缩进。**Smart Dedent** 在每次 `renderToString` 时剥掉公共前导空白，编辑器里的嵌套不会污染最终 prompt。

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
// → 输出从第 0 列开始
```

---

## 文本字典

静态文案写在 `promptTexts.ts`（带 JSDoc），TSX 里引用 —— **结构在文件里，内容 hover 可见**：

```tsx
{promptTexts.segmentsContract}
//  ^ hover → 完整 bullet 正文
```

![悬停 `promptTexts.segmentsContract`](./image.png)

---

## TypeScript 配置

### Classic（推荐）

与上方示例一致，原理可见、复制即用。

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, renderToString } from 'tsx-prompt';
```

或 `tsconfig.json`：`"jsx": "react"`、`"jsxFactory": "h"`、`"jsxFragmentFactory": "Fragment"`。

### Automatic JSX Runtime（可选）

项目已用 `"jsx": "react-jsx"` 时，设 `"jsxImportSource": "tsx-prompt"`，prompt 文件只需：

```tsx
import { renderToString } from 'tsx-prompt';
```

编译器从 `tsx-prompt/jsx-runtime` 自动导入 JSX 工厂，渲染结果与 Classic 相同。

---

## 兼容能力（旧 API）

新项目一般不需要。

| API | 说明 |
|-----|------|
| `Message` + `renderToMessages` | 从带 role 的块构建 `{ role, content }[]` |
| `renderToPromptParts` | 单棵树魔法拆分 system/user —— 更推荐两次 `renderToString` |
| `<If>` / `<For>` | 请用原生 `{cond && ...}` 与 `{arr.map()}` |

`Section`、`Quote` 等**未内置** —— 直接用 `##` 标题或自建 helper。

---

## 许可

MIT — Copyright (c) 2026 ruochi
