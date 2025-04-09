---
title: webpack loader
---

## 是否写过 Loader？简单描述一下编写 Loader 的过程？

我们都知道，Webpack 最后打包出来的成果是一份 Javascript 代码，实际上在 Webpack 内部默认也只能够处理 JS 模块代码，在打包过程中，会默认把所有遇到的文件都当作 JavaScript 代码进行解析，因此当项目存在非 JS 类型文件时，我们需要先对其进行必要的转换，才能继续执行打包任务，这也是 Loader 机制存在的意义。

Loader 的配置使用我们应该已经非常的熟悉：

```js
// webpack.config.js
module.exports = {
  // ...other config
  module: {
    rules: [
      {
        test: /^your-regExp$/,
        use: [
          {
            loader: "loader-name-A",
          },
          {
            loader: "loader-name-B",
          },
        ],
      },
    ],
  },
};
```

通过配置可以看出，针对每个文件类型，loader 是支持以数组的形式配置多个的，因此当 Webpack 在转换该文件类型的时候，会按顺序链式调用每一个 loader，前一个 loader 返回的内容会作为下一个 loader 的入参。

因此 loader 的开发需要遵循一些规范，比如返回值必须是标准的 JS 代码字符串，以保证下一个 loader 能够正常工作，同时在开发上需要严格遵循“单一职责”，只关心 loader 的输出以及对应的输出。

loader 函数中的 this 上下文由 webpack 提供，可以通过 this 对象提供的相关属性，获取当前 loader 需要的各种信息数据，事实上，这个 this 指向了一个叫 loaderContext 的 loader-runner 特有对象。

```js
module.exports = function (source) {
  const content = doSomeThing2JsString(source);

  // 如果 loader 配置了 options 对象，那么this.query将指向 options
  const options = this.query;

  // 可以用作解析其他模块路径的上下文
  console.log("this.context");

  /*
   * this.callback 参数：
   * error：Error | null，当 loader 出错时向外抛出一个 error
   * content：String | Buffer，经过 loader 编译后需要导出的内容
   * sourceMap：为方便调试生成的编译后内容的 source map
   * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
   */
  this.callback(null, content);
  // or return content;
};
```
