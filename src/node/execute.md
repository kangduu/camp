---
title: Node.js 文件执行
---

🤔❓ [如何确认一个 Node.js 文件使用的是`ESM`还是`CommonJS`模块](#确定Node文件模块类型)

## 使用 node 执行 `.js` `.cjs` `.mjs` 文件

1. 默认情况 `.js` 文件

```js
// hello.js
console.log("Hello Node.js");
```

```sh
node hello.js
```

查找 最近的 `package.json` 中的 type 值，只要 type 值不为 'module',那么就是`CommonJS模`

2. `.cjs` `.mjs`

直接遵循对应模块规则执行。

```sh
node hello.cjs | node hello.mjs
```

---

## 如何执行 `.ts` `.cts` `.mts` 文件

我们知道一个 Node.js 文件可以是`ESM`模块，也可以是`CommonJS`模块。那么在使用`tsc`、`tsx`或`ts-node`进行编译或执行时，也存在各种差异：

### 1. 使用 `tsc` 编译后执行对应的 js 文件

```ts
// index.ts
console.log("Running TypeScript in Node.js.");
```

```sh
tsc index.ts && node index.js
```

如果我们加上 `--noEmit` flags，那么将只检测 ts 语法。

### 2. 使用 `tsx` 直接运行 ts 文件

```cts
let num = 1;
console.log(num); // 1
```

```cts
let num = 1;
num = ""; // error TS2322: Type 'string' is not assignable to type 'number'.
console.log(num); // 没有输出日志，process直接退出了
```

**_ 不进行类型检查，但执行到类型错误行会退出 _**

### 3. 使用 `ts-node` 直接运行 ts 文件

仅`.cts`可成功，且`package.json`是`CommonJS`模块

```cts
let a = "hello";
console.log(a);
```

执行 `.ts` 之前必须配置 `tsconfig.json` 文件，否则执行会报错

```ts
let greeting = "hello";
console.log(greeting);
// export default greeting;
module.exports = { greeting };
```

执行 `.mts` 失败，`TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".mts"`

---

## 确定 Node 文件模块类型

👍 在 Node.js 中，确定一个文件是 **ESM（ECMAScript Module）** 还是 **CJS（CommonJS）**，主要有以下几种方式：

---

### 1. **看 `package.json` 的 `type` 字段**

- 如果最近的 `package.json` 中有：

  ```json
  {
    "type": "module"
  }
  ```

  那么 **`.js` 文件会被当作 ESM**，除非扩展名是 `.cjs`（强制 CommonJS）。

- 如果没有定义 `type`，或者值是 `"commonjs"`，那么 **`.js` 文件会被当作 CJS**，除非扩展名是 `.mjs`（强制 ESM）。

✅ 规则：

- `.js` → 跟随 `type` 配置
- `.cjs` → 永远是 CJS
- `.mjs` → 永远是 ESM

---

### 2. **看文件扩展名**

- `.cjs` → CommonJS
- `.mjs` → ES Module
- `.js` → 依赖 `package.json` 的 `type` 字段来判断

---

### 3. **看文件内容**

Node.js 会报错提示你用错了语法：

- **CJS 文件**里不能直接用 `import` / `export`，否则会报错。
- **ESM 文件**里不能直接用 `require`、`module.exports`，否则会报错。

---

### 4. **运行时确认 ⭐**

你可以在文件里加一句：

```js
console.log(import.meta.url); // 仅 ESM 可用
console.log(typeof require); // 在 CJS 中是 "function"，在 ESM 中会报错
```

---

### 📌 总结一张速查表：

| 情况                                            | `.js` | `.cjs` | `.mjs` |
| ----------------------------------------------- | ----- | ------ | ------ |
| `package.json` `"type": "commonjs"` 或无 `type` | CJS   | CJS    | ESM    |
| `package.json` `"type": "module"`               | ESM   | CJS    | ESM    |

---
