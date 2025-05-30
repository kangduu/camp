---
title: 内存泄漏
category: javascript
---

​ 内存泄漏指的是：**任何对象在你不再拥有或不再需要之后任然存在**。

- 不再拥有——（无法获取）
- 不再需要——（还存在隐性引用）

## 常见的内存泄漏

1. 闭包
2. 控制台日志
3. 循环（两对象彼此引用且彼此保留）
4. 事件监听，addEventListener 需要 removeEventListener 移除（**传递给两者的函数必须一致**）
5. setTimeout/setInterval ，对应的使用 clearTimeout/clearInterval 清空
6. **注意，使用 setTimeout 模拟 setInterval 循环调用会造成内存泄漏**
7. 如 Promise、rxjs 的 Observables、node 的 EventEmitters 这些方法，无回调函数或未取消监听都会造成内存泄漏
8. Promise 如果没有 resolved 或者 rejected，会连同 then()中的代码一起造成内存泄漏
9. 在没有虚拟 dom 的计算下实现了无无限滚动，那么 dom 节点的数量将无限增加
10. [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver), [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver), [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 这些新的事件监听 Api，都必须使用对应的 disconnect 取消监听
11. 同 redux、vuex 这样**挂载在全局的状态管理，如果不注意内存的占用，则会持续增加不会被释放**

## 容易引起内存使用不当的场景

1. 滥用全局变量
2. 缓存不限制（最大缓存数限制）
3. 操作大文件（切片上传，流上传）

## V8 引擎

### 内存何时回收

```javascript
while (内存快满了) {
	if（全局变量） 不回收
	if（局部变量 && 失去引用） 回收
}
```

### 名词解释

新生代：新定义的变量

老生代：旧的变量

### 内存大小

| 操作系统 | 大小 | 描述                            |
| -------- | ---- | ------------------------------- |
| X64      | 1.4G | 新生代（64MB）,老生代（1400MB） |
| X32      | 0.7G | 新生代（16MB）,老生代（700MB）  |

### 内存分配

- 新生代的算法（25%检查-标记-复制-移除）

  > 所有新变量都先放入【新生代】；
  >
  > 当容量大于 25%，触发新生代的复制；
  >
  > 标记活的变量，并复制到另一端（始终只用了一半的空间）；
  >
  > 清空之前的一半；

何时进入老生代？经过复制且大于 25%的。

特性：牺牲空间获得时间；

- 老生代的算法(标记-删除-整理)

  > 标记死亡的变量（无引用）
  >
  > 删除这些变量
  >
  > 整理

为什么整理？

删除的位置是不连续的，而当需要插入连续的数据（数组）时，可能导致无法插入的情况。

### 如何查看内存

单位都是 byte

- 浏览器：window.performance

  ```json
  Performance {
    memory: {
      usedJSHeapSize:  16100000,
      // JS 对象（包括V8引擎内部对象）占用的内存，一定小于 totalJSHeapSize，否则可能出现内存泄漏
      totalJSHeapSize: 35100000,
      // 可使用的内存
      jsHeapSizeLimit: 793000000
      // 内存大小限制
    },
  }
  ```

- Node：[process.memoryUsage()](http://nodejs.cn/api/process.html#process_process_memoryusage)

  ```json
  {
    "rss": 23371776,
    "heapTotal": 9682944,
    "heapUsed": 5536960,
    "external": 8733 // Node的源码是C++编写的，Node下可拓展C++的一些内存，使用webpack打包时可用
  }
  ```

## QA

1. 为什么 V8 内存这么小？

> JavaScript 垃圾回收时，会中断执行；每 100MB 大约 3ms。
>
> JavaScript 设计之初是为了处理前端脚本，导致执行完便释放了。
