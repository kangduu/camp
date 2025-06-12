---
title: JavaScript
icon: fa6-brands:square-js
---

## 分时函数

### 为什么会有分时函数啦？

​ 防抖和节流是对重复或频繁触发的任务控制，移除部分操作，只执行最后一次或每隔一段时间执行一次。

​ 分时函数同样是**多任务，但是不让其一次执行完，而是每一段时间执行一部分**。比如添加 dom 节点，一次需要条件 100 个，可分为 10 次，一次 10 个。

​ 分时函数主要是**解决页面一次渲染数据（或节点）太多，导致页面卡顿或假死现象**。

### 分时函数案例

首先我们来看一个案例，通过循环添加了 1000 个 div。其中处理数据少，当每一个元素都需要请求计算数据是，消耗无比的大。

```javascript
function add() {
  let parent = document.getElementById("time-chunk");
  for (let index = 0; index < 1000; index++) {
    let div = document.createElement("div");
    div.innerHTML = index;
    parent.appendChild(div);
  }
}
add();
```

### 解决思路

我们解决这种问题的思路是

1. 知道任务总数，每次执行数量，执行间隔，以及单元任务的处理函数
2. 将所有任务传入，执行一个任务后便将其移除——**队列数组（先进先出）**
3. 维护一个 setInterval，循环执行

```javascript
/**
 * @param {array}       dataArray  ，任务数组
 * @param {function}    fn   ， 每一次任务的业务逻辑执行函数
 * @param {number}      count ， 每一次任务执行数量
 * @param {number}      duraiton  ，单位 ms ，间隔多少毫秒执行一次
 */
function timeChunk(dataArray, fn, count = 1, duration = 1000) {
  let timer,
    //防止重复
    isRuning = false;
  function eachChunk(chunks) {
    for (let i = 0; i < chunks; i++) {
      let obj = dataArray.shift();
      fn(obj); //每次实际执行操作
    }
  }

  return function () {
    if (isRuning) return;
    isRuning = true;
    timer = setInterval(() => {
      // 动态计算任务长度
      let len = dataArray.length;
      if (len === 0) {
        clearInterval(timer);
        isRuning = false;
      } else {
        // 如果剩余任务长度不足count，则全部执行
        let remainder = len >= count ? count : len;
        eachChunk(remainder);
      }
    }, duration);
  };
}
```

## 惰性加载-不重复判断

### 惰性加载存在的意义

惰性加载，意义在于避免重复的嗅探判断操作，因为这些操作在每次代码执行时都是一样的，而我们可以在一次执行时就得到嗅探结果，从而提高代码效率。

### 案例佐证

我们在做兼容性处理时，会有下面这样的判断，这样处理的话，每调用一次就会执行一次判断，

```javascript
let addEvent = function (ele, type, handler) {
  if (window.addEventListener) {
    return ele.addEventListener(type, handler, false);
  }
  if (window.attachEvent) {
    return ele.attachEvent("on" + type, handler);
  }
};
```

你需要做点什么，封装一个方法，用于为元素绑定事件，但是像上面的判断只需要执行一次。

```javascript
let addEvent = (function () {
  if (window.addEventListener) {
    return function (ele, type, handler) {
      ele.addEventListener(type, handler, false);
    };
  }
  if (window.attachEvent) {
    return function (ele, type, handler) {
      ele.attachEvent("on" + type, handler);
    };
  }
})();

//使用立即执行函数，在初始化时便执行一次嗅探，然后返回浏览器支持的方法。
```

但是，如果你没有一次事件绑定操作，那这一次立即执行岂不是浪费？

所以还要修改：(在绑定事件第一次执行时修改绑定方法)

```javascript
let addEvent = function (ele, type, handler) {
  // 嗅探判断，并更新绑定函数
  if (window.addEventListener) {
    addEvent = function (ele, type, handler) {
      ele.addEventListener(type, handler, false);
    };
  }
  if (window.attachEvent) {
    addEvent = function (ele, type, handler) {
      ele.attachEvent("on" + type, handler);
    };
  }
  // 执行一次绑定
  addEvent(ele, type, handler);
};
```

## 高阶函数（higher-order-function）

“所谓高阶函数就是**操作函数的函数**，它接收一个或多个函数作为参数，并返回一个函数。”——JavaScript 权威指南。注意两个概念：`操作函数` `参数或返回值`

### 作为参数

- 回调函数（第一个能想到的）
  - 在 ajax 异步请求的过程中，回调函数使用的非常频繁
  - 在不确定请求返回的时间时，将 callback 回调函数当成参数传入
  - 待请求完成后执行 callback 函数

### 作为返回值 - 类型判断——`Object.prototype.toString.call(target)`

```JavaScript
// 之前的写法
function checkType(target) {
  let typeStr = typeof (target),
      template = {
        '[object Array]': 'array -> Object',
        '[object Object]': 'object -> Object',
        '[object Null]': 'null -> Object'
      };
  if (typeStr === 'function') return 'function'
  if (typeStr !== 'object') return typeStr
  else return template[Object.prototype.toString.call(target)]
}
// ！注意
Object.prototype.toString.call(null) // [object Null]
// undefined null string number boolean Symbol BigInt Array function Object Date ......
```

```JavaScript
// 现在我要这样写
function checkType(type) {
  return function (target) {
    return Object.prototype.toString.call(target) === `[object ${type}]`
  }
}
const isString = checkType('String');
const isDate = checkType('Date');

console.log(isDate(new Date())); // true
console.log(isString('ddd')) //true

// 这样写更加强大，其原理也是使用Object.prototype.toString.call(target)
//偏函数——返回了一个包含预处理参数的新函数
```

### 作为返回值 - 预置函数——当目标条件满足才执行回调函数

```javascript
let count = 2;
function preset(condition, callback) {
  return function () {
    if (condition == 0) callback();
    else {
      console.log(condition);
      condition--;
    }
  };
}
function fn() {
  console.log("doing");
}
const result = preset(count, fn);
result(); // 2
result(); // 1
result(); // doing
```

### 作为返回值 - 装饰者模式

```html
<body>
  <input id="name" @click="hint" />

  <script>
    new Vue({
      //...
      methods:{
        hint(){
          // 原有业务
          // do something
        }
      }
    })

    //装饰者模式
    function decorator(input, fn) {
      //事件源 element
      let eventOrigin = document.getElementById(input)；
      if(eventOrigin) return function () {
        // 是否绑定事件
        if (typeof eventOrigin.onclick === 'function') {
          //保存原有事件
          const oldClickFn = eventOrigin.onclick;
          //添加新事件
          eventOrigin.onclick = function () {
            // 执行原事件
            oldClickFn();
              // 执行新增事件
              fn()
          }
        } else {
          //直接执行新增事件
          eventOrigin.onclick = fn;
        }
      }
    }
    const clickName = decorator('name', function () {
      //新增业务，不改变原有业务
    })
    clickName && clickName();
  </script>
</body>
```

### 作为返回值 - 单列模式

```javascript
// ! 单列模式——私有变量
const singleModel = (function () {
  const privateVariable = {
    MAX_NUM: 1000,
    MIN_NUM: 1,
    COUNT: 10000,
  };

  return function (key) {
    return privateVariable[key] ? privateVariable[key] : undefined;
  };
})();
console.log(singleModel("MAX_NUM")); //1000
```

### 其它应用

1. [函数柯里化](./柯里化.md)
2. [防抖/节流](./debounce.throttle.md)
3. [分时函数](#分时函数)
4. [惰性加载](#惰性加载-不重复判断)
