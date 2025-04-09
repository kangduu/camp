---
title: webpack source map
---

## 说说你对 sourceMap 的理解？

提到 sourceMap，我们应该想到 Webpack 配置里边的**devtool**参数，以及对应的 eval，eval-cheap-source-map 等等可选值以及它们的含义。

除了知道不同参数之间的区别以及性能上的差异外，我们也可以一起了解一下 sourceMap 的实现方式。

sourceMap 是一项将编译、打包、压缩后的代码映射回源代码的技术，由于打包压缩后的代码并没有阅读性可言，一旦在开发中报错或者遇到问题，直接在混淆代码中 debug 问题会带来非常糟糕的体验，sourceMap 可以帮助我们快速定位到源代码的位置，提高我们的开发效率。

sourceMap 其实并不是 Webpack 特有的功能，而是 Webpack 支持 sourceMap，像 JQuery 也支持 souceMap。

既然是一种源码的映射，那必然就需要有一份映射的文件，来标记混淆代码里对应的源码的位置，通常这份映射文件以.map 结尾，里边的数据结构大概长这样：

```json
{
  "version": 3, // Source Map版本
  "file": "out.js", // 输出文件（可选）
  "sourceRoot": "", // 源文件根目录（可选）
  "sources": ["foo.js", "bar.js"], // 源文件列表
  "sourcesContent": [null, null], // 源内容列表（可选，和源文件列表顺序一致）
  "names": ["src", "maps", "are", "fun"], // mappings使用的符号名称列表
  "mappings": "A,AAAB;;ABCDE;" // 带有编码映射数据的字符串
}
```

其中 mappings 数据有如下规则：

1. 生成文件中的一行的每个组用“;”分隔；
2. 每一段用“,”分隔；
3. 每个段由 1、4 或 5 个可变长度字段组成；

有了这份映射文件，我们只需要在我们的压缩代码的最末端加上这句注释，即可让 sourceMap 生效：
//# sourceURL=/path/to/file.js.map

有了这段注释后，浏览器就会通过 sourceURL 去获取这份映射文件，通过解释器解析后，实现源码和混淆代码之间的映射。因此 sourceMap 其实也是一项需要浏览器支持的技术。

如果我们仔细查看 webpack 打包出来的 bundle 文件，就可以发现在默认的 development 开发模式下，每个\_webpack_modules\_\_文件模块的代码最末端，都会加上//# sourceURL=webpack://file-path?，从而实现对 sourceMap 的支持。
