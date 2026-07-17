---
title: parseInt、parseFloat
category: javascript
---

## 一句话结论

`parseInt()` 和 `parseFloat()` 都会先把参数转成字符串，再从左到右解析能识别的数字片段。它们适合从带单位的字符串中提取数字，不适合做严格数值校验。

## 为什么需要它

业务中常见 `"12px"`、`"3.14rem"`、`"100%"` 这类带单位或混合字符的输入，需要提取开头的数字部分。

- 场景：解析 CSS 值、处理用户输入、读取 URL 参数中的数字。
- 不处理会怎样：把宽松解析当成严格校验，导致 `"12abc"` 被错误接受为 `12`。

## 核心概念

| 方法 | 解析目标 | 第二参数 | 停止条件 |
| ---- | ---- | ---- | ---- |
| `parseInt(value, radix)` | 整数 | 进制，建议显式传入 | 遇到非当前进制合法字符 |
| `parseFloat(value)` | 浮点数 | 无 | 遇到不属于浮点数字面量的字符 |
| `Number(value)` | 完整数值转换 | 无 | 整个值必须能转换 |

## 原理

`parseInt` 和 `parseFloat` 的解析是宽松的：先忽略开头空白，再尽可能读取前缀中的合法数字字符，遇到不合法字符就停止。

```js
console.log(parseInt("12px", 10)); // 12
console.log(parseFloat("3.14rem")); // 3.14
console.log(Number("12px")); // NaN
```

这也是它们和 `Number()` 的核心区别：`Number()` 要求整体可转换，解析函数只要求前缀可解析。

## 实现

### parseInt

```js
console.log(parseInt("10", 10)); // 10
console.log(parseInt("10", 2)); // 2
console.log(parseInt("ff", 16)); // 255
console.log(parseInt("546", 2)); // NaN
```

工程代码里应显式传入 `radix`，通常是 `10`。虽然现代规范已经明确了默认行为，但显式进制能减少阅读成本和历史环境差异。

### parseFloat

```js
console.log(parseFloat("3.14px")); // 3.14
console.log(parseFloat("  -0.5rem")); // -0.5
console.log(parseFloat("1.2.3")); // 1.2
console.log(parseFloat("abc")); // NaN
```

`parseFloat` 可以解析 `Infinity`，也会在第二个小数点、非法字符处停止。

### 严格整数校验

如果目标是校验「整个字符串必须是整数」，不要只用 `parseInt`。

```js
function parseStrictInteger(value) {
  if (typeof value !== "string" && typeof value !== "number") {
    return NaN;
  }

  const text = String(value).trim();

  if (!/^[+-]?\d+$/.test(text)) {
    return NaN;
  }

  return Number(text);
}

console.log(parseStrictInteger("12")); // 12
console.log(parseStrictInteger("12px")); // NaN
```

## 边界与常见坑

- **`parseInt(4.7 * 1e22, 10)` 可能得到 4**：参数先转字符串，极大数可能变成科学计数法字符串。
- **`parseInt("08")` 历史上有八进制争议**：现代环境一般按十进制，但仍建议显式传 `10`。
- **`parseInt("1.9", 10)` 得到 `1`**：它只解析整数部分，不是四舍五入。
- **`parseFloat("1.2.3")` 得到 `1.2`**：宽松解析会在第二个小数点停止。
- **BigInt 会丢精度**：`parseFloat(900719925474099267n)` 会转成 Number，不能保留大整数精度。

## 工程取舍

- 适合：从带单位字符串前缀提取数字。
- 谨慎：用户表单、金额、数量、权限参数等需要严格校验的场景。
- 应换方案：严格转换用 `Number()` 加正则；大整数用 `BigInt()`；复杂格式用专门解析器。

## 面试 / 自测

1. `parseInt("12px", 10)` 和 `Number("12px")` 分别返回什么？
2. 为什么建议 `parseInt` 总是传第二个参数？
3. `parseFloat("1.2.3")` 的结果是什么？
4. 为什么 `parseInt(0.00000000000434, 10)` 可能得到 4？
5. 如何严格判断一个字符串是否为整数？

## 相关文章

- [正则表达式](./reg-exp.md)
- [数组方法](./array.md)

## 参考

- [MDN: parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
- [MDN: parseFloat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)
- [MDN: Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)
