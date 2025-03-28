## webpack模块打包运行原理？

首先我们应该简单了解一下webpack的整个打包流程：

1. 读取webpack的配置参数；
2. 启动webpack，创建Compiler对象并开始解析项目；
3. 从入口文件（entry）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
4. 对不同文件类型的依赖模块文件使用对应的Loader进行编译，最终转为Javascript文件；
5. 整个过程中webpack会通过发布订阅模式，向外抛出一些hooks，而webpack的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

其中文件的解析与构建是一个比较复杂的过程，在webpack源码中主要依赖于compiler和compilation两个核心对象实现。

compiler对象是一个全局单例，他负责把控整个webpack打包的构建流程。

compilation对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，compiler都会重新生成一个新的compilation对象，负责此次更新的构建过程。

而每个模块间的依赖关系，则依赖于AST语法树。

每个模块文件在通过Loader解析完成之后，会通过acorn库生成模块代码的AST语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。

最终Webpack打包出来的bundle文件是一个IIFE的执行函数。


```js
// webpack 5 打包的bundle文件内容
(() => { // webpackBootstrap
    var __webpack_modules__ = ({
        'file-A-path': ((modules) => { // ... })
        'index-file-path': ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => { // ... })
    })
    
    // The module cache
    var __webpack_module_cache__ = {};
    
    // The require function
    function __webpack_require__(moduleId) {
        // Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
                return cachedModule.exports;
        }
        // Create a new module (and put it into the cache)
        var module = __webpack_module_cache__[moduleId] = {
                // no module.id needed
                // no module.loaded needed
                exports: {}
        };

        // Execute the module function
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__ "moduleId");

        // Return the exports of the module
        return module.exports;
    }
    
    // startup
    // Load entry module and return exports
    // This entry module can't be inlined because the eval devtool is used.
    var __webpack_exports__ = __webpack_require__("./src/index.js");
})
```

和webpack4相比，webpack5打包出来的bundle做了相当的精简。

在上面的打包demo中，整个立即执行函数里边只有三个变量和一个函数方法，__webpack_modules__存放了编译后的各个文件模块的JS内容，__webpack_module_cache__ 用来做模块缓存，__webpack_require__是Webpack内部实现的一套依赖引入函数。最后一句则是代码运行的起点，从入口文件开始，启动整个项目。

其中值得一提的是__webpack_require__模块引入函数，我们在模块化开发的时候，通常会使用ES Module或者CommonJS规范导出/引入依赖模块，webpack打包编译的时候，会统一替换成自己的__webpack_require__来实现模块的引入和导出，从而实现模块缓存机制，以及抹平不同模块规范之间的一些差异性。
