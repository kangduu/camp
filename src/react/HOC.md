---
title: React高阶组件（HOC）
category: React
---

1. [ 什么是高阶组件？ ](#什么是高阶组件？)
2. 有几种高阶组件（实现）？各种的优缺点是什么？
3. 你平时是如何写高阶组件的？
4. HOC 怎么处理静态属性、跨层级 ref 等问题？
5. 高阶组件怎么控制渲染？隔离渲染？
6. 高阶组件如何监视原始组件状态？

## 什么是高阶组件？

[🙋 高阶组件](https://react.docschina.org/docs/higher-order-components.html) 是 **参数为组件**，**返回值为新组件** 的 **函数**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

🤔 **Questions：** 高阶组件与组件之间的差别是什么？

🙋 **Answer：** 组件是将 props 和 state 转化为 UI，而高阶组件是将组件转换为另一个组件。

为了后期维护方便。<u>最好是一个纯函数，尽量不要有副作用。</u>

## 高阶组件解决了哪些问题？（高阶组件产生的初衷？）

1. 逻辑复用
2. props 强化
3. 组件赋能
4. 控制渲染

🤔 **思考：** 在没有高阶组件之前，又是如何处理这些问题的啦？

## 如何优雅的写一个高阶组件？

1. 普通模式
2. 装饰器
3. 多高阶组件组合

## 高阶组件能用来做什么？

## 说说我们平时使用的轮子中使用了 HOC 技术的有哪些啦？

> Redux 中的 `connect()`
>
> React Router 中的 `withRoute`
>
> Relay 中的 `createFragmentContainer`

## 总结

## 参考文献

- [「react 进阶」一文吃透 React 高阶组件(HOC)](https://juejin.cn/post/6940422320427106335)
- [React 高阶组件(HOC)的入门 📖 及实践 💻](https://juejin.cn/post/6844904050236850184)
