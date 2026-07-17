---
title: nvm
category: nodejs
---

## 一句话结论

nvm 用来在同一台机器上安装和切换多个 Node.js 版本，适合处理不同项目的版本要求和本地升级验证。

## 为什么需要它

- 场景：一个旧项目依赖 Node 16，新项目依赖 Node 22；CI 和本地版本要保持一致。
- 不处理会怎样：本地可运行、线上失败，或依赖安装阶段因为 Node 版本不匹配报错。

## 运行时边界

| 工具 | 作用 | 备注 |
| ---- | ---- | ---- |
| Node.js | 运行 JavaScript | 真正执行代码 |
| nvm | 管理 Node 版本 | 不管理项目依赖 |
| npm | 管理包 | 随 Node 安装而来 |
| `.nvmrc` | 声明项目期望版本 | 团队协作常用 |

## 实现

### 常用命令

```bash
nvm install 22
nvm use 22
nvm alias default 22
nvm ls
node -v
npm -v
```

### 项目声明版本

```text
22
```

把上面的内容保存为 `.nvmrc` 后，进入项目执行：

```bash
nvm use
```

## 边界与常见坑

- **Windows 和 macOS/Linux 工具不同**：Windows 通常使用 nvm-windows，命令相似但实现不同。
- **切换 Node 版本后依赖可能要重装**：尤其是带原生扩展的包。
- **全局包不共享**：不同 Node 版本下全局安装目录可能不同。
- **只靠 nvm 不等于锁定依赖**：依赖仍需要 lockfile。

## 工程取舍

- 适合：本地多项目开发、升级验证、团队约定 Node 大版本。
- 谨慎：生产环境不要依赖手工 `nvm use`，应由镜像、运行时平台或部署脚本固定版本。
- 不适合或应换方案：需要完全可复现环境时，优先使用容器或 CI 镜像。

## 面试 / 自测

1. nvm 解决的是运行时版本问题还是依赖版本问题？
2. `.nvmrc` 有什么作用？
3. 切换 Node 版本后为什么可能要重装依赖？

## 相关文章

- [npm](./npm.md)
- [Node.js 文件执行](./execute.md)

## 参考

- [nvm](https://github.com/nvm-sh/nvm)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
