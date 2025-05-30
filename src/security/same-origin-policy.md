---
title: 同源策略
---

### 同源策略

1995 年，网景（Nets pace）公司引入浏览器。**同源策略是浏览器的行为**，是为了保护本地数据不被 JavaScript 代码获取回来的数据污染，因此`拦截的是`客户端发出的请求回来的数据接收，即请求发送了，服务器响应了，但是无法被浏览器接收。

含义： 甲网页设置的 Cookie、localStorage 等限制的内容，乙网页不可获取。

目的：保护用户数据安全，防止恶意的网站窃取数据。

##### 同源

不同网址是否同源，必须满足以下【三个相同】

- 协议相同
- 域名相同
- 端口相同

网址默认端口：80 可省略。

##### 限制行为

1. Cookie、LocalStorage 和 IndexDB 无法读取；
2. DOM 无法获得；

3. Ajax 请求不能发送；

### CORS(后端解决方案)

CORS—允许跨域 （跨域资源共享(Cross Origin Resource Sharing)）

```js
// 使用 cors 模块
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: "*", // 设置源
  })
);
```

```js
// 自定义
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // 设置源
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
```

### JSONP

动态添加`script`标签，并在 src 中添加`callback`

```js
// client
function addScriptTag(src) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.src = src;
  script.id = "jsonp";
  document.body.appendChild(script);
}
window.onload = function () {
  addScriptTag("http://localhost:8888/ip?callback=foo");
  //回调函数 foo 是必须的
};
function foo(data) {
  console.log(typeof data);
  //    var jsonp = document.getElementById('jsonp');
  //    jsonp.parentNode.removeChild(jsonp)
}
```

```js
// server
// ...
switch (pathname) {
  case '/ip':
    // 获取回调函数名
    let callback = qs.parse(req.url.slice(req.url.indexOf("?") + 1)).callback；
    // 回调函数调用并传递参数
    res.end(`${callback}([1,2,3,4])`)
    break;
}
// ...
```

###### feature

- 请求方式（GET）

  因为请求数据的接口地址是写在了\<script\>标签中 src 属性值里面，那么数据请求的方式就只能支持 GET 请求，其他请求无法实现。

- 原生 html 页面更为友好

  在基于 Vue.js 这种框架开发的项目中，因为其使用了虚拟化 DOM 这一概念，JSONP 跨域的方式对其并不是一个很好的选择，对于原生 JavaScript 代码，可以采用此方式进行跨域。

### 反向代理

**通过网页服务器转发网络请求到相应的后端服务器，获取相关数据，然后网页服务器再把这一数据返回给浏览器**

如何实现反向代理？

......
