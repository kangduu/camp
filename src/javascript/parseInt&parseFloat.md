---
title: Javascript的parseInt和parseFloat
category: javascript
---

# parseInt

### 一句话描述

> **parseInt(string, radix)  ** 将一个字符串 string 转换为 radix 进制的整数， radix 为介于2-36之间的数。

### grammar

> ```javascript
> parseInt(string, radix);  // 注意，第一个参数为字符串
> ```

### params

`string`

​	被解析的值。如果不是一个字符串参数，将被（使用 **toString** 方法）转换为字符串。字符串开头的空白符将会被忽略。

`radix`

​	一个介于2和36之间的**整数**，表示字符串（string）的**基数**（进制数）。默认使用十进制。

- [x] 你应该总是赋予radix有效值（[2-36]）。

### return

​	解析后的整数值。若被解析的参数string无法被转化成数值类型，则返回`NaN` 。

### 特殊情况

在基数为 `undefined`，或者基数为 ` 0` 或者`没有指定`的情况下，JavaScript 作如下处理：

- 如果字符串 `string` 以"0x"或者"0X"开头, 则基数是16 (16进制).
- 如果字符串 `string` 以"0"开头, 基数是8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用10，但是并不是所有的浏览器都遵循这个规定。因此，**永远都要明确给出radix参数的值**。
- 如果字符串 `string` 以其它任何值开头，则基数是10 (十进制)。

### 意外的结果

```javascript
// 返回 NaN
parseInt("546", 2);   //NaN 除了“0、1”外，其它数字都不是有效二进制数字

//你可能觉得很不可思议
parseInt(4.7, 10); // 4
parseInt(4.7 * 1e22, 10); // 4 、 非常大的数值变成 4
parseInt(0.00000000000434, 10); // 4 、 非常小的数值变成 4
```

### 严格解析整数

```javascript
function filterInt(value) {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value)
    return NaN
}
```

### 参考

[parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)  重点阅读理解**描述部分**

# parseFloat

### 一句话描述

> **parseFloat() **函数解析一个参数（**必要时先转换为字符串**）并返回一个浮点数。

### grammar

> ```javascript
> parseFloat(string);
> ```

### params

`string` 

​	需要被解析成为**浮点数**的值。

### return

​	给定值被解析成浮点数。

​	如果给定值不能被转换成数值，则会返回 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)。

### 你应该知道

​	parseFloat 是一个全局函数，它不属于任何对象。

### 特殊解析情况

- 如果 `parseFloat` 在解析过程中 遇到了正号（`+`）、负号（`-` ）、数字（`0`-`9`）、小数点（`.`）、或者科学记数法中的指数（e 或 E）<u>以外的字符</u>，则它会`忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数`。
- <u>第二个小数点</u>的出现也会使解析停止（在这之前的字符都会被解析）。
- 参数首位和末位的<u>空白</u>符会被忽略。
- 如果参数字符串的<u>第一个字符不能被解析成为数字</u>,`则` `parseFloat` 返回 `NaN`。
- `parseFloat` 也可以解析并返回 [`Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity)。
- `parseFloat`解析 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 为 [`Numbers`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number), 丢失精度。因为末位 `n` 字符被丢弃。