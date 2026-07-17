---
title: 迭代器与生成器
category: javascript
---

## 一句话结论

迭代器定义“如何逐个取值”，生成器用 `function*` 简化迭代器编写。它们是 `for...of`、展开语法、Map、Set、数组遍历和惰性序列的基础。

## 为什么需要它

- 场景：自定义集合遍历、按需生成数据、处理流式数据、实现分页或任务调度。
- 不处理会怎样：只能一次性构造完整数组，浪费内存，也难以表达惰性计算。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| Iterable | 可迭代对象 | 有 `[Symbol.iterator]` 方法 |
| Iterator | 迭代器 | 有 `next()` 方法 |
| `for...of` | 消费 iterable | 读取 value |
| Generator | 生成器函数返回的迭代器 | `yield` 暂停和恢复 |
| Async Iterator | 异步迭代器 | `for await...of` |

## 原理

一个对象只要实现 `[Symbol.iterator]`，就能被 `for...of`、展开语法、解构等消费。迭代器每次返回 `{ value, done }`。

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const end = this.to;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

console.log([...range]); // [1, 2, 3]
```

## 实现

### 生成器

```js
function* range(from, to) {
  for (let current = from; current <= to; current += 1) {
    yield current;
  }
}

console.log([...range(1, 3)]); // [1, 2, 3]
```

### 惰性取前 N 项

```js
function* take(iterable, limit) {
  let count = 0;

  for (const item of iterable) {
    if (count >= limit) return;
    count += 1;
    yield item;
  }
}
```

## 边界与常见坑

- **普通对象默认不可迭代**：不能直接 `for...of {}`。
- **迭代器通常只能消费一次**：消费后状态前进。
- **生成器暂停的是执行流程，不是新线程**。
- **`for...in` 遍历 key，`for...of` 遍历值**。

## 工程取舍

- 适合：惰性序列、自定义集合、分页、遍历协议。
- 谨慎：团队不熟悉生成器时，可读性成本较高。
- 不适合或应换方案：简单数组转换用数组方法更直接。

## 面试 / 自测

1. Iterable 和 Iterator 的区别是什么？
2. `for...of` 依赖哪个协议？
3. 生成器为什么适合惰性序列？

## 相关文章

- [表达式、运算符与控制流](./expressions-control-flow.md)
- [数组方法](./array.md)
- [异步编程](./async.md)

## 参考

- [MDN: Iteration protocols](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: function*](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function*)
