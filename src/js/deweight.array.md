---
title: 数组去重
category: javascript
---

## 一句话结论

数组去重的本质是判断「两个元素是否应该视为同一个」。基本值去重优先用 `Set`；对象数组去重通常要指定 key；复杂深相等去重需要明确性能和比较规则。

## 为什么需要它

业务数据经常来自多个接口、用户输入或批量合并，可能出现重复项。

- 场景：标签去重、列表合并、按用户 `id` 去重、下拉选项去重。
- 不处理会怎样：UI 重复展示、统计结果错误、提交重复数据。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 严格相等 | `===` 比较 | `NaN !== NaN` |
| SameValueZero | `Set` / `includes` 使用的比较 | `NaN` 等于 `NaN`，`0` 等于 `-0` |
| key 去重 | 根据对象某个字段判断重复 | 常用 `id` |
| 稳定顺序 | 保留首次出现顺序 | `Set` 和 `Map` 都能做到 |
| 时间复杂度 | 判断重复所需成本 | 双循环是 `O(n²)` |

## 原理

对基本值，`Set` 会保存唯一值，并保留插入顺序。

```js
console.log([...new Set([1, 2, 2, NaN, NaN])]); // [1, 2, NaN]
```

对对象，`Set` 比较的是引用，不是内容。

```js
console.log(new Set([{ id: 1 }, { id: 1 }]).size); // 2
```

对象数组需要根据业务字段去重。

## 实现

### 基本值去重

```js
function uniqueValues(array) {
  return [...new Set(array)];
}

console.log(uniqueValues([1, 2, 2, 3])); // [1, 2, 3]
```

### 按 key 去重

```js
function uniqueBy(array, getKey) {
  const seen = new Set();
  const result = [];

  array.forEach((item) => {
    const key = getKey(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  });

  return result;
}

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice2" },
];

console.log(uniqueBy(users, (user) => user.id));
```

这个版本保留第一次出现的元素。如果业务要求保留最后一次，可以用 `Map` 覆盖。

```js
function uniqueByLast(array, getKey) {
  return [...new Map(array.map((item) => [getKey(item), item])).values()];
}
```

### 传统写法对比

```js
function uniqueByIndexOf(array) {
  const result = [];

  array.forEach((item) => {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
  });

  return result;
}
```

`indexOf` 写法简单，但对 `NaN` 无效，且每次都要线性查找，整体是 `O(n²)`。

## 边界与常见坑

- **对象不是按内容去重**：`{ id: 1 }` 和 `{ id: 1 }` 是两个不同引用。
- **`indexOf` 找不到 `NaN`**：基本值去重优先 `Set`。
- **对象属性名去重会字符串化 key**：`obj[1]` 和 `obj["1"]` 是同一个属性名，容易误判。
- **排序去重会改变顺序**：如果业务依赖原顺序，不能先排序。
- **深相等去重成本高**：要明确字段顺序、嵌套结构、循环引用和性能边界。

## 工程取舍

- 适合：基本值去重、按稳定业务 key 去重、列表合并。
- 谨慎：没有唯一 key 的对象数组、需要深相等的大数据量去重。
- 应换方案：频繁按 key 查找和去重时直接维护 `Map` / `Set`；复杂对象比较使用成熟库或先做数据规范化。

## 面试 / 自测

1. `Set` 去重使用什么相等语义？
2. 为什么 `new Set([{ a: 1 }, { a: 1 }]).size` 是 2？
3. 如何保留对象数组中第一次出现的 `id`？
4. `indexOf` 去重有哪些问题？
5. 排序去重会带来什么副作用？

## 相关文章

- [数组方法](./array.md)
- [深拷贝和浅拷贝](./deep.clone.md)

## 参考

- [MDN: Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Equality comparisons and sameness](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)
