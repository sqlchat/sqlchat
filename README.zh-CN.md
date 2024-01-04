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

## [sqlchat.ai](https://sqlchat.ai)

## IP 白名单

如果使用 [sqlchat.ai](https://sqlchat.ai) 连接数据库，则需要在数据库白名单 I P 中添加 0.0.0.0(允许所有连接)。因为 sqlchat.ai 托管在 [Vercel](https://vercel.com/) 上 [使用动态 IP](https://vercel.com/guides/how-to-allowlist-deployment-ip-address)。如果这是一个问题，请考虑下面的自主机选项。

## 数据保密

参阅 [SQL Chat 隐私政策](https://sqlchat.ai/privacy).

## 自托管

### Docker

如果是自用，启动时提供下面两个参数即可：

- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`

```bash
docker run --name sqlchat --platform linux/amd64 --env NEXTAUTH_SECRET="$(openssl rand -hex 5)" --env OPENAI_API_KEY=<<YOUR OPENAI KEY>> -p 3000:3000 --hostname localhost sqlchat/sqlchat
```

- 传一个任意值给 NEXTAUTH_SECRET 否则 next-auth 会抱怨。
- 如果您连接同一个 host 上的数据库，在数据库连接配置中，需要使用 `host.docker.internal` 作为 host。

<img src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/docs/docker-connection-setting.webp" />

## 启动参数

## TL;DR

- 如果是自用，选择不需要数据库的配置，参阅 [.env.nodb](https://github.com/sqlchat/sqlchat/blob/main/.env.nodb).
- 如果是希望提供类似于 [sqlchat.ai](https://sqlchat.ai) 的服务供多人使用, 那么需要数据库，参阅 [.env.usedb](https://github.com/sqlchat/sqlchat/blob/main/.env.usedb)。数据库用来保存用户以及使用信息。

### OpenAI 相关

- `OPENAI_API_KEY`: OpenAI API key. 您能从 [这里](https://beta.openai.com/docs/developer-quickstart/api-keys) 获得。

- `OPENAI_API_ENDPOINT`: OpenAI API endpoint. 默认 `https://api.openai.com`。

- `NEXT_PUBLIC_ALLOW_SELF_OPENAI_KEY`: 置为 `true` 以允许 SQL Chat 服务的用户使用自己的 key。

### 数据库相关

- `NEXT_PUBLIC_USE_DATABASE`: 置为 `true` 使得 SQL Chat 启动时使用数据库，这会开启如下功能：
  1. 账号系统。
  1. 用户额度。
  1. 支付。
  1. 使用数据收集。
- `DATABASE_URL`: 当 `NEXT_PUBLIC_USE_DATABASE` 是 `true` 时有效。用于保存数据的 Postgres 连接串 e.g. `postgresql://postgres:YOUR_PASSWORD@localhost:5432/sqlchat?schema=sqlchat`.

## 本地开发环境

1. 安装依赖项

   ```bash
   pnpm i
   ```

1. 生成 `prisma` 客户端

   ```bash
   pnpm prisma generate
   ```

1. 复制示例环境变量文件;

   ```bash
   cp .env.usedb .env
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

## 常见错误信息

<details><summary>sign up to get quota when self-hosted </summary>
<p>

看这个 [issue](https://github.com/sqlchat/sqlchat/issues/141).

</p>
</details>


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

<details><summary>You exceeded your current quota, please check your plan and billing details</summary>
<p>

![openai quota](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-exceed-openai-quota.webp)

这个表示你自己提供的 OpenAI Key 的 Quota 没有了。请查看自己的 [OpenAI 账号](https://platform.openai.com/account/api-keys)。

</p>
</details>


<details><summary>Failed to request message, please check your network</summary>
<p>

![network error](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-network.webp)

请确保您有一个稳定的网络连接，可以访问 OpenAI API 端点。

```bash
ping api.openai.com
```

如果您无法访问 OpenAI API 端点，您可以尝试在 UI 或环境变量中设置 `OPENAI_API_ENDPOINT`。

</p>
</details>
