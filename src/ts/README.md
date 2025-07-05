---
title: TypeScript
icon: logos:typescript-icon
---
### Playground
[TypeScript playground](https://www.typescriptlang.org/play/)

### 获取TypeScript
1. 使用 npm 包管理器安装
   ```shell
   npm install -g typescript
   ```
2. 验证TypeScript
   ```shell
   tsc -v
   ```
3. 编译TypeScript文件
   ```shell
   tsc test.ts
   ```
### TypeScript基础类型
boolean、number、string、symbol、array、enum（数字枚举、字符串枚举、常量枚举、异构枚举）、any、unknown、void、tuple（元祖）、null和undefined、never、（** object和Object和｛｝？**）
### TypeScript断言
1. 类型断言
a. "<>" 语法
```ts
let name:any = 'kangduu';
let len: number = (<string>name).length; 
```
b. as 语法
```ts
let name:any = 'kangduu';
let len: number = (name as string).length; 
```
2. 非空断言
3. 确定赋值断言
### 类型守卫
1. in 关键字
2. typeof 关键字
3. instanceof 关键字
4. 自定义类型保护的类型谓词？
### 联合类型和类型别名
1. 联合类型
2. 可辨识联合
3. 类型别名
### 交叉类型
### TypeScript函数
1. 剪头函数
2. 参数类型和返回类型
3. 函数类型
4. 可选参数和默认参数
5. 剩余参数
6. 函数重载
### TypeScript数组
1. 数组解构
2. 数组展开运算符
3. 数组遍历
### TypeScript对象
### TypeScript 接口
### TypeScript 类
### TypeScript 泛型
1. 泛型语法
2. 泛型接口
3. 泛型类
4. 泛型工具类型
   1. typeof
   2. keyof
   3. in
   4. infer
   5. extends
  
### TypeScript装饰器
### 编译上下文
1. tsconfig.json
2. compilerOptions
### TypeScript开发辅助工具
1. TypeScript Playground
2. TypeScript UML Playground
3. JSON TO TS
4. Schemats
5. TypeScript AST Viewer
6. TypeDoc
7. TypeScript ESLint
