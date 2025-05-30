---
title: 深拷贝和浅拷贝
category: javascript
---

在讨论深拷贝和浅拷贝之前，我们有必要了解一下 JavaScript 的数据类型。

基本数据类型：Undefined、Null、Number、String、Boolean、Symbol、BigInt, 存放在栈内存。

引用类型：Object、Array、function，存放在堆内存。

### 基本类型的数据

基本数据类型的值在内存中大小是固定的，并且被保存在栈内存里。我们来看一个例子：

```javascript
let a = 1;
let b = a; // 复制了 a
b = 2;
console.log(a); // 1
console.log(b); // 2
```

分析上述例子，如图：a 和 b 都是基本数据类型，但是 b 是 a 的一个副本，都占有不同的位置，相等的内存空间，只是它们的值相等，**若改变其中一个，另一个不会随之改变**

`深拷贝和浅拷贝只是针对引用类型`

### 引用类型的数据

引用类型的值是对象或者数组，保存在堆内存中的。包含引用类型值的变量实际上不是对象或数组本身，而是其引用值（地址）。复制一个对象或数组，实际复制的是引用值，最终两个变量都是同一个地址值。我们来看一个数组的例子：

上述例子中，数组 b 和 a 指向同一个地址，修改任何一个对应都会改变。

### 深拷贝和浅拷贝

首先我们必须知道的是，提到深拷贝和浅拷贝只是针对引用类型来说 的，并且注意深拷贝，是拷贝对象各个层级的属性。简单理解就是：有一个 A，然后 B 复制了 A，当修改 A 时看 B 是否发生改变，如果 B 改变了就是浅拷贝，俗话说的拿人手短；如果 B 没有改变那么就是深拷贝，可以自食其力了。

##### 浅拷贝

- 数组浅拷贝

```javascript
let a = [0, [1], 2, 3, 4];
let b = a;
b[0] = 1;
console.log(a); //[ 1, [ 1 ], 2, 3, 4 ]
console.log(b); //[ 1, [ 1 ], 2, 3, 4 ]
```

- 对象浅拷贝

```javascript
let obj_a = {
  name: "ken",
  age: 10,
};
let obj_b = obj_a;
obj_b.name = "kimi";
obj_b.job = "teacher";
console.log(obj_b); //{ name: 'kimi', age: 10, job: 'teacher' }
console.log(obj_a); //{ name: 'kimi', age: 10, job: 'teacher' }
```

##### 深拷贝(拷贝对象各个层级的属性)

- 数组深拷贝(slice,concat)

```javascript
let a = [0, [1], 2, 3, 4];
let b = a.slice();
b[0] = 1;
console.log(a); //[ 0, [ 1 ], 2, 3, 4 ]
console.log(b); //[ 1, [ 1 ], 2, 3, 4 ]

注意;
let a = [0, [1], 2, 3, 4];
let b = a.slice();
b[1][0] = 8;
console.log(a); //[ 0, [ 8 ], 2, 3, 4 ]
console.log(b); //[ 0, [ 8 ], 2, 3, 4 ]
```

- 对象深拷贝

JSON 对象的 parse 和 stringify 方法

```javascript
let obj_a = {
  name: "ken",
  age: 10,
  son: {
    age: 1,
  },
  method: function () {
    console.log(666);
  },
};
let obj_b = JSON.parse(JSON.stringify(obj_a));
obj_b.name = "kimi";
obj_b.job = "teacher";
obj_a.son.age = 2;
console.log(obj_b); //{ name: 'kimi', age: 10, son: { age: 1 }, job: 'teacher' }
console.log(obj_a); //{ name: 'ken', age: 10, son: { age: 2 } }

obj_a.method(); //666
obj_b["method"] = function () {
  console.log(999);
};
obj_b.method(); //999
obj_a.method(); //666
```

[JSON 实现深克隆的弊端](https://juejin.im/post/5c20509bf265da611b585bec#heading-6)

```javascript
let a = {
  age: undefined,
  jobs: function () {},
  name: "yck",
};
console.log(JSON.parse(JSON.stringify(a)));
// { name: 'yck'},
```

##### 递归遍历

```javascript
function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}
```

##### [jQuery 的 extend 方法](http://jquery.cuishifeng.cn/jQuery.extend.html)

$.extend( [deep ], target, object1 [, objectN ] )
