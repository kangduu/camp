# 为什么 Object.prototype.toString.call() 可以准确判断对象类型？

在回答这个问题之前，我们必须掌握以下知识点：

- [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
- [typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
- [operand.prototype.toString()]()，返回对象的字符串形式
- [delete 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)
- [Object.prototype.hasOwnProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)方法会返回一个布尔值，指示对象自身属性中是否具有指定属性
- [Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

由于JavaScript是弱类型语言，导致实际工程开发中，需要进行大量的类型检查工作。比如，在遍历一个数组之前，你必须先判断他是否是一个数组类型，否则这将可能出错。

```js
function set(data){
    // 类型判断
    if(Array.isArray(data)) {
        return data.forEach(()=>{
        	// todo
    	})
    }
}
```
如果你是一位初学者，你肯定遇到过下面的现象。

```js
// JavaScript 诞生以来便如此
typeof null === 'object'; // true

typeof [1,2,3]; // object
```

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
2. 特别注意一点，除 Function 外的所有构造函数的类型都是 'object'，如Array、Set、WeakSet、Map、WeakMap 等的结果都是 ‘object’ 。

### 从 [Object.prototype.toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 探讨内置对象的 toString 实现

每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。**如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object *type*]"，其中 `type` 是对象的类型。**

>  [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)对象**覆盖**了从[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)继承来的[`toString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法。对于用户定义的 [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 对象，`toString`方法返回一个字符串，其中包含用于定义函数的源文本段。
>
> ......

举个🌰，如果我们将`Function.prototype.toString`删除后再调用`.toString()`，会得到什么结果啦？

```js
function fn() {}
console.log(fn.toString()); // function fn() {}
delete Function.prototype.toString;
console.log(fn.toString()); // [object Function]
```

将`Function.prototype.toString`删除后，第二次调用toString时，其实调用的是`Object.prototype.toString`，在上述代码基础上证明观点。

```js
function fn() {}
console.log(fn.toString());
delete Function.prototype.toString;
console.log(fn.toString());

+ console.log(Function.prototype.toString === Object.prototype.toString); // true
+ console.log(fn.hasOwnProperty("toString")); // flase
```

其实，所有的内置对象都覆盖了从Object继承来的toString方法。

这也就解释了为什么 `Object.prototype.toString.call(operand)` 可以准确判断操作数的类型。

## 总结

Array、Function 等内置对象作为 Object 的实例，都各自重写了 `toString` 方法，要得到操作数的具体类型，就要调用 Object 的原型的未被重写的 toString 方法。

使用 `Object.prototype.toString`  来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数，称为 `thisArg`。

QA：为什么 `typeof null === 'object' ` ? [答案](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)

## References

- [[使用 toString() 检测对象类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#%E4%BD%BF%E7%94%A8_tostring()_%E6%A3%80%E6%B5%8B%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B)

