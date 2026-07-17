---
title: 数据库访问
category: nodejs
---

## 一句话结论

Node.js 访问数据库时可直接使用 native driver，也可使用 ORM/Query Builder。选择 Prisma、Drizzle、TypeORM、Sequelize、Knex 或 Mongoose 时，要看数据库类型、类型安全、迁移、查询复杂度和团队熟悉度。

## 为什么需要它

- 场景：用户、订单、权限、日志、配置等持久化数据。
- 不处理会怎样：SQL 注入、连接泄露、迁移混乱、查询性能不可控。

## 运行时边界

| 数据库类型 | 常见工具 | 备注 |
| ---- | ---- | ---- |
| MongoDB | Mongoose / native driver | 文档数据库 |
| PostgreSQL/MySQL | Prisma / Drizzle / TypeORM / Knex / Sequelize | 关系型数据库 |
| Native driver | 官方或底层驱动 | 控制力强，样板多 |

## 实现

### 参数化查询思路

```js
// 伪代码：重点是参数化，不要拼接用户输入
const user = await db.query("select * from users where id = ?", [id]);
```

### Prisma 示例

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUser(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}
```

## 边界与常见坑

- **不要拼接 SQL**：使用参数化查询或 ORM API。
- **连接池要复用**：不要每个请求新建客户端。
- **迁移要纳入版本控制**：schema 变化应可回滚和追踪。
- **ORM 不等于不用懂 SQL**：复杂查询仍需理解索引和执行计划。
- **请求结束要处理事务边界**：失败时回滚。

## 工程取舍

- 适合：Prisma 类型体验好，Drizzle 更贴近 SQL，Knex 灵活，Mongoose 适合 MongoDB。
- 谨慎：TypeORM/Sequelize 装饰器和运行时模型较重。
- 不适合或应换方案：极复杂报表和分析场景应考虑专门查询层或数据仓库。

## 面试 / 自测

1. ORM 和 native driver 的主要差异是什么？
2. 为什么不能拼接 SQL？
3. 连接池解决什么问题？

## 相关文章

- [API 开发](./api-development.md)
- [错误处理](./error-handling.md)
- [日志](./logging.md)

## 参考

- [Prisma](https://www.prisma.io/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Mongoose](https://mongoosejs.com/)
- [Knex](https://knexjs.org/)
