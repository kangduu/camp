---
name: nodejs-doc-template
description: >-
  Write, refactor, or review Node.js documentation for this front-end-camp
  VuePress site. Use when editing src/node/*.md, src/node/README.md, adding
  Node.js learning notes, reorganizing Node.js article structure, fixing Node
  docs sidebar/index links, or applying the project's Chinese Node.js
  documentation template with runtime boundaries, module-system notes,
  implementation examples, pitfalls, tradeoffs, references, and build
  validation.
---

# Node.js Docs

Use this project skill for Node.js documentation work in this repository.
Produce Chinese documentation for readers who know JavaScript basics and are
learning Node.js runtime behavior, server-side APIs, tooling, and practical
backend engineering patterns.

## Project Map

- Docs root: `src/`
- Node docs: `src/node/`
- Node entry page: `src/node/README.md`
- Sidebar config: `src/.vuepress/sidebar.ts`
- VuePress config: `src/.vuepress/config.ts`
- Build command: `pnpm run docs:build`
- Package manager: `pnpm`

## First Steps

1. Classify the task:
   - Create a new `src/node/*.md` topic article.
   - Refactor an existing Node.js article.
   - Rewrite `src/node/README.md`.
   - Fix Node.js documentation links or sidebar navigation.
   - Compare Node.js runtime behavior with browser JavaScript behavior.
2. Read the target file before editing. For new pages, read nearby
   `src/node/` articles, `src/node/README.md`, and the `nodejs` array in
   `src/.vuepress/sidebar.ts`.
3. Preserve useful examples and links. Rewrite only content that is wrong,
   duplicated, outdated, structurally confusing, or missing Node.js context.
4. Check filename case and local links carefully. Node docs currently include
   mixed-case filenames such as `JSON.md`; sidebar and links should match the
   real filename exactly.
5. Prefer small, targeted changes. Do not rewrite unrelated pages just to match
   a template.

## Article Shape

For focused Node.js topic pages, prefer this structure:

1. `一句话结论`
2. `为什么需要它`
3. `运行时边界`
4. `核心概念`
5. `原理`
6. `实现`
7. `边界与常见坑`
8. `工程取舍`
9. `面试 / 自测`
10. `相关文章`
11. `参考`

Do not force every section into every article. Keep a section only when it adds
real value. Never leave empty headings, placeholder ellipses, fake file links,
keyword-only notes, or example-only links.

## Frontmatter

For `src/node/*.md` topic pages, use:

````markdown
---
title: 文章标题
category: nodejs
---
````

For `src/node/README.md`, use:

````markdown
---
title: Node.js
icon: logos:nodejs-icon
---
````

Do not add custom fields such as `updated` or `env` unless the user asks for
them or the project already consumes them.

## Topic Template

Use this as a scaffold, then replace all placeholders with real content.

````markdown
---
title: 主题名称
category: nodejs
---

## 一句话结论

用 1 到 2 句话说明它是什么、解决什么问题、什么时候应该使用。

## 为什么需要它

从真实开发场景切入，而不是先贴代码。

- 场景：
- 不处理会怎样：

## 运行时边界

说明这个主题属于 Node.js 运行时、JavaScript 语言、操作系统能力、
浏览器平台、npm 包工具，还是框架行为。

| 环境 | 行为 | 备注 |
| ---- | ---- | ---- |
| Node.js |      |      |
| Browser |      |      |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
|      |      |      |

## 原理

解释它为什么这样工作。必要时区分 V8、libuv、Node.js 标准库、操作系统、
CommonJS、ES Module、npm 包和用户代码。

## 实现

### 最小可用版

```js
// 只表达核心思路，允许省略非关键边界
function demo() {}
```

说明输入、输出、返回值、副作用、错误行为和关键约束。

### 工程版

```js
// 补齐错误处理、异步行为、资源释放、路径边界和模块系统差异
async function productionReady() {}
```

如果教学版和工程版没有必要分开，说明原因。

## 边界与常见坑

- 坑：错误表现 -> 原因 -> 正确写法
- 易混点：

## 工程取舍

- 适合：
- 谨慎：
- 不适合或应换方案：

## 面试 / 自测

1. 问题：
2. 追问：
3. 手写要点：

## 相关文章

- [相关主题](./related.md)

## 参考

- [Node.js Docs](https://nodejs.org/api/)
````

## Entry Page

Use `src/node/README.md` as a map, not a place for full topic content.

Recommended groups:

1. 入门与运行：Node.js 安装、`node`、`npm`、`npx`、`nvm`
2. 模块系统：CommonJS、ES Module、`package.json` 的 `type`、`.cjs`、`.mjs`
3. 核心 API：`fs`、`path`、`url`、`process`、`buffer`、`crypto`
4. 异步与并发：Event Loop、EventEmitter、stream、child_process、worker_threads
5. 服务端基础：HTTP、路由、静态资源、环境变量、日志、错误处理
6. 工程实践：包管理、调试、测试、脚本、部署边界、安全和 JWT

When rewriting the entry page, include:

- A short description of the Node.js section's purpose.
- A recommended reading path for JavaScript readers.
- A grouped topic index using relative links.
- A note that browser APIs and Node.js APIs are different runtimes even though
  both use JavaScript.

## Refactor Mapping

| Existing content | Target section |
| --- | --- |
| Opening definition or motivation | 一句话结论, 为什么需要它 |
| Browser or JavaScript comparison | 运行时边界 |
| Node terms and APIs | 核心概念 |
| Runtime mechanism explanation | 原理 |
| Code samples and commands | 实现 |
| Errors and caveats | 边界与常见坑 |
| Alternatives and style advice | 工程取舍 |
| External links | 参考 |

## Technical Standards

- Write the article body in Chinese.
- Assume readers know JavaScript basics; explain what Node.js adds as a runtime.
- Distinguish JavaScript language semantics, Node.js standard library behavior,
  V8 behavior, libuv behavior, operating-system behavior, and package behavior.
- State the Node.js version or stability level when discussing recently added,
  experimental, deprecated, or version-sensitive APIs.
- For module-system topics, explicitly distinguish CommonJS and ES Module:
  `require`, `module.exports`, `import`, `export`, `__dirname`, `import.meta`,
  `package.json` `type`, `.js`, `.cjs`, and `.mjs`.
- For I/O topics, cover sync vs async APIs, callback vs promise APIs, stream
  backpressure, path portability, permissions, cleanup, and error handling when
  relevant.
- For security topics, avoid implying encoding is encryption. Discuss secrets,
  environment variables, JWT expiration, signature verification, and safe
  defaults.
- Use fenced code blocks with language tags: `js`, `ts`, `json`, `bash`,
  `markdown`, or `text`.
- Prefer official Node.js docs, npm docs, package docs, and relevant standards
  for correctness. Use blog posts only as supplemental reading.

## Links And Navigation

- Use relative links inside `src/node/`, for example `[npm](./npm.md)`.
- Check that linked files exist and filename case matches exactly.
- When adding a new Node.js page, add it to the `nodejs` array in
  `src/.vuepress/sidebar.ts` near related topics.
- Add a relevant link from `src/node/README.md` or a related topic when it
  helps discovery.
- Keep `src/node/README.md` and `src/.vuepress/sidebar.ts` conceptually aligned,
  but do not force identical ordering if sidebar ergonomics differ.

## Validation

Before finishing:

- Confirm frontmatter has valid YAML delimiters and a useful `title`.
- Remove empty sections and template placeholders.
- Resolve every local relative link.
- Confirm code fences have language tags.
- Confirm new pages are reachable from sidebar or a relevant index page.
- Run `pnpm run docs:build` after material docs changes unless the user asks not
  to. If the build fails because of unrelated existing issues, report the first
  relevant error clearly.
