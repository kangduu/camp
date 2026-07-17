---
title: 测试
category: nodejs
---

## 一句话结论

Node.js 测试可以使用内置 `node:test`，也可以使用 Vitest、Jest、Cypress、Playwright。选择工具时先区分单元测试、集成测试、端到端测试和浏览器测试。

## 为什么需要它

- 场景：验证工具函数、API 路由、数据库访问、CLI 行为、浏览器流程。
- 不处理会怎样：重构靠手测，错误只在线上暴露，升级依赖没有信心。

## 运行时边界

| 工具 | 适合场景 | 备注 |
| ---- | ---- | ---- |
| `node:test` | Node 原生测试 | 无需第三方依赖 |
| Vitest | TS/前端生态友好 | 速度快 |
| Jest | 成熟通用 | 生态广 |
| Playwright | 浏览器 E2E | 多浏览器 |
| Cypress | 浏览器交互测试 | 调试体验好 |

## 实现

### node:test

```js
import test from "node:test";
import assert from "node:assert/strict";

function sum(a, b) {
  return a + b;
}

test("sum", () => {
  assert.equal(sum(1, 2), 3);
});
```

### 测试脚本

```json
{
  "scripts": {
    "test": "node --test"
  }
}
```

## 边界与常见坑

- **单元测试不要依赖真实外部服务**：用 mock 或测试替身。
- **集成测试要清理数据**：保证可重复运行。
- **异步测试必须返回 Promise 或使用 await**。
- **快照不是业务断言**：只适合稳定结构。
- **E2E 少而关键**：覆盖主流程，不要替代单元测试。

## 工程取舍

- 适合：`node:test` 做轻量 Node 库，Vitest 做现代 TS 项目，Playwright 做浏览器链路。
- 谨慎：Jest 配置在 ESM/TS 项目里可能较重。
- 不适合或应换方案：只靠 E2E 会慢且定位困难。

## 面试 / 自测

1. 单元测试和集成测试的边界是什么？
2. Node.js 内置测试模块叫什么？
3. 为什么 E2E 测试不宜覆盖所有细节？

## 相关文章

- [npm](./npm.md)
- [错误处理](./error-handling.md)
- [API 开发](./api-development.md)

## 参考

- [Node.js Docs: Test runner](https://nodejs.org/api/test.html)
- [Vitest](https://vitest.dev/)
- [Jest](https://jestjs.io/)
- [Playwright](https://playwright.dev/)
