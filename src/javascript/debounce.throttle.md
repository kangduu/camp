---
title: 节流和防抖
category: javascript
---

### 什么是防抖和节流？有什么区别？

你在实际开发中肯定写过这样的业务需求，随着滚动条滚动判断滚动距离，实现导航栏固定在顶部、为页面不同业务模块添加滚动到可视区域显示动画等需求。这个时候我们的业务逻辑代码在每一次滚动事件触发时便会执行一次，而滚动事件属于高频事件，触发后则可能导致浏览器卡死，必须对其进行防抖或节流处理进而控制执行次数。

常见的需要防抖或节流预处理的事件有：

📢 鼠标事件，onmousedown 和 onmousemove，连续点击和移动

📢 输入事件，onkeyup 和 onkeydown

📢window，resize 和 scroll

##### 防抖（debounce）

`触发高频事件后，n秒内事件再次触发，则重新开始计时，直到n秒内只触发了一次，则执行函数`。我们用乘坐电梯来打个比方（不考虑电梯超载），当电梯门要关闭时，突然又有人需要乘坐电梯，此时电梯并没有改变楼层，而是再次打开了电梯门。这样电梯延迟了改变楼层的功能，同时也优化了资源（一次）。

##### 节流（throttle）

`触发高频事件后，n秒内事件多次触发只执行一次。` 这就好比'水滴效应'💧 水积攒到一定重量才会下落。

##### 二者区别

防抖和节流的区别主要体现在处理函数**执行次数的不同**。

👣 防抖将多次执行变为**最后执行一次** ，`归一`；

👣 节流将多次执行变成**每隔一段时间执行一次** ，`稀释`；

### 防抖实现

⚪**青铜**

```js
function debounce(fn, wait) {
  let timer = null; // 维护一个timer
  return function () {
    // 通过`this`和`arguments`缓存函数的作用域和参数
    let context = this;
    let args = arguments;
    clearTimeout(timer); //清除最后一次点击之前触发的事件
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, wait);
  };
}

// 注意 fn无返回值（默认undefined）
```

🔘**白银**

添加 immediate 参数，**控制触发后是否立即执行**。

```js
function debounce(fn, wait = 800, immediate = true) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
+   timer && clearTimeout(timer);
+   if (immediate) {
+     // 首次触发，timer默认为假值。
+     // 若连续触发，则timer为setTimeout返回的最新的ID值[Number]，则runNow为false。
+     let runNow = !timer;
+     // 指定时间wait过后才将定时器清除
+     timer = setTimeout(function () {
+       timer = null;
+     }, wait);
+     if (runNow) fn.apply(context, args)
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    }
  }
};
// 注意 fn无返回值（默认undefined）
```

⚫**黄金**

**为事件处理函数 fn 添加返回值**。目前要返回值的话，只能在 immediate 为 true 时返回。因为 else 语句中为异步代码执行，所以返回的都是 undefined。

```js
function debounce(fn, wait = 800, immediate = true) {
  let timer;
  return function () {
    let context = this, args = arguments;
    timer && clearTimeout(timer);
    if (immediate) {
      // 首次触发，timer默认为假值。
      // 若连续触发，则timer为setTimeout返回的最新的ID值[Number]，则runNow为false。
      let runNow = !timer;
      // 指定时间wait过后才将定时器清楚
      timer = setTimeout(function () {
        timer = null;
      }, wait);
+     if (runNow) return fn.apply(context, args)
    }
    else {
      timer = setTimeout(function () {
        return fn.apply(context, args);
      }, wait);
    }
  }
};
```

🔵**铂金**

实现在**等待执行的过程中取消延迟并立即执行函数 fn**

```js
function debounce(fn, wait = 800, immediate = true) {
+ let timer, debounced;
+ debounced = function () {
    let context = this, args = arguments;
    timer && clearTimeout(timer);
    if (immediate) {
      // 首次触发，timer默认为假值。
      // 若连续触发，则timer为setTimeout返回的最新的ID值[Number]，则runNow为false。
      let runNow = !timer;
      // 指定时间wait过后才将定时器清楚
      timer = setTimeout(function () {
        timer = null;
      }, wait);
      if (runNow) return fn.apply(context, args)
    }
    else {
      timer = setTimeout(function () {
        return fn.apply(context, args);
      }, wait);
    }
  }
+ debounced.cancel = () => {
+   clearTimeout(timer)
+   timer = null
+ }
+ return debounced
};
```

### 节流实现

🔘**白银（时间戳）**

```js
//指定时间内触发，时间一到就会触发（不管你执行了多少次）
//思路：定义一个上次的时间，时间触发获取当前时间，满足【当前时间-上次时间>延迟时间】则触发，然后更新上次时间previous。
function throttle(func, delay) {
  let previous = 0;
  return function () {
    let now = new Date();
    if (now - previous > delay) {
      func.apply(this, arguments);
      previous = now;
    }
  };
}
```

🔘**白银（定时器）**

```js
// 思路：事件触发时，设置一个定时器，定时器未执行前再次触发事件则不执行；定时器执行，则执行函数，然后清空定时器，再设置下一个定时器。
function throttle(fn, delay) {
  let timer;
  return function () {
    let context = this,
      args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(context, args);
      }, delay);
    }
  };
}
```

⚫**黄金**

合二为一（有头有尾）；有头——触发时便执行一次，第一次间隔到了再执行一次；有尾——停止触发，会更根据计算条件再执行一次

```js
// 第一次触发即执行，然后每隔一段时间执行，最后停止再时间间隔结束时执行一次
function throttle(fn, delay) {
  let timer,
    context,
    args,
    // 记录上次触发的时间
    previous = 0;
  return function () {
    let now = +new Date(),
      //下次触发fn剩余的时间
      remaining = delay - (now - previous);
    context = this;
    args = arguments;
    // 无剩余时间，或系统时间改变(人为)
    if (remaining <= 0 || remaining > delay) {
      // 首次触发会立即执行本部分
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = now;
      fn.apply(context, args);
    } else if (!timer) {
      // 设置定时器
      timer = setTimeout(() => {
        fn.apply(context, args);
        previous = +new Date();
        timer = null;
      }, remaining);
    }
  };
}
// 正常一次连续触发的执行应该是： 一次if，然后每次都是else if（最后一次也是），
```

### underscore 中防抖和节流源码解析

### 总结

防抖和节流主要是满足性能优化需求实现，避免意外错误。

##### 🔗**参考**

- [节流](https://github.com/mqyqingfeng/Blog/issues/26)
- [防抖](https://github.com/mqyqingfeng/Blog/issues/22)
- [underscore](https://underscorejs.net/)
- [Debounce vs Throttle: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
