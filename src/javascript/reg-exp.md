---
title: 正则表达式
---

## 运算优先级

`从左到右，从高到低`

## 常用正则表达式

1. **[0,1)** 的数字 `/^[0](\.\d+)?$/.test(value)`

2. 正整数 `/^[1-9]\d*$/.test(value)`

3. ~~整数 `/^(-?[1-9]*)$/.test(value) 和 /^-?0{1}$/.test(value)` 【正整数、负整数、正负 0】~~

4. 大于 0 的自然数 `/^[0](\.\d+)$/.test(value) 和 /^[1-9]\d*(\.\d+)?$/.test(value)`

## QA

### 正则表达式出现的 `\1`代表什么意思？

> 正则表达式中的小括号`()`代表分组的意思。如果在其后面出现`\1`则是代表**与小括号中要匹配的内容相同**。
>
> **注意**：`\1` 必须与小括号配合使用

示例

1. ` /([yMdhsm])\1*/g` 时间格式判断

   首先`()`中[yMdhsm] 字符集合，匹配`yMdhsm`的任意一个字符；其后面出现`\1` ，且存在`*` 匹配前面的子表达式`零次或多次` ,则是代表继续匹配相同的字符；所以，最终**连续相同的字符**匹配。

2. 判断一个字符串中出现次数最多的字符，并统计次数 ` /(\w)\1*/g`

   ` /(\w)\1*/g` 解析同【1】

   ```js
   function maxChart(str) {
     let charts = str.split("").sort().join("");
     let common = charts.match(/(\w)\1*/g);
     let maxStr = "",
       len = 0;
     common.forEach((val) => {
       if (val.length > len) {
         maxStr = val;
         len = String(val).length;
       }
     });
     return maxStr + ":" + len;
   }
   // 1. 长度为 1 的情况
   // 2. 最大长度多个相同的
   // 3. 参数非法
   ```

3. 返回字符串最长重复字符字串

   ```js
   function maxChart(str) {
     let common = str.match(/(\w)\1*/g);
     let maxStr = "",
       len = 0;
     common.forEach((val) => {
       if (val.length > len) {
         maxStr = val;
         len = String(val).length;
       }
     });
     return maxStr + ":" + len;
   }
   ```

### 参考

[菜鸟教程](https://www.runoob.com/regexp/regexp-tutorial.html)

[匹配规则](https://www.runoob.com/regexp/regexp-rule.html)
