---
title: 深拷贝和浅拷贝
category: javascript
---

## 一句话结论

浅拷贝只复制第一层结构，嵌套对象仍然共享引用；深拷贝会递归复制嵌套结构，让新旧对象尽量互不影响。工程中优先使用结构化克隆或成熟工具，手写深拷贝要明确支持范围。

## 为什么需要它

前端状态、接口数据和配置对象经常包含嵌套结构。直接赋值或浅拷贝后修改嵌套对象，可能影响原数据。

- 场景：更新 React/Vue 状态；复制表单初始值；处理缓存数据；防止函数参数被内部修改。
- 不处理会怎样：A 页面改了对象，B 页面看到的数据也变了；历史快照失效；调试时很难定位是谁改了共享引用。

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 基本类型 | 值本身直接保存和复制 | `number`、`string`、`boolean`、`null`、`undefined`、`symbol`、`bigint` |
| 引用类型 | 变量保存的是对象引用 | `object`、`array`、`function` |
| 直接赋值 | 复制引用，不复制对象 | `const b = a` |
| 浅拷贝 | 复制第一层属性 | 展开语法、`Object.assign()`、`slice()` |
| 深拷贝 | 递归复制嵌套对象 | `structuredClone()`、递归实现 |

## 原理

```js
const a = { name: "Alice", address: { city: "Shanghai" } };
const b = { ...a };

b.name = "Bob";
b.address.city = "Beijing";

console.log(a.name); // 'Alice'
console.log(a.address.city); // 'Beijing'
```

`b` 的第一层对象是新的，所以 `name` 不影响 `a`；但 `address` 仍然是同一个引用，所以修改嵌套属性会影响原对象。

## 实现

### 浅拷贝

```js
const source = {
  name: "Alice",
  tags: ["admin"],
};

const copyBySpread = { ...source };
const copyByAssign = Object.assign({}, source);
const copyArray = source.tags.slice();

console.log(copyBySpread === source); // false
console.log(copyBySpread.tags === source.tags); // true
console.log(copyArray === source.tags); // false
```

数组的 `slice()`、`concat()`、展开语法，以及对象的展开语法、`Object.assign()` 都是浅拷贝。

### JSON 深拷贝

```js
const source = {
  name: "Alice",
  age: undefined,
  createdAt: new Date(),
  say() {
    return "hello";
  },
};

const copy = JSON.parse(JSON.stringify(source));

console.log(copy);
```

JSON 方案简单，但会丢失 `undefined`、函数、`Symbol`，会把 `Date` 变成字符串，不能处理循环引用，也不能保留 `Map`、`Set` 等类型。

### structuredClone

```js
const source = {
  user: { name: "Alice" },
  map: new Map([["role", "admin"]]),
  set: new Set([1, 2, 3]),
};

const copy = structuredClone(source);

console.log(copy.user === source.user); // false
console.log(copy.map.get("role")); // 'admin'
```

`structuredClone()` 是现代浏览器和 Node.js 中更可靠的深拷贝 API，支持循环引用和多种内置类型，但不能克隆函数和 DOM 节点。

### 手写基础版

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  const result = Array.isArray(value) ? [] : {};
  seen.set(value, result);

  Reflect.ownKeys(value).forEach((key) => {
    result[key] = deepClone(value[key], seen);
  });

  return result;
}
```

这个版本支持普通对象、数组、`Date`、`RegExp` 和循环引用。它仍然没有完整处理原型、属性描述符、`Map`、`Set`、函数、DOM 节点等复杂类型。

## 边界与常见坑

- **深拷贝不是所有类型都能复制**：函数、DOM、WeakMap、WeakSet 等需要特殊处理或不能复制。
- **JSON 深拷贝会丢信息**：尤其是 `undefined`、函数、`Date`、`NaN`、`Infinity`、循环引用。
- **浅拷贝足够时不要深拷贝**：深拷贝成本更高，也可能掩盖数据流设计问题。
- **状态更新不等于全量深拷贝**：React/Vue 中通常只复制发生变化的路径。
- **循环引用必须用 WeakMap 处理**：否则递归会无限执行。

## 工程取舍

- 适合：复制配置、快照、表单初始值、与外部数据隔离。
- 谨慎：大对象频繁深拷贝、含有函数/类实例/DOM 的复杂结构。
- 应换方案：现代环境优先 `structuredClone()`；复杂兼容需求用成熟库；状态管理优先不可变更新和结构共享。

## 面试 / 自测

1. 直接赋值、浅拷贝、深拷贝分别复制了什么？
2. 为什么 `{ ...obj }` 不能复制嵌套对象？
3. JSON 深拷贝有哪些缺陷？
4. `structuredClone()` 不能克隆哪些常见值？
5. 手写深拷贝为什么要用 `WeakMap`？

## 相关文章

- [数组方法](./array.md)
- [数组去重](./deweight.array.md)
- [内存泄漏](./memory.leak.md)

## 参考

- [MDN: structuredClone](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/structuredClone)
- [MDN: Object.assign](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN: WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
