---
title: Code Splitting
---

常用的代码分离方法有三种：

- 入口起点：使用 entry 配置手动地分离代码。
- 防止重复：使用 [入口依赖](https://webpack.docschina.org/configuration/entry-context/#dependencies) 或者 [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin) 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用分离代码。

## 入口起点

这种方式存在一些隐患：

- 如果入口 chunk 之间包含一些重复的模块，那么这些**重复模块会被引入到各个 bundle 中**。
- 这种方法不够灵活，并且不能动态地拆分应用程序逻辑中的核心代码。

## 防止重复

- `dependOn` 在多个 chunk 之间共享模块

```js
module.exports = {
  entry: {
    index: { import: "./src/index.js", dependOn: "shared" },
    another: { import: "./src/another-module.js", dependOn: "shared" },
    shared: "lodash",
  },
};
```

尽管 webpack 允许每个页面使用多个入口起点，但在可能的情况下，应该避免使用多个入口起点，而使用具有多个导入的单个入口起点：entry: { page: ['./analytics', './app'] }。这样可以获得更好的优化效果，并在使用异步脚本标签时保证执行顺序一致。

- [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin)

```js
module.exports = {
  optimization: {
    splitChunks: { chunks: "all" },
  },
};
```

```
<!-- dist dic -->
----dist
|---another.bundle.js
|---index.bundle.js
|---index.html
|---vendors-node_modules_lodash_lodash_js.bundle.js
```

> [mini-css-extract-plugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin)：用于将 CSS 从主应用程序中分离。

## 动态导入

- [import()](https://webpack.docschina.org/api/module-methods/#import) 语法

```js
// index.js
function getComponent() {
  return import("lodash")
    .then(({ default: _ }) => {
      // * 注意这里
      const element = document.createElement("div");
      element.innerHTML = _.join(["Hello", "webpack"], " ");
      return element;
    })
    .catch(() => "An error occurred while loading the component");
}

getComponent().then((component) => {
  document.body.appendChild(component);
});
```

- [require.ensure](https://webpack.docschina.org/api/module-methods/#requireensure)

## 预获取/预加载模块

```js
//...
import(/* webpackPrefetch: true */ "./path/to/LoginModal.js");
```

上面的代码在构建时会生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部，指示浏览器在闲置时间预获取 login-modal-chunk.js 文件。

```js
//...
import(/* webpackPreload: true */ "ChartingLibrary");
```

> 不正确地使用 webpackPreload 会有损性能，请谨慎使用。

- 预获取指令 和 预加载指令 不同之处：

1. 预加载 chunk 会在父 chunk 加载时以并行方式开始加载；而预获取 chunk 会在父 chunk 加载结束后开始加载。
2. 预加载 chunk 具有中等优先级，并会立即下载；而预获取 chunk 则在浏览器闲置时下载。
3. 预加载 chunk 会在父 chunk 中立即请求，用于当下时刻；而预获取 chunk 则用于未来的某个时刻。
4. 浏览器支持程度不同。
