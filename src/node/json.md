---
title: JSON 与数据交换
category: nodejs
---

## 一句话结论

JSON 是最常见的 Web 数据交换格式，Node.js 中通常用 `JSON.stringify` 序列化、`JSON.parse` 反序列化；它是数据格式，不是 JavaScript 对象本身，也不是加密方案。

## 为什么需要它

- 场景：HTTP API 请求响应、配置文件、日志结构化输出、进程间传递小型数据。
- 不处理会怎样：把不可序列化值写进响应、误以为 Date 能自动还原、解析不可信 JSON 时崩溃。

## 运行时边界

| 环境 | 行为 | 备注 |
| ---- | ---- | ---- |
| Node.js | 内置 `JSON` 对象 | 和浏览器语义基本一致 |
| HTTP | JSON 只是响应体格式 | 还需要正确 `Content-Type` |
| 文件系统 | JSON 文件是文本 | 读写要处理编码和异常 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 序列化 | JS 值转 JSON 字符串 | `JSON.stringify` |
| 反序列化 | JSON 字符串转 JS 值 | `JSON.parse` |
| `replacer` | 控制序列化字段或值 | 第二个参数 |
| `reviver` | 控制解析后的值 | `JSON.parse` 第二个参数 |
| `toJSON` | 自定义序列化输出 | Date 会使用它 |

## 原理

JSON 只支持对象、数组、字符串、数字、布尔值和 `null`。`undefined`、函数、Symbol 不会作为对象属性输出；`NaN` 和 `Infinity` 会变成 `null`；Date 会输出 ISO 字符串。

## 实现

### API 响应

```js
import http from "node:http";

http
  .createServer((req, res) => {
    const body = JSON.stringify({ ok: true, path: req.url });

    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(body);
  })
  .listen(3000);
```

### 安全解析

```js
export function parseJson(value) {
  try {
    return { ok: true, data: JSON.parse(value) };
  } catch (error) {
    return { ok: false, error };
  }
}
```

## 边界与常见坑

- **JSON 不是 JS 对象字面量**：JSON key 必须用双引号，不能有注释和尾逗号。
- **Date 不会自动还原**：解析后是字符串，需要显式转回 Date。
- **BigInt 不能直接序列化**：需要转成字符串或自定义 `toJSON`。
- **不要用 `eval` 解析 JSON**：使用 `JSON.parse`。
- **大文件不要一次性全读**：大规模数据考虑流式格式或数据库。

## 工程取舍

- 适合：API 数据交换、配置、小型结构化数据。
- 谨慎：日志里输出隐私字段，或把错误对象直接序列化。
- 不适合或应换方案：超大数据流、二进制协议、强 schema 校验场景。

## 面试 / 自测

1. `undefined` 在对象和数组中序列化结果有什么差异？
2. 为什么 Date 解析回来不是 Date 对象？
3. JSON 和 JWT payload 是否能存敏感信息？

## 相关文章

- [API 开发](./api-development.md)
- [认证与 JWT](./jwt.md)
- [文件系统与路径](./files-paths.md)

## 参考

- [MDN: JSON](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [MDN: JSON.stringify](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN: JSON.parse](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
