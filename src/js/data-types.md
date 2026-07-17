---
title: 数据类型与数据结构
category: javascript
---

## 一句话结论

JavaScript 有原始类型和对象类型两大类；常用数据结构包括 Array、Object、Map、Set、WeakMap、WeakSet 和 TypedArray。类型判断、拷贝、相等比较和序列化都依赖这些基础。

## 为什么需要它

- 场景：处理接口数据、缓存对象、去重、键值映射、二进制数据、判断空值。
- 不处理会怎样：`typeof null`、数组判断、对象引用、隐式转换和 JSON 序列化都容易出错。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 原始类型 | 不可变的基础值 | `string`、`number`、`bigint`、`boolean`、`undefined`、`symbol`、`null` |
| Object | 引用类型 | 对象、数组、函数、日期等 |
| Array | 有序集合 | 适合索引访问 |
| Map / Set | 键值映射 / 唯一集合 | 支持任意值做 key |
| WeakMap / WeakSet | 弱引用集合 | key 必须是对象，不可枚举 |
| TypedArray | 二进制视图 | 处理 ArrayBuffer |

## 原理

原始值按值语义比较，对象按引用比较。变量保存对象引用时，复制变量不会复制对象本身。

```js
const a = { count: 1 };
const b = a;

b.count = 2;
console.log(a.count); // 2
```

`typeof` 能快速判断多数原始类型，但 `typeof null` 是历史遗留结果 `"object"`。数组判断应使用 `Array.isArray`。

## 实现

### 类型判断

```js
function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
```

### Map 和 Set

```js
const countMap = new Map();
countMap.set("js", 1);
countMap.set({ id: 1 }, "object key");

const unique = new Set([1, 1, 2, 3]);
console.log([...unique]); // [1, 2, 3]
```

## 边界与常见坑

- **`typeof null === "object"` 是历史遗留**。
- **对象 key 会被转成字符串**：需要任意值做 key 时用 `Map`。
- **WeakMap 不可遍历**：它服务于生命周期绑定，不适合做普通字典。
- **BigInt 不能和 Number 隐式混算**。
- **TypedArray 是二进制视图，不是普通数组替代品。**

## 工程取舍

- 适合：普通列表用 Array，字典和缓存用 Map，唯一集合用 Set，私有元数据用 WeakMap。
- 谨慎：对象深拷贝、JSON 序列化和循环引用。
- 不适合或应换方案：复杂不可变状态用结构化方案或状态库，不要手写大量嵌套修改。

## 面试 / 自测

1. JavaScript 有哪些原始类型？
2. 为什么 `typeof null` 是 `"object"`？
3. Map 和 Object 做字典有什么差异？

## 相关文章

- [数组方法](./array.md)
- [数组去重](./deweight.array.md)
- [深拷贝和浅拷贝](./deep.clone.md)

## 参考

- [MDN: JavaScript data types](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures)
- [MDN: Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)
