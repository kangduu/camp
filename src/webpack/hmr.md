---
title: Hot Module Replacement
---

> HMR 只适用于开发环境

```js
module.exports = {
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
  devServer: {
    static: "./dist",
    hot: true,
  },
};
```

- [概念 - 模块热替换](https://webpack.docschina.org/concepts/hot-module-replacement)
- [API - 模块热替换(hot module replacement)](https://webpack.docschina.org/api/hot-module-replacement/)
