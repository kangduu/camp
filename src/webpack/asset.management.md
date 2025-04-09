---
title: Asset Management
---

## 处理 CSS

### 基础

1. style-loader
2. css-loader

### QA

❓ [sass](https://webpack.docschina.org/loaders/sass-loader) [less](https://webpack.docschina.org/loaders/less-loader) [postcss](https://webpack.docschina.org/loaders/postcss-loader) 等处理方式

❓ 如何 [压缩 CSS](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production) 以便在生产环境中节省加载时间

### Future

1. CSS 原子化？

## 处理图像资源

webpack5 版本最新配置如下：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

### QA

1. 如何处理 svg，并支持修改 svg 样式？

## 处理字体

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

```css
@font-face {
  font-family: "MyFont";
  src: url("./tet.ttf");
}
```

## 加载数据（json、csv、tsc、xml、...）

> xml-loader csv-loader

> JSON 数据内置支持，不需要额外的 loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
    ],
  },
};
```

```js
// csv 数据格式
[
  ["id", "name", "age", "city"],
  ["1", "John Doe", "28", "New York"],
  ["2", "Jane Smith", "34", "Los Angeles"],
  ["3", "Michael Brown", "22", "Chicago"],
]

// xml 数据格式
{
    "catalog": {
        "book": [
            {
                "$": {
                    "id": "bk101"
                },
                "author": [
                    "Gambardella, Matthew"
                ],
                "title": [
                    "XML Developer's Guide"
                ],
                "genre": [
                    "Computer"
                ],
                "price": [
                    "44.95"
                ],
                "publish_date": [
                    "2000-10-01"
                ],
                "description": [
                    "An in-depth look at creating applications with XML."
                ]
            },
        ]
    }
}
```

> 在使用 d3 等工具实现某些数据可视化时，这个功能极其有用。这将帮助不用在运行时发送请求获取和解析数据，而是在构建过程中将其提前加载到模块中，以便浏览器加载模块后，可以直接访问解析过的数据。

### [自定义 JSON 模块解析器](https://webpack.docschina.org/guides/asset-management/#customize-parser-of-json-modules)
