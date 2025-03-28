---
title: webpack plugin
---

## 是否写过 Plugin？简述一下编写 plugin 的思路？

如果说**Loader 负责文件转换**，那么**Plugin 便是负责功能扩展**。Loader 和 Plugin 作为 Webpack 的两个重要组成部分，承担着两部分不同的职责。

我们知道，**webpack 基于发布订阅模式**，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务，从而实现自己想要的功能。

既然基于发布订阅模式，那么知道 Webpack 到底提供了哪些事件钩子供插件开发者使用是非常重要的，之前提到过 compiler 和 compilation 是 Webpack 两个非常核心的对象，其中 compiler 暴露了和 Webpack 整个生命周期相关的钩子（compiler-hooks），而 compilation 则暴露了与模块和依赖有关的粒度更小的事件钩子（Compilation Hooks）。

Webpack 的事件机制基于 webpack 自己实现的一套**Tapable 事件流**方案。

```js
// Tapable的简单使用
const { SyncHook } = require("tapable");

class Car {
  constructor() {
    // 在this.hooks中定义所有的钩子事件
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"]),
    };
  }

  /* ... */
}

const myCar = new Car();
// 通过调用tap方法即可增加一个消费者，订阅对应的钩子事件了
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
```

Plugin 的开发和开发 Loader 一样，需要遵循一些开发上的规范和原则：

1. 插件必须是一个函数或者是一个包含 apply 方法的对象，这样才能访问 compiler 实例；
2. 传给每个插件的 compiler 和 compilation 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件;
3. 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住;

了解了以上这些内容，想要开发一个 Webpack Plugin，其实也并不困难。

```js
class MyPlugin {
  apply(compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation: 当前打包构建流程的上下文
      console.log(compilation);

      // do something...
    });
  }
}
```
