![SQL Chat banner](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/banner.webp)

<div align="center">
  <h3>SQL Chat</h3>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY"><img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel"></a>
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

SQL Chat is built by Next.js, it supports the following databases and will add more over time:

- MySQL
- PostgreSQL
- MSSQL

## Data Privacy

- All database connection configs are stored locally in your browser. You can also visit settings to
  clear the data.

- Only the database schema will be sent to the OpenAI API. No table data will be sent there.

## Local Development

1. Make a copy of the example environment variables file;

   ```bash
   cp .env.example .env
   ```

2. Add your [API key](https://platform.openai.com/account/api-keys) and OpenAI API Endpoint(optional) to the newly created `.env` file;

3. Install dependencies and start the dev server;

   ```bash
   pnpm i && pnpm dev
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
