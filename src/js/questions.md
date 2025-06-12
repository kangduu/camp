---
title: Question Collection
---

## 为什么 Object.prototype.toString.call() 可以准确判断对象类型？

在回答这个问题之前，我们必须掌握以下知识点：

- [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
- [typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
- [Object.prototype.toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)，返回对象的字符串形式
- [delete 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)
- [Object.prototype.hasOwnProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)方法会返回一个布尔值，指示对象自身属性中是否具有指定属性
- [Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

由于 JavaScript 是弱类型语言，导致实际工程开发中，需要进行大量的类型检查工作。比如，在遍历一个数组之前，你必须先判断他是否是一个数组类型，否则这将可能出错。

```js
function set(data) {
  // 类型判断
  if (Array.isArray(data)) {
    return data.forEach(() => {
      // todo
    });
  }
}
```

如果你是一位初学者，你肯定遇到过下面的现象。

```js
// JavaScript 诞生以来便如此
typeof null === "object"; // true

typeof [1, 2, 3]; // object
```

[为什么 `typeof null === 'object' `](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)

所以，typeof 并不能判断所有类型，[typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) 操作符返回一个字符串，表示**未经计算**的操作数的类型。

下面列出了 `typeof` 可能返回的值：

| 类型                          | 结果           |
| :---------------------------- | -------------- |
| Undefined                     | "undefined"    |
| Boolean                       | "boolean"      |
| Number                        | "number"       |
| String                        | "string"       |
| Function 对象                 | "function"     |
| Symbol (ECMAScript 2015 新增) | "symbol"       |
| BigInt (ECMAScript 2020 新增) | "bigint"       |
| Null                          | "object"       |
| 宿主对象（由 JS 环境提供）    | 取决于具体实现 |
| **其他任何对象**              | "object"       |

从上表我们得出结论：

1. 使用 typeof 可以准确判断类型的有 **Undefined、Boolean、Number、String、Function、Symbol、BigInt** 。
2. 特别注意一点，除 Function 外的所有构造函数的类型都是 'object'，如 Array、Set、WeakSet、Map、WeakMap 等的结果都是 ‘object’ 。

### 探讨对象的 toString 方法

> [Object.prototype.toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。**如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object *type*]"，其中 `type` 是对象的类型。**

> [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)对象**覆盖**了从[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)继承来的[`toString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法。对于用户定义的 [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 对象，`toString`方法返回一个字符串，其中包含用于定义函数的源文本段。
>
> ......

举个 🌰，如果我们将`Function.prototype.toString`删除后再调用`.toString()`，会得到什么结果啦？

```js
function fn() {}
console.log(fn.toString()); // function fn() {}
delete Function.prototype.toString;
console.log(fn.toString()); // [object Function]
```

将`Function.prototype.toString`删除后，第二次调用 toString 时，其实调用的是`Object.prototype.toString`，在上述代码基础上证明观点。

```js
function fn() {}
console.log(fn.toString());
delete Function.prototype.toString;
console.log(fn.toString());

+console.log(Function.prototype.toString === Object.prototype.toString); // true
+console.log(fn.hasOwnProperty("toString")); // flase
```

其实，所有的内置对象都覆盖了从 Object 继承来的 toString 方法。

这也就解释了为什么 `Object.prototype.toString.call(operand)` 可以准确判断操作数的类型。

### 总结

Array、Function 等内置对象作为 Object 的实例，都各自重写了 `toString` 方法，要得到操作数的具体类型，就要调用 Object 的原型的未被重写的 toString 方法。

使用 `Object.prototype.toString` 来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数，称为 `thisArg`。

### References

- [使用 toString() 检测对象类型](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#%E4%BD%BF%E7%94%A8_tostring()_%E6%A3%80%E6%B5%8B%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B>)

## 判断一个对象是否为空对象？

### 使用`JSON.stringify(object)` 方法，将对象转换为字符串，进行序列化。

```js
console.log(JSON.stringify({}) === "{}"); // true
```

### for...in... 遍历对象，同时使用 hasOwnProperty()去除原型属性

```js
function isEmptyObject(object) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
```

注意：for...in 循环包括原型属性

### jQuery 的 isEmptyObject()方法

```js
//该方法是对 （for in）的封装；
let obj = {};
let b = $.isEmptyObject(obj);
alert(b); // true
```

### Object.getOwnPropertyNames()方法

**Object.getOwnPropertyNames()**方法返回一个由指定对象的所有**自身属性**的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

```js
let obj = {};
let b = Object.getOwnPropertyNames(obj);
console.log(b.length); // 0
```

### Object.keys()方法

**Object.keys()**方法会返回一个由一个给定对象的**自身可枚举属性**组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致 。

```js
//该方法返回的同样是属性名组成的数组对象。
let obj = {};
let arr = Object.keys(obj);
console.log(arr.length); // 0
```

## 连续赋值问题

```javascript
var b = (a = 3);
console.log(a, b); // a = ? , b = ?
```

### 你应该知道的知识

1. 赋值运算符 `=`

​ 在 javascript 中，赋值运算符是 `从右到左` （关联性）。

​ \*注意：[运算符的优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

2.  [逗号操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_Operator)

​ 定义：对它的每个操作数求值 `从左到右`，并**返回最后一个操作数的值**。

​ 优先级 1 （最低）

### 解析为原始赋值结构

在遇到此情况时，应该**先将其分解为简单赋值语句**。

```javascript
var b = (a = 3);

//分解
a = 3;
var b = a;
console.log(a, b); // 3 3 (在同一作用域下)
```

```javascript
(function () {
  var m = (n = 3);
})();
console.log(typeof m === "undefined"); //true
console.log(typeof n === "undefined"); //false

//外部作用域下只有 n
```

### 示例 1

```javascript
var a = 1;
var b = 2[a, b] = [b, a];
// 问，a和b的值是多少？ 为什么？
/*------------
title: 析 --------------------*/
// 1.对象增加属性和修改属性的方式
	let obj = {};
	obj.name = 'dk';
	obj['sex'] = 'man';
	obj[1,2] = '2'; // 并不会报错，问题就在这里。
// 2.obj[1,2] = 3; 解析
	let m = (3,2,1); // m 实际值为 1 ，参考第2点
	//所以
    obj[1,2] = 3;  >>>  obj[(1,2)] = 3; >>> obj[2] = 3;
// 3.回到题目
	// 可理解代码为(实际并不是)
    var a = undefined;
	var b = undefined;
	a = 1;
	b = 2[b,a] = [b,a] 【1】
	//运行到【1】时，即是一个连续赋值的问题了。实际赋值顺序是：
	// (a.)
	2[b,a] = [b,a] // 2[1,undefined] = [undefined,1] 会报错吗？ 【2】
	// (b.)
	b = 2[b,a] // b 是指向对象2的属性a的值, 而2[a] = [b,a],所有 b = [b,a]
// 4.【2】的理解
	'123456'.length // 6, 这个都能够理解。其实他就是一个包装类。
	'123456'.length === '123456'['length'] === '123456'[1,'length']

	'123456'[1,'length'] = [1,2]
	//重点理解这句话,不会报错的。实际'123456'这个对象并不存在。可以理解为中间件。
// 5.答案
	a = 1; b = [undefined,1]
```

### 示例 2

```javascript
var a = { n: 1 };
var b = a;
a.n = a = { m: 1 };
// 问，a和b的值是多少？ 为什么？
/*------------
title: 析 1--------------------*/
// 拆分运算顺序 （1）a.n （2）a = {m:1} （3）a.n = a
//	a.n 分配新的地址，则  { n: - }
// a = { m : 1}
// a.n = { m: 1 } ==> {n: { m: 1} }
// b=a ==> b = {n: { m: 1} }

/*------------
title: 析 2--------------------*/
// 1.只要对变量进行赋值就会进行内存重新申请。 【1】
var a = 1;
a = 2;
var obj = {
  name: "boom",
};
obj.name = "dik";
//对象一样的，只是重新获取属性的地址.
// 2.【2】
// 变量a 内存分配图

// 3.【3】
// 变量b 内存分配图

// 4. 在计算机中，复杂数据类型存储的都是地址，我们在取值时，都是根据地址（门牌号）去查找。

// 5. a.n = a = { m: 1 }
//执行a.n = a = { m: 1 },a.n和a都要申请新的地址，而且在Js引擎中，确实也是读到这句话就会给这个值进行内存分配。【4】
//分为三步：
// (1)
a.n; // a对象添加了属性n，值为undefined
// (2)
a = { m: 1 };
// (3)
a.n = a;
// 6.答案
a = { m: 1 };
b = { n: { m: 1 } };
```

【1】解释过程 （内存如何重新申请的）

执行 a = 1 时 ，内存示意图。

|  地址  | 变量 | 存储值 |
| :----: | :--: | :----: |
| 0x0001 |  a   |   1    |

执行 a = 2 时，内存变化示意图 (原来的内存被释放？)

|    地址    | 变量  | 存储值 |
| :--------: | :---: | :----: |
| ~~0x0001~~ | ~~a~~ | ~~1~~  |
|   0x0002   |   a   |   2    |

【2】a 的内存示意图

|  地址  | 变量 | 存储值 |
| :----: | :--: | :----: |
| 0x0001 |  a   | 0x0002 |
| 0x0002 | a.n  |   1    |

【3】 b 的内存示意图

|  地址  | 变量 | 存储值 |
| :----: | :--: | :----: |
|        |      |        |
|        |      |        |
| 0x0003 |  b   | 0x0001 |

【4】a.n 和 a 重新分配内存

|  地址  |  变量   |      存储值       |
| :----: | :-----: | :---------------: |
| 0x0001 |  ~~a~~  | ~~0x0002~~ 0x0004 |
| 0x0002 | ~~a.n~~ |         1         |
| 0x0003 |    b    |      0x0001       |
| 0x0004 |   a.n   |                   |
| 0x0005 |    a    |                   |

### 总结

1. `只要对变量进行赋值就会进行内存重新申请`
2. 根据运算符优先级运算分析

## ['1', '2', '3'].map(parseInt) 结果是什么？为什么？

## 如何提升 JavaScript 变量的存储性能？

> 访问**字面量和局部变量**的速度最快，访问**数组元素和对象成员**相对较慢;
> 由于局部变量存在于作用域链的起始位置，因此**访问局部变量比访问跨作用域变量更快**，全局变量的访问速度最慢;
> **嵌套的对象成员**会明显影响性能，尽量少用，例如`window.loacation.href`;
> 属性和方法**在原型链中的位置越深**，则访问它的速度也越慢;
> 通常来说，**需要访问多次**的对象成员、数组元素、跨作用域变量**可以保存在局部变量中**从而提升 JavaScript 执行效率;

## 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

## ES5/ES6 的继承除了写法以外还有什么区别？

## setTimeout、Promise、Async/Await 的区别

## Async/Await 如何通过同步的方式实现异步
