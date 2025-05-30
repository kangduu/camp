---
title: 预编译原理
category: javascript
---

## JavaScript 运行三部曲 （脚本执行 js 引擎都做了什么呢？）

1. 语法分析（通篇扫描检查是否存在低级语法错误）
2. 预编译（简单理解就是在内存中开辟一些空间，存放一些变量与函数）
3. 提升问题（发生预编译时产生，确实是 js 运行中存在的原理，但是不能实质性解决预编译问题）

- - 函数声明整体提升

  - 变量声明提升（变量初始化不算，只存在声明变量这一步：var a;）

  - `优先级：函数 > 变量声明`

4. 解释执行

## 预编译前奏

1. 暗示全局变量(imply global)

   即任何变量未经声明就赋值，此变量就为全局对象（global object）所有

```javascript
function test() {
  var a = (b = 123);
  console.log(a); //123
}
test();
console.log(b); //123
console.log(a); // throw error 'a is not defined '
```

2. 一切声明的全局变量，全是 window 的属性。

```javascript
function test() {
  var b = 123; //b是局部变量
}
test();
console.log(window.b); //undefined
```

`注意`：预编译阶段(脚本代码块 script 执行前) 发生变量声明和函数声明，没有初始化行为（赋值），匿名函数不参与预编译 ，只有在解释执行阶段才会进行变量初始化

`运行期上下文`：当函数执行时（前一刻），会创建一个称为执行期上下文的内部对象（AO 等）。一个执行期上下文定义了一个函数执行时的环境，函数每次执行时对应的执行期上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行期上下文，当函数执行完毕，它所产生的执行期上下文被销毁。

`查找变量`：从作用域链的顶部依次向下查找。

## JS 预编译实例

```javascript
var a = 1; // 创建变量（变量声明+为变量赋值）
function b(y) {
  //函数声明
  var x = 1;
  console.log("so easy");
}
var c = function () {};
b(100);
```

> 让我们看看引擎对这段代码做了什么吧
>
> 1.  页面产生便创建了 GO 全局对象（window）
> 2.  第一个脚本文件加载
> 3.  脚本加载完毕后，分析语法是否合法
> 4.  开始预编译
>
> - 查找函数声明，作为 GO 属性，值赋予函数体
> - 查找变量声明，作为 GO 属性，值赋予 undefined（执行代码时进行初始化）

### 全局的预编译

```javascript
//伪代码
GO
window = {
    //页面加载创建GO同时，创建了document、navigator、screen等等属性，此处省略
    a: undefined,
    c: undefined，
    b: function(y){
        var x = 1;
        console.log('so easy');
    }
}
//解释执行代码（直到执行函数b）
//GO
  window = {
    //变量随着执行流得到初始化
    a: 1,
    c: function(){
       //...
    },
    b: function(y){
        var x = 1;
        console.log('so easy');
    }
}
//执行函数b之前，发生预编译
```

### 函数执行前的预编译

```javascript
//伪代码
AO = {
  //创建AO同时，创建了arguments等等属性，此处省略
  y: 100,
  x: undefined,
};
// 解释执行函数中代码
// 第一个脚本文件执行完毕，加载第二个脚本文件
// 第二个脚本文件加载完毕后，进行语法分析
// 语法分析完毕，开始预编译
// 重复最开始的预编译步骤……
```

## 总结

预编译(函数执行前) ※ （AO）

1. 创建 AO（Argument Object）对象（执行期上下文，即一个函数执行库。 eg： AO{... }）
2. 查找函数形参及函数内 变量声明，将形参名及变量名作为 AO 对象的属性名，值为 undefined
3. 实参形参相统一，（实参值赋给形参 ）
4. 查找函数声明，函数名作为 AO 对象的属性，值为函数体（值 或函数引用）

`注：变量和函数同名AO中只能有一个；执行函数时AO对象也会接着改变（即AO在函数执行完才失效）`

### 代码示例

```javascript
function test(a, b) {
  document.write(a);
  /注意执行当前语句时，a还为1，执行到 a = 3 时a才为3/;
  c = 0;
  var c;
  a = 3;
  b = 2;
  document.write(b);
  function b() {}
  function d() {}
  document.write(d);
  document.write(c);
}
test(1);
//    1
//    2
//    function d() {}
//    0
/*    AO = {
        a = 3;
        b = 2;
        c = 0;
        d = function () {};
    }*/
//预编译(脚本代码块script执行前) （GO）
// 1. 查找全局变量声明（包括隐式全局变量声明，省略var的声明），变量名作全局对象的属性，值为undefined
// 2. 查找函数声明，函数名作为全局对象的属性，值为函数引用
```
