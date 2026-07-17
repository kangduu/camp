---
name: js-doc-template
description: >-
  Write, refactor, or review JavaScript documentation for this front-end-camp
  VuePress site. Use when editing src/js/*.md, src/js/README.md, adding JS
  learning notes, reorganizing JavaScript article structure, fixing JS docs
  sidebar/index links, or applying the project's Chinese JS documentation
  template with conclusion, scenario, principle, implementation, boundaries,
  tradeoffs, references, and build validation.
---

# JavaScript Docs

Use this project skill for JavaScript documentation work in this repository.
Produce Chinese documentation for readers learning front-end fundamentals,
interview topics, and practical JavaScript engineering patterns.

## Project Map

- Docs root: `src/`
- JS docs: `src/js/`
- JS entry page: `src/js/README.md`
- Sidebar config: `src/.vuepress/sidebar.ts`
- VuePress config: `src/.vuepress/config.ts`
- Build command: `pnpm run docs:build`
- Package manager: `pnpm`

## First Steps

1. Classify the task:
   - Create a new `src/js/*.md` topic article.
   - Refactor an existing JS article.
   - Rewrite `src/js/README.md`.
   - Fix JS documentation links or sidebar navigation.
2. Read the target file before editing. For new pages, read nearby `src/js/`
   articles, `src/js/README.md`, and the `js` array in
   `src/.vuepress/sidebar.ts`.
3. Preserve useful existing examples, explanations, and links. Remove or rewrite
   only content that is wrong, duplicated, outdated, or structurally confusing.
4. Check file encoding before editing Chinese files. If content appears as
   mojibake, inspect encoding and preserve it unless the task intentionally
   converts the file.
5. Prefer small, targeted changes. Do not rewrite unrelated pages just to match
   a template.

## Article Shape

For a focused topic article, prefer this structure:

1. `一句话结论`
2. `为什么需要它`
3. `核心概念`
4. `原理`
5. `实现`
6. `边界与常见坑`
7. `工程取舍`
8. `面试 / 自测`
9. `相关文章`
10. `参考`

Do not force every section into every article. Keep a section only when it adds
real value. Never leave empty headings or placeholders such as `...`, `xxx.md`,
`关键词1`, or example-only links.

## Frontmatter

For `src/js/*.md` topic pages, use:

````markdown
---
title: 文章标题
category: javascript
---
````

For `src/js/README.md`, use:

````markdown
---
title: JavaScript
icon: fa6-brands:square-js
---
````

Do not add custom fields such as `updated` or `env` unless the user asks for
them or the project already consumes them.

## Topic Template

Use this as a scaffold, then replace all placeholders with real content.

````markdown
---
title: 主题名称
category: javascript
---

## 一句话结论

用 1 到 2 句话说明它是什么、解决什么问题、什么时候该用。

## 为什么需要它

从真实开发场景切入，而不是先贴代码。

- 场景：
- 不处理会怎样：

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
|      |      |      |

## 原理

解释为什么它这样工作。必要时区分浏览器、Node.js、规范行为、
引擎实现细节、教学简化模型和真实运行机制。

## 实现

### 最小可用版

```js
// 只表达核心思路，允许省略非关键边界
function demo() {}
```

说明输入、输出、返回值、副作用和关键约束。

### 完整版

```js
// 补齐 this、参数、返回值、取消、清理、错误和边界参数等
function productionReady() {}
```

如果教学版和完整版没有必要分开，说明原因。

## 边界与常见坑

- 坑：错误表现 -> 原因 -> 正确写法
- 易混点：

## 工程取舍

- 适合：
- 谨慎：
- 不适合或应换方案：

## 面试 / 自测

1. 问题？
2. 追问？
3. 手写要点？

## 相关文章

- [相关主题](./related.md)

## 参考

- [MDN: topic](https://developer.mozilla.org/)
````

## Entry Page

Use `src/js/README.md` as a map, not a place for full topic content.

Recommended groups:

1. 语言基石：执行上下文、`this`、原型、闭包、`new`
2. 异步与并发：Event Loop、Promise/async、Web Worker
3. 工程常用模式：防抖节流、分时、深拷贝、模块
4. 查漏补缺：正则、数组、ES 要点、题集

When rewriting the entry page, include:

- A short description of the section's purpose.
- A recommended reading path.
- A grouped topic index using relative links.
- A note that outdated APIs and historical browser compatibility details are
  marked in the relevant articles.

## Refactor Mapping

When improving existing notes, map old content instead of discarding it:

| Existing content | Target section |
| --- | --- |
| Opening definition or analogy | 一句话结论, 为什么需要它 |
| Terms and data structures | 核心概念 |
| Mechanism explanation | 原理 |
| Handwritten code | 实现 |
| Caveats | 边界与常见坑 |
| Alternatives | 工程取舍 |
| External links | 参考 |

## Technical Standards

- Write the article body in Chinese.
- Lead with conclusions and practical value.
- Prefer precise technical language over loose metaphors.
- Separate teaching snippets from production-oriented snippets when
  implementation is central.
- For production-oriented code, cover `this`, arguments, return value,
  cancellation/cleanup, invalid inputs, and async behavior when relevant.
- Do not present browser-only code as universal JavaScript. State the runtime
  when behavior differs.
- Mark obsolete APIs as historical context and prefer modern standard APIs.
- Distinguish standards, browser behavior, Node.js behavior, and framework
  behavior when they differ.
- Use fenced code blocks with language tags: `js`, `ts`, `html`, `bash`, or
  `markdown`.
- Avoid copying long third-party source code. Summarize the idea and link to
  the source.

## References

Use authoritative sources first:

- MDN for browser APIs and JavaScript reference.
- ECMAScript specification for language semantics.
- WHATWG specs for browser platform behavior.
- Node.js docs for Node-specific APIs.
- Project or library docs for framework/library behavior.

Use blog posts only as supplemental reading. If correctness depends on current
API behavior or standards status, verify against primary sources.

## Links And Navigation

- Use relative links inside `src/js/`, for example
  `[Event Loop](./event.loop.md)`.
- Check that linked files exist.
- When adding a new JS page, add it to the `js` array in
  `src/.vuepress/sidebar.ts` near related topics.
- Add a relevant link from `src/js/README.md` or a related topic when it helps
  discovery.
- Keep `src/js/README.md` and `src/.vuepress/sidebar.ts` conceptually aligned,
  but do not force identical ordering if sidebar ergonomics differ.

## Validation

Before finishing:

- Confirm frontmatter has valid YAML delimiters and a useful `title`.
- Remove empty sections and all template placeholders.
- Resolve every local relative link.
- Confirm code fences have language tags.
- Confirm new pages are reachable from sidebar or a relevant index page.
- Run `pnpm run docs:build` after material docs changes unless the user asks not
  to. If the build fails because of unrelated existing issues, report the first
  relevant error clearly.
