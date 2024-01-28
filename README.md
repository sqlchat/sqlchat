![SQL Chat banner](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/banner.webp)

<div align="center">
  <h3>SQL Chat</h3>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY">
    <img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel">
  </a>
  <p>English | <a href="README.zh-CN.md">中文</a> | <a href="README.es-ES.md">Español</a></p>
</div>

## What

SQL Chat is a chat-based SQL client, which uses natural language to communicate with the database to implement operations such as query, modification, addition, and deletion of the database.

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot1.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot2.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot3.webp)

## Why

As we enter the [Developer Tools 2.0 era](https://www.sequoiacap.com/article/ai-powered-developer-tools/),
there is a massive opportunity to rebuild the existing tools using the chat-based interface. SQL Client
is no exception. Instead of navigating across many UI controls, a chat-based interface is much
more intuitive. Of course, only if that works, and our goal is to deliver that experience.

## How

SQL Chat is built by [Next.js](https://nextjs.org/), it supports the following databases and will add more over time:

- MySQL
- PostgreSQL
- MSSQL
- TiDB Cloud

## [sqlchat.ai](https://sqlchat.ai)

### IP Whitelisting

If you use [sqlchat.ai](https://sqlchat.ai) to connect to your database, you need to add 0.0.0.0 (allow all connections)
to the database whitelist IP. Because sqlchat.AI is hosted on [Vercel](https://vercel.com/) which [uses dynamic IP](https://vercel.com/guides/how-to-allowlist-deployment-ip-address). If this is a concern, please consider the self-host option below.

### Data Privacy

See [SQL Chat Privacy Policy](https://sqlchat.ai/privacy).

## Self-host

### Docker

If you just want to run for your own use, supply the following options:

- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`

```bash
docker run --name sqlchat --platform linux/amd64 --env NEXTAUTH_SECRET="$(openssl rand -hex 5)" --env OPENAI_API_KEY=<<YOUR OPENAI KEY>> -p 3000:3000 --hostname localhost sqlchat/sqlchat
```

- Pass an arbitrary string to NEXTAUTH_SECRET otherwise next-auth will complain.
- If you chat to the database on the same host, you need to use `host.docker.internal` as the host in
  the database connection setting.

<img src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/docs/docker-connection-setting.webp" />

## Startup options

## TL;DR

- If you just want to use for yourself, then run without database. Check [.env.nodb](https://github.com/sqlchat/sqlchat/blob/main/.env.nodb).
- If you want to offer a similar service as [sqlchat.ai](https://sqlchat.ai), then run with database, check [.env.usedb](https://github.com/sqlchat/sqlchat/blob/main/.env.usedb). The database is used to store account, usage info.

### OpenAI related

- `OPENAI_API_KEY`: OpenAI API key. You can get one from [here](https://platform.openai.com/api-keys).

- `OPENAI_API_ENDPOINT`: OpenAI API endpoint. Defaults to `https://api.openai.com`.

- `NEXT_PUBLIC_ALLOW_SELF_OPENAI_KEY`: Set to `true` to allow users to bring their own OpenAI API key.

### Database related

- `NEXT_PUBLIC_USE_DATABASE`: Set to `true` to start SQL Chat with database. This will
  enable following features:
  1. Account system.
  1. Per-user quota enforcement.
  1. Payment.
  1. Usage data collection.
- `DATABASE_URL`: Applicable if `NEXT_PUBLIC_USE_DATABASE` is `true`. Postgres connection string to store data. e.g. `postgresql://postgres:YOUR_PASSWORD@localhost:5432/sqlchat?schema=sqlchat`.

## Local Development

1. Install dependencies

   ```bash
   pnpm i
   ```

1. Generate prisma client

   ```bash
   pnpm prisma generate
   ```

1. Make a copy of the example environment variables file:

   ```bash
   cp .env.usedb .env
   ```

1. Add your [API key](https://platform.openai.com/account/api-keys) and OpenAI API Endpoint(optional) to the newly created `.env` file.

### Setup database

**You can skip this section with `NEXT_PUBLIC_USE_DATABASE=false` if you don't build features requiring database**

1. Start a Postgres instance. For mac, you can use [StackbBricks](https://stackbricks.app/), [DBngin](https://dbngin.com/) or [Postgres.app](https://postgresapp.com/).

1. Create a database:

   ```sql
   CREATE DATABASE sqlchat;
   ```

   In `.env` file, assign the connection string to environment variable `DATABASE_URL` and `DATABASE_DIRECT_URL`. [This article](https://www.prisma.io/docs/data-platform/data-proxy/prisma-cli-with-data-proxy#set-a-direct-database-connection-url-in-your-prisma-schema) explains why we need two URLs.

1. Set up database schema

   ```bash
   pnpm prisma migrate dev
   ```

1. (Optional) Seed data

   ```bash
   pnpm prisma db seed
   ```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sqlchat/sqlchat&type=Date)](https://star-history.com/#sqlchat/sqlchat&Date)

## Community

[![Hang out on Discord](https://img.shields.io/badge/%20-Hang%20out%20on%20Discord-5865F2?style=for-the-badge&logo=discord&labelColor=EEEEEE)](https://discord.gg/z6kakemDjm)

[![Follow us on Twitter](https://img.shields.io/badge/Follow%20us%20on%20Twitter-1DA1F2?style=for-the-badge&logo=twitter&labelColor=EEEEEE)](https://twitter.com/Bytebase)

<img width="256" src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/wechat-qrcode.webp" alt="sqlchat">

## Sponsors

<p>
  <a href="https://www.bytebase.com">
    <img src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/bytebase.webp" width=300>
  </a>
</p>

## License

This project is under the BSL License. See the [LICENSE](LICENSE) file for the full license text.

## Common Error Message

<details><summary>Please sign up to get free quota</summary>
<p>

See [this issue](https://github.com/sqlchat/sqlchat/issues/141).

</p>
</details>

<details><summary>You exceeded your current quota, please check your plan and billing details</summary>
<p>

![openai quota](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-exceed-openai-quota.webp)

Your OpenAI Key has run out of quota. Please check your [OpenAI account](https://platform.openai.com/account/api-keys).

</p>
</details>

<details><summary>Failed to request message, please check your network</summary>
<p>

![network error](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-network.webp)

Please make sure you have a stable network connection which can access the OpenAI API endpoint.

```bash
ping api.openai.com
```

If you cannot access the OpenAI API endpoint, you can try to set the `OPENAI_API_ENDPOINT` in UI or environment variable.

</p>
</details>
