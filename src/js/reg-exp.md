---
title: 正则表达式
category: javascript
---

## 一句话结论

正则表达式是一种用模式匹配字符串的工具，适合做格式校验、文本提取、替换和简单解析。写正则时要同时关注匹配范围、边界、分组、贪婪程度和可维护性。

## 为什么需要它

前端经常需要处理用户输入和文本数据，例如校验表单、提取 URL 参数、格式化模板字符串、替换敏感词。

- 场景：校验手机号/邮箱/金额；从日志中提取字段；按规则替换字符串。
- 不处理会怎样：手写字符串遍历容易遗漏边界，复杂规则分散在多处难维护。

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 字符类 | 匹配一类字符 | `\d`、`\w`、`[a-z]` |
| 量词 | 控制出现次数 | `*`、`+`、`?`、`{1,3}` |
| 边界 | 限定位置而非字符 | `^`、`$`、`\b` |
| 分组 | 把一段模式作为整体 | `(abc)` |
| 捕获引用 | 引用前面捕获的内容 | `\1` |
| 修饰符 | 改变匹配模式 | `g`、`i`、`m`、`u` |

## 原理

正则引擎会从字符串中尝试匹配模式。多数 JavaScript 正则是回溯型匹配：当某条路径失败时，引擎会回退到之前的选择点尝试其他路径。复杂正则如果写得不谨慎，可能产生性能问题。

常见优先级从高到低大致是：转义字符、括号分组、量词、连接、或运算。

```js
console.log(/^a|bc$/.test("ax")); // true
console.log(/^(a|bc)$/.test("ax")); // false
```

括号能明确表达作用范围，避免读者误解。

## 实现

### 常用校验

```js
const rules = {
  positiveInteger: /^[1-9]\d*$/,
  zeroToOne: /^0(\.\d+)?$/,
  positiveNumber: /^(0\.\d+|[1-9]\d*(\.\d+)?)$/,
};

console.log(rules.positiveInteger.test("12")); // true
console.log(rules.zeroToOne.test("0.5")); // true
console.log(rules.positiveNumber.test("10.5")); // true
```

正则只能判断格式，不负责业务语义。例如金额精度、最大值、地区号码段，通常还需要额外逻辑配合。

### 捕获和反向引用

`\1` 表示第一个捕获分组匹配到的内容，常用于查找连续重复字符。

```js
const pattern = /(\w)\1*/g;

console.log("aaabbc".match(pattern)); // ['aaa', 'bb', 'c']
```

找出连续出现最长的字符片段：

```js
function findLongestRun(str) {
  const runs = str.match(/(\w)\1*/g) || [];

  return runs.reduce(
    (max, item) => (item.length > max.length ? item : max),
    ""
  );
}

console.log(findLongestRun("abbcccdd")); // 'ccc'
```

如果要找「全字符串中出现次数最多的字符」，应先统计频次，而不是依赖连续匹配。

```js
function findMostFrequentChar(str) {
  const countMap = new Map();

  for (const char of str) {
    countMap.set(char, (countMap.get(char) || 0) + 1);
  }

  return [...countMap.entries()].sort((a, b) => b[1] - a[1])[0] || null;
}
```

## 边界与常见坑

- **`g` 修饰符会让 `test()` 记住 `lastIndex`**：复用同一个全局正则时，连续 `test()` 可能得到交替结果。
- **`.` 默认不匹配换行**：需要跨行可用 `s` 修饰符或 `[\s\S]`。
- **贪婪匹配可能吃太多**：`.*` 会尽量多匹配，需要时用 `.*?`。
- **不要用复杂正则解析完整 HTML 或 JSON**：应使用解析器。
- **用户输入拼进正则要转义**：否则特殊字符会改变模式含义。

## 工程取舍

- 适合：局部格式校验、简单提取、稳定文本替换。
- 谨慎：长正则、业务规则频繁变化、需要详细错误提示的表单校验。
- 应换方案：复杂语法用解析器；大型表单校验用 schema 校验库；需要国际化号码/邮箱校验时使用成熟库。

## 面试 / 自测

1. `\1` 在正则中是什么意思？
2. `^a|bc$` 和 `^(a|bc)$` 的区别是什么？
3. 为什么带 `g` 的正则连续调用 `test()` 可能不稳定？
4. 贪婪匹配和非贪婪匹配如何写？
5. 什么时候不应该继续加复杂正则，而应换解析器？

## 相关文章

- [数组方法](./array.md)
- [parseInt / parseFloat](./parseInt.parseFloat.md)

## 参考

- [MDN: Regular expressions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions)
- [MDN: RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
