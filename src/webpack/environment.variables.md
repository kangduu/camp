---
title: Development
---

作用：消除 webpack.config.js 在 开发环境 和 生产环境 之间的差异

```shell
npx webpack --env goal=local --env production --progress
```

```js
const path = require("path");

module.exports = (env) => {
  // Use env.<YOUR VARIABLE> here:
  console.log("Goal: ", env.goal); // 'local'
  console.log("Production: ", env.production); // true

  return {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
};
```
