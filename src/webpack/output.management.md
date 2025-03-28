---
title: Output Management
---

## [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack output management",
    }),
  ],
};
```

## 清理 dist 文件夹

```js{5}
module.exports = {
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // 清理dist文件
  },
};
```

## manifest 拓展阅读

关于 [WebpackManifestPlugin](https://github.com/shellscape/webpack-manifest-plugin) 如何处理 webpack 的 manifest 数据
