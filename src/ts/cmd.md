---
title: 如何运行 ts 文件
---

## `tsc` 编译器

因为 TypeScript 是一种静态类型语言，编译后才会转化为 JavaScript 执行。因此，通常的步骤是将 TypeScript 文件编译为 JavaScript，然后运行生成的 JavaScript 文件。

那么我们是不是应该先执行 `tsc ***.ts` ，然后使用 node 来执行编译后的 js 文件`node ***.js`。

```bash
tsc hello.ts

node hello.js
```

但是我们在平时的测试中，希望直接执行 ts 代码，应该怎么做呐？

## 使用 `ts-node`

ts-node 是一个执行 TypeScript 文件的工具，它会自动编译 TypeScript 文件并执行：

1. 安装 `ts-node`

```bash
npm i ts-node
```

2. 直接运行 ts 文件

```bash
ts-node hello.ts
```

## 监听文件变化

TypeScript 提供了两种方式来监听文件变化：`tsc --watch` 和 `tsc -w`

### 使用 `ts-node-dev`

在 TypeScript 文件变化时快速重新加载

```bash
npm i ts-node-dev

ts-node-dev --respawn hello.ts
```

`--respawn` 会确保每次文件变化后，都会重新启动程序，而不会缓存旧的状态。

## 关于本地安装依赖执行报错的说明

**注意** 不使用全局安装 `-g` ，直接执行 `ts-node hello.ts` 会报错，解决办法如下：

1. 使用`npx`运行

```bash
npx ts-node hello.ts
```

2. 使用`npm run`（这需要你在`package.json`中提前配置命令）

```json
"scripts": {
  "start": "ts-node hello.ts"
}
```

3. 使用本地安装的 `ts-node` 直接执行 (路径查找`node_modules`下的`.bin`文件里的`ts-node`)

```bash
./node_modules/.bin/ts-node hello.ts
```

### 小结

1. 如果你没有全局安装 `ts-node`，可以通过 `npx ts-node hello.ts` 来运行。
2. 或者，你可以配置 `npm run` 脚本来运行 `ts-node`。
3. 也可以直接访问本地的 `node_modules/.bin/` 目录来执行。

## 总结

- 执行 TypeScript 文件：通过 tsc 编译后运行 .js 文件，或者使用 ts-node 来直接执行。
- 监听文件变化：使用 `tsc --watch` 或 `ts-node-dev` 来监听文件变化并自动执行编译和运行。

## dependencies

- [ts-node](https://www.npmjs.com/package/ts-node)
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)
