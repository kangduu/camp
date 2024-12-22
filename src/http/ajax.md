---
title: Ajax
---

### 导读

[Ajax](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX)（Asynchronous  Javascript And XML，异步 JavaScript 和 XML），是指一种创建交互式、快速动态网页应用的网页开发技术。

###### feature

1. 可以在不重新加载整个网页的情况下，对网页的某部分进行更新。【局部】
2. 通过在后台与服务器进行少量数据交换，Ajax 可以使网页实现异步更新。【异步】

> [JSON和XML](http://dukangblog.top/2020/03/21/xml-json/)都被用于在Ajax模型中打包信息【数据交换】。

### XMLHttpRequest实例化对象的主要属性

`xhr.readyState` :	XMLHttpRequest对象的状态

| 状态   | 名称            | 描述                                       |
| ---- | ------------- | ---------------------------------------- |
| 0    | Uninitialized | 初始化状态。XMLHttpRequest 对象已创建或已被 abort() 方法重置。 |
| 1    | Open          | open() 方法已调用，但是 send() 方法未调用。请求还没有被发送。   |
| 2    | Sent          | Send() 方法已调用，HTTP 请求已发送到 Web 服务器。未接收到响应。 |
| 3    | Receiving     | 所有响应头部都已经接收到。响应体开始接收但未完成。                |
| 4    | Loaded        | HTTP 响应已经完全接收。                           |

`xhr.status `:   服务器返回的状态码，等于200表示一切正常。 

`xhr.responseText `:    服务器返回的文本数据

`xhr.responseXML`:    服务器返回的XML格式的数据

`xhr.statusText` :    服务器返回的状态文本。

### 老版本XMLHttpRequest对象 的缺点

- 只支持文本数据的传送，无法用来读取和上传二进制文件。
- 传送和接收数据时，没有进度信息，只能提示有没有完成。
- 受到"同域限制"（Same Origin Policy），只能向同一域名的服务器请求数据。

### 新版本XMLHttpRequest对象的功能

> 可以设置HTTP请求的`时限`（timeout）。
>
> 可以使用`FormData对象`管理表单数据（new FormData() ）。
>
> 可以`上传文件`。
>
> 可以请求不同域名下的数据（`跨域请求`）。
>
> 可以获取服务器端的`二进制数据`。
>
> 可以获得数据`传输的进度`信息（onprogress ）。

### 封装一个原生的Ajax请求方法

```js
function requestAjax(url, method = 'GET', async = true) {
  var xhr;
  //new 一个 xml 对象 （兼容）
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP")
  }

  if (xhr != null) {
    //xhr打开通道url
    xhr.open(method, url, async);

    // xhr.setRequestHeader()

    //监听
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        data = JSON.parse(xhr.responseText);
        console.log(data.info)
      }
    }
    xhr.timeout = 1000;   // 只可在异步请求下设置超时时间
    xhr.ontimeout = function () {
      console.log('请求超时');
      // do something
      // requestAjax(url, method, async)
    }
    //发送请求
    xhr.send(null);
  } else {
    throw Error('The XHR instance could not be created')
  }
}
```

### vue中使用axios并封装

```js
import axios from 'axios';
// add hostDomain
const hostDomain = 'http://localhost:8888/api';
const AUTH_TOKEN = localStorage.getItem('token')
const instance = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: hostDomain,
  //timeout: 3000
  //headers: {'X-Custom-Header': 'foobar'}
})
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN;

//在请求或响应被 then 或 catch 处理前拦截它们。
// 请求拦截
instance.interceptors.request.use(function (res) {
  // do somethingb
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截
instance.interceptors.response.use(function (config) {
  // do something
  return config
}, function (error) {
  return Promise.reject(error)
})

class Ajax {
  static Get(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(function (response) {
        const _data = response.data;
        if (_data.code === 0 || _data.code === '0') {
          // 与后端协商的成功处理
          // 判断code ，做一些响应处理，如 提示
          resolve(_data)
        } else {
          // 不符合业务规则的处理逻辑
          reject(response)
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  }
  static Post(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(function (response) {
        const _data = response.data;
        if (_data.code === 0 || _data.code === '0') {
          // 与后端协商的成功处理
          resolve(_data)
        } else {
          // 不符合业务规则的处理逻辑
          reject(response)
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  }
}

export default Ajax
```

```js
// main.js
import Ajax from './axios/index'
Vue.prototype.ajax = Ajax
```

### vue-cli3.x使用反向代理模式实现跨域

**vue.config.js**

```js
module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: 'http://server:3000', // 需要跨域的目标url
                changeOrigin: true, // 将基于名称的虚拟托管网址的选项，不配置请求会报错
                ws: true,//代理websockets
                pathRewrite: { // 重写路径，去掉/api
                    "^/api": ''
                }
            }
        }
    }
}
```

### jQuery中的[ajax](https://www.jquery123.com/category/ajax/)

### 参考

- [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [XMLHTTP](https://blog.csdn.net/s1070/article/details/52088590)
- [ActiveXObject](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Microsoft_Extensions/ActiveXObject)
- [axios](http://www.axios-js.com/zh-cn/docs/)