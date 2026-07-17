---
title: 认证与 JWT
category: nodejs
---

## 一句话结论

JWT 是一种带签名的令牌格式，常用于无状态认证和服务间传递声明。它默认不是加密，服务端必须验证签名、过期时间、签发方和使用场景。

## 为什么需要它

- 场景：前后端分离登录、API 鉴权、微服务之间传递用户身份。
- 不处理会怎样：把 JWT 当加密容器会泄露敏感信息；只解码不验签会导致伪造身份。

## 运行时边界

| 能力 | 属于谁 | 备注 |
| ---- | ---- | ---- |
| JWT 格式 | 标准令牌格式 | header、payload、signature |
| 签名验证 | 服务端逻辑 | 不能只 `decode` |
| 存储位置 | 客户端策略 | Cookie / Authorization header |
| HTTPS | 传输安全 | JWT 仍可能被窃取 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| Header | 声明算法和类型 | 不应盲目信任 |
| Payload | 声明集合 | 不放密码、密钥等敏感信息 |
| Signature | 签名 | 防篡改，不负责加密 |
| `exp` | 过期时间 | 应设置较短有效期 |
| Refresh Token | 刷新令牌 | 需要服务端撤销策略 |

## 实现

### 最小可用版

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { sub: "user-123", role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "15m", issuer: "front-end-camp" },
);

const payload = jwt.verify(token, process.env.JWT_SECRET, {
  issuer: "front-end-camp",
});
```

### Express 中间件

```js
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "front-end-camp",
    });
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
```

## 边界与常见坑

- **JWT 默认不加密**：payload 只是 Base64URL 编码，任何拿到 token 的人都能读。
- **`decode` 不等于 `verify`**：`decode` 只解析内容，不能证明可信。
- **泄露后很难立即失效**：需要短过期时间、黑名单、版本号或服务端 session 辅助。
- **不要把长期敏感权限全写进 token**：权限变更后旧 token 仍可能有效。
- **算法和密钥要固定**：不要让客户端输入控制验证算法。

## 工程取舍

- 适合：短期访问令牌、跨服务传递有限声明、无状态 API 鉴权。
- 谨慎：后台管理、强撤销需求、权限频繁变化的系统。
- 不适合或应换方案：高度敏感系统可用服务端 session 或 opaque token。

## 面试 / 自测

1. JWT 的签名解决什么问题？不解决什么问题？
2. 为什么 payload 不能放密码？
3. 如何让已签发 JWT 尽快失效？

## 相关文章

- [环境变量与 CLI](./environment-cli.md)
- [API 开发](./api-development.md)
- [错误处理](./error-handling.md)

## 参考

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [OWASP: JSON Web Token for Java Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
