---
title: webpack
icon: logos:webpack
---

<p style="gap: 10px; display: flex">
<a href="https://webpack.js.org/">
<img src="https://img.shields.io/badge/webpack-v5.98.0-blue" alt="webpack" />
</a>
<a href="https://webpack.js.org/api/cli/">
<img src="https://img.shields.io/badge/webpack--cli-v6.0.1-yellow" alt="webpack-cli" />
</a> 
</p>

> 注意，webpack 不会更改代码中除 `import` 和 `export` 语句以外的部分。如果正在使用其它 [ES2015 特性](http://es6-features.org/)，请确保 webpack 的 loader 系统 中使用了像 Babel 一样的 [转译器](https://webpack.docschina.org/loaders/#transpiling)。

> 安装一个将被打包到`生产环境` bundle 的包时，应该使用 `npm install --save`；而安装一个用于`开发环境`的包时（例如代码检查工具、测试库等），应该使用 `npm install --save-dev`。

> webpack 最出色的功能之一就是除了引入 JavaScript，还可以通过 loader 或内置的 [资源模块](https://webpack.docschina.org/guides/asset-modules/) 引入任何其他类型的文件。

> 不要使用 webpack 编译不可信的代码。它可能会在计算机，远程服务器或者在 web 应用程序使用者的浏览器中执行恶意代码。

<h3>plugins</h3>

<p style="gap: 10px; display: flex">
<a href="https://github.com/jantimon/html-webpack-plugin">
<img src="https://img.shields.io/badge/html--webpack--plugin-v5.6.3-brown" alt="webpack" />
</a>
</p>

### extend read

- [Authoring Libraries](https://webpack.js.org/guides/author-libraries/)
- [Build Performance](https://webpack.docschina.org/guides/build-performance/)
- [Content Security Policies](https://webpack.docschina.org/guides/csp/)
- [Development Vagrant](https://webpack.docschina.org/guides/development-vagrant/)
- [Dependency Management](https://webpack.docschina.org/guides/dependency-management/)
- [Installation](https://webpack.docschina.org/guides/installation/)
- [ECMAScript Modules](https://webpack.docschina.org/guides/ecma-script-modules/)
- [Web Workers](https://webpack.docschina.org/guides/web-workers/)
- [Progress Web Application](https://webpack.docschina.org/guides/progressive-web-application/)
- [Public Path](https://webpack.docschina.org/guides/public-path/)
- [Integrations](https://webpack.docschina.org/guides/integrations/)
- [Advanced entry](https://webpack.docschina.org/guides/entry-advanced/)
- [Package exports](https://webpack.docschina.org/guides/package-exports/)
