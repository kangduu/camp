---
title: 相等比较
category: javascript
---

## 一句话结论

JavaScript 常见相等比较有 `==`、`===`、`Object.is` 和 SameValueZero。日常业务默认使用 `===`，只有明确知道转换规则时才考虑 `==`。

## 为什么需要它

- 场景：判断空值、数组去重、Map/Set 查找、React 状态比较、处理 `NaN` 和 `-0`。
- 不处理会怎样：隐式转换导致条件误判，`NaN` 比较失败，`0` 和 `-0` 的边界被忽略。

## 核心概念

| 比较方式 | 特点 | 典型用途 |
| ---- | ---- | ---- |
| `==` | 允许类型转换 | 兼容旧代码，少用 |
| `===` | 不做类型转换 | 默认选择 |
| `Object.is` | 区分 `0` 和 `-0`，认为 `NaN` 等于自身 | 状态比较 |
| SameValueZero | `NaN` 等于自身，不区分 `0` 和 `-0` | `Set`、`Map`、`includes` |

## 原理

`==` 会执行抽象相等比较，涉及布尔值、字符串、数字、对象到原始值的转换。`===` 类型不同直接返回 `false`，对象仍按引用比较。

```js
console.log(0 == false); // true
console.log(0 === false); // false

console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true

console.log([1] === [1]); // false
```

## 实现

### 判断空值

```js
function isNil(value) {
  return value === null || value === undefined;
}
```

旧代码有时写 `value == null` 同时匹配 `null` 和 `undefined`，但团队规范里应明确允许范围。

### 去重

```js
const unique = [...new Set([NaN, NaN, 1, 1])];
console.log(unique); // [NaN, 1]
```

## 边界与常见坑

- **对象比较的是引用**：两个字面量内容相同也不相等。
- **`NaN !== NaN`**：判断 `NaN` 用 `Number.isNaN` 或 `Object.is`。
- **`includes` 和 `indexOf` 不完全一样**：`includes` 能找到 `NaN`。
- **不要滥用 `==`**：隐式转换规则复杂，可读性差。

## 工程取舍

- 适合：默认 `===`，需要比较 `NaN` 时用 `Object.is` 或 `Number.isNaN`。
- 谨慎：`value == null` 这种简写要有团队共识。
- 不适合或应换方案：深层对象比较使用专门函数，不要用 JSON 字符串比较。

## 面试 / 自测

1. `==` 和 `===` 的核心区别是什么？
2. `Object.is(NaN, NaN)` 为什么是 `true`？
3. Set 使用的相等算法有什么特点？

## 相关文章

- [数据类型与数据结构](./data-types.md)
- [数组去重](./deweight.array.md)
- [parseInt / parseFloat](./parseInt.parseFloat.md)

## 参考

- [MDN: Equality comparisons and sameness](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
- [ECMAScript: Equality Operators](https://tc39.es/ecma262/#sec-equality-operators)
