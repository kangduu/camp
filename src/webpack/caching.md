---
title: Caching
---

由于浏览器使用了缓存技术，在部署新版本时没有更改资源的文件名，浏览器可能会认为它没有更新，这将会导致不能及时获取最新的代码。

## 输出文件名

> 模板化文件名

1. [contenthash] 根据资源内容创建唯一 hash 值，内容变化随之变化

```js
module.exports = {
  output: {
    filename: "[name].[contenthash].js", // *
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
```

> v5.98.0 版本，重复执行 `npm run build`，未修改的内容，会使用缓存：`assets by status 1.4 MiB [cached] 2 assets`
