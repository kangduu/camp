---
title: 数组方法
category: javascript
---

## 一句话结论

`Array` 是 JavaScript 里处理有序集合的核心类型，常用于列表渲染、接口数据整理、表单选项、队列和批量计算。写对数组代码的关键不是背 API，而是先判断：是否会修改原数组、是否需要提前退出、比较规则是按值还是按引用、数据规模是否适合线性遍历。

## 为什么需要它

真实业务里很少直接使用原始接口数据，通常要先经过筛选、映射、排序、聚合、去重，再交给视图或下一层逻辑。

- 场景：商品列表按条件过滤后排序；用户列表按角色分组；表格行数据映射成下拉选项；在 UI 状态中新增、删除、移动元素。
- 不处理会怎样：误用 `sort` / `splice` 修改原数组导致状态串联；用 `indexOf` 查「内容相同」的对象永远找不到；在 `forEach` 里想 `break` 却停不下来；在大数组里反复嵌套查找造成明显卡顿。

## 核心概念

| 概念 | 含义 | 典型 API |
| ---- | ---- | ---- |
| 静态方法 | 挂在 `Array` 构造函数上，不依赖某个数组实例 | `Array.isArray()`、`Array.from()`、`Array.of()` |
| 实例方法 | 挂在 `Array.prototype` 上，由具体数组调用 | `map()`、`filter()`、`reduce()`、`sort()` |
| 改原数组 | 方法执行后当前数组本身被改写 | `push()`、`splice()`、`sort()`、`reverse()` |
| 返回新数组 | 不改原数组，结果是新的数组引用 | `map()`、`filter()`、`slice()`、`concat()` |
| 返回标量 | 结果不是数组，而是元素、索引、布尔值或聚合值 | `find()`、`findIndex()`、`some()`、`reduce()` |
| 空槽 | 稀疏数组里缺失的下标，不等同于值为 `undefined` 的元素 | `const arr = [1, , 3]` |

### 按任务选方法

| 任务 | 优先方法 | 说明 |
| ---- | ---- | ---- |
| 判断是否数组 | `Array.isArray(value)` | 跨 iframe / realm 时比 `instanceof Array` 更可靠 |
| 类数组或可迭代转数组 | `Array.from(value)` | 可接收第二个映射函数 |
| 创建固定元素数组 | `Array.of(1, 2, 3)` | 避免 `Array(3)` 表示长度而不是元素 |
| 逐项转换 | `map()` | 输入几个有效元素，通常输出几个元素 |
| 条件过滤 | `filter()` | 保留回调返回真值的元素 |
| 查找元素 | `find()` | 找到第一个匹配元素后停止 |
| 查找索引 | `findIndex()` / `indexOf()` | 对象条件查找用 `findIndex()` |
| 判断是否存在 | `includes()` / `some()` | 基本值用 `includes()`，复杂条件用 `some()` |
| 判断是否全部满足 | `every()` | 遇到第一个 `false` 提前结束 |
| 聚合成一个值 | `reduce()` | 适合求和、分组、索引表等 |
| 浅拷贝片段 | `slice()` | 不改原数组 |
| 增删替换片段 | `splice()` | 会改原数组 |
| 排序 | `toSorted()` / `[...arr].sort()` | 避免直接改状态数组 |
| 展平 | `flat()` / `flatMap()` | `flatMap()` 等于先 `map()` 再展开一层 |

### 会改变原数组的方法

| 方法 | 作用 | 返回值 |
| ---- | ---- | ---- |
| `push()` | 尾部添加 | 新长度 |
| `pop()` | 尾部删除 | 被删除元素 |
| `unshift()` | 头部添加 | 新长度 |
| `shift()` | 头部删除 | 被删除元素 |
| `splice()` | 从指定位置删除、插入或替换 | 被删除元素组成的数组 |
| `sort()` | 原地排序 | 排序后的原数组引用 |
| `reverse()` | 原地反转 | 反转后的原数组引用 |
| `fill()` | 用固定值填充区间 | 填充后的原数组引用 |
| `copyWithin()` | 把数组内部片段复制到另一个位置 | 修改后的原数组引用 |

较新的 `toSorted()`、`toReversed()`、`toSpliced()`、`with()` 是对应的不可变版本：返回新数组，不修改原数组。写 React/Vue 状态更新时，优先选择不可变写法。

## 原理

数组本质上仍然是对象，只是带有特殊的整数索引和 `length` 行为。设置一个大于等于当前长度的有效数组索引会推高 `length`；缩短 `length` 会删除超出范围的元素。

```js
const arr = [];

arr[2] = "c";

console.log(arr.length); // 3
console.log(arr); // [empty x 2, 'c']

arr.length = 1;

console.log(arr[2]); // undefined
```

多数迭代方法会先确定本次遍历的长度边界，再按索引访问元素。`map()`、`filter()`、`forEach()`、`some()`、`every()` 等会跳过空槽；`keys()` 会产生所有索引，`entries()` 访问空槽时会得到 `undefined`。因此不要把稀疏数组当成普通密集数组来推理。

```js
const sparse = [1, , 3];

console.log(sparse.map((item) => item * 2)); // [2, empty, 6]
console.log([...sparse.keys()]); // [0, 1, 2]
console.log([...sparse.entries()]); // [[0, 1], [1, undefined], [2, 3]]
```

相等比较也要分清：

- `indexOf()` / `lastIndexOf()` 使用严格相等语义，找不到 `NaN`。
- `includes()` 使用 SameValueZero 语义，可以找到 `NaN`，并认为 `0` 与 `-0` 相等。
- 对象、数组、函数都按引用比较，不按内容深比较。

```js
console.log([NaN].indexOf(NaN)); // -1
console.log([NaN].includes(NaN)); // true

const user = { id: 1 };
console.log([user].includes({ id: 1 })); // false
console.log([user].includes(user)); // true
```

`some()`、`every()`、`find()`、`findIndex()` 在结果已经确定时会提前结束；`forEach()`、`map()`、`filter()` 没有规范意义上的 `break`。

## 实现

### 最小可用版：先按意图区分 API

```js
const users = [
  { id: 1, name: "Alice", age: 17, role: "guest" },
  { id: 2, name: "Bob", age: 20, role: "admin" },
  { id: 3, name: "Carol", age: 22, role: "guest" },
];

const names = users.map((user) => user.name);
const adults = users.filter((user) => user.age >= 18);
const admin = users.find((user) => user.role === "admin");
const hasMinor = users.some((user) => user.age < 18);
const allHaveId = users.every((user) => user.id != null);

console.log(names); // ['Alice', 'Bob', 'Carol']
console.log(adults.length); // 2
console.log(admin.name); // 'Bob'
console.log(hasMinor); // true
console.log(allHaveId); // true
```

这类写法的输入是数组，输出可能是新数组、单个元素、布尔值或其他标量。它们不主动修改原数组，副作用只来自你在回调里修改了外部状态或元素对象本身。

### 完整版：安全排序、分组和索引表

```js
function sortByAgeAsc(users) {
  const compareByAge = (a, b) => a.age - b.age;

  if (typeof users.toSorted === "function") {
    return users.toSorted(compareByAge);
  }

  return [...users].sort(compareByAge);
}

function groupByRole(users) {
  return users.reduce((groups, user) => {
    const role = user.role;

    if (!groups[role]) {
      groups[role] = [];
    }

    groups[role].push(user);
    return groups;
  }, {});
}

function indexById(users) {
  return users.reduce((map, user) => {
    map.set(user.id, user);
    return map;
  }, new Map());
}
```

这里有三个工程要点：

1. 排序时传比较函数，避免默认按字符串排序。
2. 不直接 `users.sort()`，避免调用方传入的数组被改写。
3. 大量按 `id` 查询时先建 `Map`，避免每次都 `find()` 线性扫描。

### 类数组与可迭代对象

`Array.from()` 既能处理类数组，也能处理可迭代对象；展开语法 `...` 只能展开可迭代对象。

```js
const chars = Array.from("abc", (char) => char.toUpperCase());

console.log(chars); // ['A', 'B', 'C']

function collectArgs() {
  return Array.from(arguments);
}

console.log(collectArgs(1, 2, 3)); // [1, 2, 3]
```

在浏览器里，`document.querySelectorAll()` 返回的 `NodeList` 可以用 `Array.from()` 或展开语法转数组；在通用 JavaScript 文档中不要把 DOM 示例当成所有运行时都可用。

## 边界与常见坑

- **`sort()` 默认不是数字升序**：默认会把元素转成字符串再比较，`[10, 2, 1].sort()` 得到 `[1, 10, 2]`。数字排序写 `arr.toSorted((a, b) => a - b)` 或 `[...arr].sort((a, b) => a - b)`。
- **`splice()` 和 `slice()` 只差一个字母但语义相反**：`slice()` 截取并返回新数组；`splice()` 增删替换并修改原数组。
- **`indexOf()` 找不到长得一样的对象**：对象按引用比较。内容条件查找用 `find()` / `findIndex()`，或者先把数据规范化成 `id`、字符串 key、`Map` / `Set`。
- **`forEach()` 不适合提前退出**：需要提前结束时用 `some()`、`every()`、`find()`、`for...of` 或普通 `for`。
- **`reduce()` 不传初始值有风险**：空数组会抛 `TypeError`，并且第一项会被当成初始累加值。工程代码里建议显式传初始值。
- **链式调用可能制造多次数组遍历**：`filter().map().reduce()` 可读性好，但大数组热点路径要关注中间数组和多次遍历成本。
- **浅拷贝不是深拷贝**：`slice()`、`concat()`、展开语法只复制第一层数组结构，数组里的对象仍然是同一引用。
- **空槽和 `undefined` 不完全一样**：`[undefined]` 有一个元素，`[,]` 是一个空槽。迭代、序列化和控制台展示都可能不同。

## 工程取舍

- 适合：中小规模列表处理、视图派生数据、一次性数据清洗、声明式表达筛选和映射逻辑。
- 谨慎：在状态管理里直接调用 `push()`、`splice()`、`sort()`、`reverse()`；在数组很大且频繁更新时使用多段链式转换；在回调里修改外部变量导致数据流不清晰。
- 应换方案：频繁按 key 查找用 `Map`；只关心是否存在用 `Set`；复杂数组去重见 [数组去重](./deweight.array.md)；嵌套结构复制见 [深拷贝和浅拷贝](./deep.clone.md)；超大列表渲染应考虑分页、虚拟列表或分时处理。

## 面试 / 自测

1. 哪些数组方法会修改原数组？`map()`、`filter()`、`slice()` 会吗？
2. `sort()` 不传比较函数时，`[10, 2, 1]` 的结果是什么？为什么？
3. `indexOf()` 和 `includes()` 对 `NaN` 的结果为什么不同？
4. 为什么 `[{ id: 1 }].includes({ id: 1 })` 是 `false`？应该如何查找？
5. 如何在遍历中提前结束？为什么 `forEach()` 不适合这个需求？
6. `reduce()` 不传初始值时，空数组会发生什么？
7. `Array.from()` 和展开语法在处理类数组时有什么差别？
8. React/Vue 状态数组排序时，为什么不建议直接 `state.list.sort()`？

## 相关文章

- [数组去重](./deweight.array.md)
- [深拷贝和浅拷贝](./deep.clone.md)
- [ES6（阮一峰）](./es6.md)

## 参考

- [MDN: Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: 索引集合类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections)
- [MDN: 相等比较与同一性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [ECMAScript: Array Objects](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-objects)
