![SQL Chat banner](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/banner.webp)

<div align="center">
  <h3>SQL Chat</h3>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY">
    <img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel">
  </a>
  <p>English | <a href="README.zh-CN.md">中文</a></p>
</div>

## What

SQL Chat is a chat-based SQL client to ask database questions and query databases using natural language.

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot1.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot2.webp)

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

## Data Privacy

- All database connection configs are stored locally in your browser. You can also visit settings to clear the data.

- Only the database schema will be sent to the OpenAI API. No table data will be sent there.

- If you use [sqlchat.ai](https://sqlchat.ai), it will record the anonymised conversations.

## IP Whitelisting

If you use [sqlchat.ai](https://sqlchat.ai) to connect to your database, you need to add 0.0.0.0 (allow all connections)
to the database whitelist IP. Because sqlchat.AI is hosted on [Vercel](https://vercel.com/) which [uses dynamic IP](https://vercel.com/guides/how-to-allowlist-deployment-ip-address). If this is a concern, please consider the self-host option below.

## Self-host with Docker

```bash
docker run --name sqlchat --platform linux/amd64 -p 3000:3000 sqlchat/sqlchat
```

You can set the following environment variables to customize the deployment:

- `OPENAI_API_KEY`: OpenAI API key. You can get one from [here](https://beta.openai.com/docs/developer-quickstart/api-keys).
- `OPENAI_API_ENDPOINT`: OpenAI API endpoint. Defaults to `https://api.openai.com`.

```bash
docker run --name sqlchat --platform linux/amd64 --env OPENAI_API_KEY=xxx --env OPENAI_API_ENDPOINT=yyy -p 3000:3000 sqlchat/sqlchat
```

## Local Development

1. Make a copy of the example environment variables file:

    ```bash
    cp .env.example .env
    ```

1. Add your [API key](https://platform.openai.com/account/api-keys) and OpenAI API Endpoint(optional) to the newly created `.env` file.

1. Start a Postgres instance. For mac, you can use [StackbBricks](https://stackbricks.app/), [DBngin](https://dbngin.com/) or [Postgres.app](https://postgresapp.com/). Create a database:

    ```sql
    CREATE DATABASE sqlchat;
    ```
    In `.env` file, assign the connection string to `DATABASE_URL`.

1. Install dependencies

    ```bash
    pnpm i
    ```

1. Generate schema

    1. Generate prisma client from the model

        ```bash
        pnpm prisma generate
        ```

    1. Migrate schema

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

## FAQ

<details><summary>How to self host SQL Chat?</summary>
<p>

- You can deploy SQL Chat to Vercel with one click

  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY"><img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel"></a>

- You can deploy your SQL Chat with docker in seconds

  ```bash
  docker run --name sqlchat --platform linux/amd64 -p 3000:3000 sqlchat/sqlchat
  ```

</p>
</details>

<details><summary>How to use my OpenAI API key?</summary>
<p>

- You can set the `OPENAI_API_KEY` in environment variable.

  ```bash
  docker run --name sqlchat --platform linux/amd64 --env OPENAI_API_KEY=xxx -p 3000:3000 sqlchat/sqlchat
  ```

- You can set the `OPENAI_API_KEY` in setting dialog.

</p>
</details>

<details><summary>It always says that I have a network connection issue?</summary>
<p>

Please make sure you have a stable network connection which can access the OpenAI API endpoint. If you cannot access the OpenAI API endpoint, you can try to set the `OPENAI_API_ENDPOINT` in UI or environment variable.

</p>
</details>
