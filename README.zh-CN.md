![SQL Chat banner](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/banner.webp)

<div align="center">
  <h3>SQL Chat</h3>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY">
    <img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel">
  </a>
  <p><a href="README.md">English</a> | 中文 | <a href="README.es-ES.md">Español</a></p>
</div>

## 介绍

SQL Chat 是一个基于聊天的 SQL 客户端，使用自然语言与数据库以沟通的方式，实现对数据库的查询、修改、新增、删除等操作。

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot1.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot2.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot3.webp)

## 为什么会出现 SQL Chat

随着我们进入 [开发者工具 2.0 时代](https://www.sequoiacap.com/article/ai-powered-developer-tools/)，使用基于聊天的界面重建现有工具的机会非常大。SQL Client 也不例外。与在许多 UI 控件之间导航不同，基于聊天的界面更加直观。当然，前提是那可行，而我们的目标就是提供这种体验。

## SQL Chat 是怎样的

SQL Chat 是由 [Next.js](https://nextjs.org/) 构建的，它支持以下数据库，并将随着时间的推移支持更多:

- MySQL
- PostgreSQL
- MSSQL
- TiDB Cloud

## 数据保密

- 所有数据库连接配置都本地存储在浏览器中，您也可以访问设置到清除数据。

- 只有数据库模式提供给 OpenAI API，表数据不会提供给 OpenAI API。

- 如果使用 [sqlchat.ai](https://sqlchat.ai), 它会记录下这些匿名对话。

## IP 白名单

如果使用 [sqlchat.ai](https://sqlchat.ai) 连接数据库，则需要在数据库白名单 I P 中添加 0.0.0.0(允许所有连接)。因为 sqlchat.ai 托管在 [Vercel](https://vercel.com/) 上 [使用动态 IP](https://vercel.com/guides/how-to-allowlist-deployment-ip-address)。如果这是一个问题，请考虑下面的自主机选项。

## 使用 Docker 自托管

```bash
docker run --name sqlchat --platform linux/amd64 -env NEXTAUTH_SECRET=xxx -p 3000:3000 sqlchat/sqlchat
```

### OpenAI 相关变量:

- `NEXT_PUBLIC_ALLOW_SELF_OPENAI_KEY`: 设置为 `true` 如果你允许用户提供自己的 OpenAI API key.
- `OPENAI_API_KEY`: OpenAI API Key，通过[这里](https://beta.openai.com/docs/developer-quickstart/api-keys)申请。
- `OPENAI_API_ENDPOINT`: OpenAI API 端点，默认为 `https://api.openai.com`。

### 数据库相关变量:

- `NEXT_PUBLIC_DATABASE_LESS`: 设置为 `true` 如果你想让 SQL Chat 运行时不需要数据库。这个会关闭如下功能:
  1. 账户系统。
  1. 用户额度控制。
  1. 支付。
  1. 使用数据收集。
- `DATABASE_URL`: 只有在 NEXT_PUBLIC_DATABASE_LESS 为 true 时有效。Postgres 数据库连接串 e.g. `postgresql://postgres:YOUR_PASSWORD@localhost:5432/sqlchat?schema=sqlchat`.

```bash
docker run --name sqlchat --platform linux/amd64 --env NEXTAUTH_SECRET=xxx --env OPENAI_API_KEY=yyy --env OPENAI_API_ENDPOINT=zzz -p 3000:3000 sqlchat/sqlchat
```

## 本地开发环境

1. 安装依赖项

   ```bash
   pnpm i
   ```

1. 复制示例环境变量文件;

   ```bash
   cp .env.example .env
   ```

1. 生成 `prisma` 客户端

   ```bash
   pnpm prisma generate
   ```

1. 将您的 [API 密钥](https://platform.openai.com/account/api-keys) 和 `OpenAI API` 端点（可选）添加到新创建的 `.env` 文件;

### 配置数据库

1. 启动 Postgres 实例。对于 mac，您可以使用 [StackbBricks](https://stackbricks.app/), [DBngin](https://dbngin.com/) 或者 [Postgres.app](https://postgresapp.com/)。

1. 创建一个数据库:

   ```sql
   CREATE DATABASE sqlchat;
   ```

   在 `.env` 文件中, 将连接字符串分配给环境变量 `DATABASE_URL` 和 `DATABASE_DIRECT_URL`。至于需要两个 URL 的原因[见此](https://www.prisma.io/docs/data-platform/data-proxy/prisma-cli-with-data-proxy#set-a-direct-database-connection-url-in-your-prisma-schema).

1. 设置数据库 schema

```bash
pnpm prisma migrate dev
```

1. 初始化数据（可选）

```bash
pnpm prisma db seed
```

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=sqlchat/sqlchat&type=Date)](https://star-history.com/#sqlchat/sqlchat&Date)

## 社区

[![Hang out on Discord](https://img.shields.io/badge/%20-Hang%20out%20on%20Discord-5865F2?style=for-the-badge&logo=discord&labelColor=EEEEEE)](https://discord.gg/z6kakemDjm)

[![Follow us on Twitter](https://img.shields.io/badge/Follow%20us%20on%20Twitter-1DA1F2?style=for-the-badge&logo=twitter&labelColor=EEEEEE)](https://twitter.com/Bytebase)

<img width="256" src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/wechat-qrcode.webp" alt="sqlchat">

## 赞助商

<p>
  <a href="https://www.bytebase.com">
    <img src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/bytebase.webp" width=300>
  </a>
</p>

## 许可

本项目使用 BSL 许可证。请参阅 [LICENSE](LICENSE) 文件以获取完整的许可文本。

## 常见问题

<details><summary>如何自托管 SQL Chat?</summary>
<p>

- 您可以一键将 `SQL Chat` 部署到 `Vercel`

  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY"><img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel"></a>

- 您可以在几秒钟内使用 `Docker` 部署 `SQL Chat`

  ```bash
  docker run --name sqlchat --platform linux/amd64 -p 3000:3000 sqlchat/sqlchat
  ```

</p>
</details>

<details><summary>如何使用我的 OpenAI API 密钥？</summary>
<p>

- 您可以在环境变量中设置 `OPENAI_API_KEY`。

  ```bash
  docker run --name sqlchat --platform linux/amd64 --env OPENAI_API_KEY=xxx -p 3000:3000 sqlchat/sqlchat
  ```

- 您可以在设置对话框中设置 `OPENAI_API_KEY`。

</p>
</details>

<details><summary>它总是说我有网络连接问题？</summary>
<p>

![network error](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-network.webp)

请确保您有一个稳定的网络连接，可以访问 OpenAI API 端点。

```bash
ping api.openai.com
```

如果您无法访问 OpenAI API 端点，您可以尝试在 UI 或环境变量中设置 `OPENAI_API_ENDPOINT`。

</p>
</details>

<details><summary>You exceeded your current quota, please check your plan and billing details</summary>
<p>

![openai quota](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-exceed-openai-quota.webp)

这个表示你自己提供的 OpenAI Key 的 Quota 没有了。请查看自己的 [OpenAI 账号](https://platform.openai.com/account/api-keys)。

</p>
</details>
