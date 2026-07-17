---
title: API 请求
category: javascript
---

## 一句话结论

浏览器中发起 HTTP 请求优先使用 Fetch API；XMLHttpRequest 是历史方案，仍会在旧代码、上传进度和兼容场景中看到。请求代码要处理状态码、超时、取消、解析失败和跨域。

## 为什么需要它

- 场景：调用后端接口、提交表单、加载配置、轮询任务状态、上传下载文件。
- 不处理会怎样：只处理成功路径，接口失败、超时、JSON 解析失败或跨域错误会变成难查 bug。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| Fetch | 现代请求 API | Promise 风格 |
| XMLHttpRequest | 旧请求 API | 支持进度事件 |
| Response | Fetch 响应对象 | `ok` 才代表 2xx |
| AbortController | 取消请求 | 可配合超时 |
| CORS | 跨源资源共享 | 由浏览器和服务端共同决定 |

## 原理

Fetch 只有网络层失败才会 reject；HTTP 4xx/5xx 仍会 resolve，需要检查 `response.ok`。跨域失败时，浏览器出于安全限制不会暴露完整响应细节。

## 实现

### Fetch 封装

```js
async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? 10_000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
```

### XMLHttpRequest

```js
function requestByXhr(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send();
  });
}
```

## 边界与常见坑

- **Fetch 遇到 404 不会自动 reject**：要检查 `response.ok`。
- **超时要自己实现**：Fetch 本身没有 timeout 选项。
- **取消请求不等于服务端一定停止处理**。
- **跨域不是前端单方能解决**：服务端必须返回正确 CORS 头。
- **不要直接信任接口数据**：需要运行时校验。

## 工程取舍

- 适合：新项目优先 Fetch；复杂请求层可封装统一错误、鉴权和重试。
- 谨慎：重试非幂等请求可能造成重复写入。
- 不适合或应换方案：需要上传进度时，XHR 或专门库仍可能更合适。

## 面试 / 自测

1. Fetch 在 HTTP 500 时会 reject 吗？
2. 如何取消一个 Fetch 请求？
3. CORS 错误为什么前端看不到完整响应？

## 相关文章

- [异步编程](./async.md)
- [事件循环](./event.loop.md)
- [JSON 与数据结构](./data-types.md)

## 参考

- [MDN: Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)
- [MDN: XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)
- [MDN: CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS)
