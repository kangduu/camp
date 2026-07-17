---
name: ts-doc-template
description: >-
  Write, refactor, or review TypeScript documentation for this front-end-camp
  VuePress site. Use when editing src/ts/*.md, src/ts/README.md, adding
  TypeScript learning notes, reorganizing TypeScript article structure, fixing
  TypeScript docs sidebar/index links, or comparing TypeScript syntax and
  JavaScript syntax for reader-facing docs.
---

# TypeScript Docs

Use this project skill for TypeScript documentation work in this repository.
Produce Chinese documentation for readers who already know JavaScript and are
learning TypeScript syntax, type-system thinking, and practical front-end usage.

## Project Map

- Docs root: `src/`
- TS docs: `src/ts/`
- TS entry page: `src/ts/README.md`
- Sidebar config: `src/.vuepress/sidebar.ts`
- VuePress config: `src/.vuepress/config.ts`
- Build command: `pnpm run docs:build`
- Package manager: `pnpm`

## First Steps

1. Classify the task:
   - Create a new `src/ts/*.md` topic article.
   - Refactor an existing TS article.
   - Rewrite `src/ts/README.md`.
   - Fix TS documentation links or sidebar navigation.
   - Add a TypeScript-vs-JavaScript syntax comparison.
2. Read the target file before editing. For new pages, read nearby `src/ts/`
   articles, `src/ts/README.md`, and the `ts` array in
   `src/.vuepress/sidebar.ts`.
3. Preserve useful examples and links. Rewrite only content that is wrong,
   duplicated, outdated, structurally confusing, or missing TypeScript context.
4. Check file encoding before editing Chinese files. Preserve encoding unless
   the task intentionally converts it.
5. Prefer small, targeted changes. Do not rewrite unrelated pages just to match
   a template.

## Article Shape

For focused TypeScript topic pages, prefer this structure:

1. `一句话结论`
2. `为什么需要它`
3. `JS 对照`
4. `核心概念`
5. `类型推导 / 类型约束`
6. `实现`
7. `边界与常见坑`
8. `工程取舍`
9. `面试 / 自测`
10. `相关文章`
11. `参考`

Do not force every section into every article. Keep a section only when it adds
real value. Never leave empty headings or placeholders such as `...`, `xxx.md`,
`关键词1`, or example-only links.

## Frontmatter

For `src/ts/*.md` topic pages, use:

````markdown
---
title: 文章标题
category: typescript
---
````

For `src/ts/README.md`, use:

````markdown
---
title: TypeScript
icon: logos:typescript-icon
---
````

Do not add custom fields such as `updated` or `env` unless the user asks for
them or the project already consumes them.

## Topic Template

Use this as a scaffold, then replace all placeholders with real content.

````markdown
---
title: 主题名称
category: typescript
---

## 一句话结论

用 1 到 2 句话说明它是什么、解决什么类型问题、什么时候该用。

## 为什么需要它

- 场景：
- 不处理会怎样：

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
|      |      |      |

说明 TS 增加的是编译期约束、推导或表达能力，运行时仍然是 JS。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
|      |      |      |

## 类型推导 / 类型约束

解释编译器如何推导类型、何时需要显式标注、约束失败会如何报错。

## 实现

### 最小可用版

```ts
function demo(value: string): string {
  return value;
}
```

### 工程版

```ts
function productionReady<T>(value: T): T {
  return value;
}
```

说明输入、输出、类型参数、约束、返回值和运行时行为。

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

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
````

## TS And JS Comparison

When the user asks to compare TypeScript syntax with JavaScript syntax, or when
an article would benefit from a `JS 对照` section, read
`references/ts-js-comparison.md`.

Use the comparison as reader-facing output:

- Lead with the JavaScript baseline, then show the TypeScript form.
- State whether the difference is compile-time only or has runtime output.
- Avoid implying TypeScript changes JavaScript runtime semantics unless the
  emitted JavaScript actually differs.
- Prefer compact tables plus short examples over long prose.

## Entry Page

Use `src/ts/README.md` as a map, not a place for full topic content.

Recommended groups:

1. 入门与运行：安装、`tsc`、`ts-node`、`tsconfig`
2. 类型基础：基础类型、联合类型、交叉类型、类型别名、接口
3. 类型收窄：`typeof`、`instanceof`、`in`、类型谓词、可辨识联合
4. 泛型与类型编程：泛型、`keyof`、`typeof`、`in`、`infer`、工具类型
5. 工程实践：React TS、配置、声明文件、迁移策略

When rewriting the entry page, include:

- A short description of the TypeScript section's purpose.
- A recommended reading path for JavaScript readers.
- A grouped topic index using relative links.
- A note that TypeScript types are erased at runtime unless an article
  explicitly discusses emitted JavaScript.

## Refactor Mapping

| Existing content | Target section |
| --- | --- |
| Opening definition or motivation | 一句话结论, 为什么需要它 |
| JS baseline example | JS 对照 |
| Type terms and syntax | 核心概念 |
| Compiler inference explanation | 类型推导 / 类型约束 |
| Code samples | 实现 |
| Errors and caveats | 边界与常见坑 |
| Alternatives and style advice | 工程取舍 |
| External links | 参考 |

## Technical Standards

- Write the article body in Chinese.
- Assume readers know JavaScript basics; explain what TypeScript adds.
- Distinguish compile-time types, emitted JavaScript, runtime behavior, and
  editor tooling.
- Use `ts` fences for TypeScript code, `js` fences for emitted JavaScript or JS
  comparison snippets, `json` for `tsconfig`, and `bash` for commands.
- Prefer `unknown` over `any` unless explaining escape hatches.
- Mark unsafe assertions (`as`, non-null `!`, double assertions) as tradeoffs.
- Explain TypeScript version requirements for newer syntax such as
  `satisfies`, `const` type parameters, or decorators.
- Avoid presenting type-only examples as runtime behavior.
- Prefer official TypeScript docs and TSConfig reference for correctness.

## Links And Navigation

- Use relative links inside `src/ts/`, for example `[infer](./infer.md)`.
- Check that linked files exist.
- When adding a new TS page, add it to the `ts` array in
  `src/.vuepress/sidebar.ts` near related topics.
- Add a relevant link from `src/ts/README.md` or a related topic when it helps
  discovery.
- Keep `src/ts/README.md` and `src/.vuepress/sidebar.ts` conceptually aligned.

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
