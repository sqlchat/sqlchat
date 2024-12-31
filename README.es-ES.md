![SQL Chat banner](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/banner.webp)

<div align="center">
  <h3>SQL Chat</h3>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY">
    <img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel">
  </a>
  <p><a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a> | Español</p>
</div>

## ¿Que es?

SQL Chat es un cliente SQL basado en chat, que utiliza lenguaje natural para comunicarse con la base de datos y realizar operaciones como consultas, modificaciones, adiciones y eliminaciones de datos en la base de datos.

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot1.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot2.webp)

![Screenshot](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/screenshot3.webp)

## ¿Por que?

A medida que entramos en la [Era de las Herramientas de Desarrollo 2.0](https://www.sequoiacap.com/article/ai-powered-developer-tools/),
existe una gran oportunidad para reconstruir las herramientas existentes utilizando una interfaz basada en chat. El cliente SQL
no es una excepción. En lugar de navegar a través de varias interfaces de usuario, una interfaz basada en chat es
más intuitiva. Por supuesto, solo si funciona, y nuestro objetivo es ofrecer esa experiencia.

## ¿Como?

SQL Chat esta construido en [Next.js](https://nextjs.org/), admite las siguientes bases de datos y agregará más con el tiempo:

- MySQL
- PostgreSQL
- MSSQL
- TiDB Cloud

## Privacidad de la Data

Vea la [Política de Privacidad de SQL Chat](https://sqlchat.ai/privacy).

## IP Whitelisting

Si usas [sqlchat.ai](https://sqlchat.ai) para conectarte a tu base de datos, debes agregar 0.0.0.0 (permitir todas las conexiones) a la IP de la lista blanca de la base de datos. Porque sqlchat.AI está alojado en
[Vercel](https://vercel.com/) el cual [usa IP dinámica](https://vercel.com/guides/how-to-allowlist-deployment-ip-address). Si esto le preocupa, considere la opción de hospedaje propio a continuación.

## Hospedaje propio con Docker

```bash
docker run --name sqlchat --platform linux/amd64 -env NEXTAUTH_SECRET=xxx -p 3000:3000 sqlchat/sqlchat
```

### Variables relacionadas con OpenAI:

- `NEXT_PUBLIC_ALLOW_SELF_OPENAI_KEY`: Establezca en "verdadero" para permitir a los usuarios traer su propia clave API de OpenAI.

- `OPENAI_API_KEY`: Clave API de OpenAI. Puedes conseguir una [aquí](https://beta.openai.com/docs/developer-quickstart/api-keys).

- `OPENAI_API_ENDPOINT`: Endpoint de la API de OpenAI. El predeterminado es `https://api.openai.com`.

### Variables relacionadas con la base de datos:

- `NEXT_PUBLIC_USE_DATABASE`: Establézcalo en `false` para iniciar SQL Chat en modo sin base de datos. Esto
  desactivara las siguientes funciones:
  1. Sistema de cuentas.
  2. Ejecución de Cuota por Usuario.
  3. Pago.
  4. Recopilación de datos de uso.
- `DATABASE_URL`: Aplicable si `NEXT_PUBLIC_USE_DATABASE` es `true`. Cadena de conexión de Postgres para almacenar datos. ej. `postgresql://postgres:YOUR_PASSWORD@localhost:5432/sqlchat?schema=sqlchat`.

```bash
docker run --name sqlchat --platform linux/amd64 --env NEXTAUTH_SECRET=xxx --env OPENAI_API_KEY=yyy --env OPENAI_API_ENDPOINT=zzz -p 3000:3000 sqlchat/sqlchat
```

## Desarrollo Local

1. Instala las dependencias

   ```bash
   pnpm i
   ```

1. Haga una copia del archivo de variables de entorno de ejemplo:

   ```bash
   cp .env.usedb .env
   ```

1. Generar el cliente prisma a partir del modelo.

   ```bash
   pnpm prisma generate
   ```

1. Añade tu [clave de API](https://platform.openai.com/account/api-keys) y el endpoint del API de OpenAI(opcional) al recién creado archivo `.env`.

### Configura la base de datos

**Puede omitir esta sección con `NEXT_PUBLIC_USE_DATABASE=false` si no crea funciones que requieren una base de datos**

1. Inicie una instancia de Postgres. Para mac, puedes usar [StackbBricks](https://stackbricks.app/), [DBngin](https://dbngin.com/) o [Postgres.app](https://postgresapp.com/).

1. Crea una base de datos:

   ```sql
   CREATE DATABASE sqlchat;
   ```

   En el archivo `.env`, asigna la cadena de conexión a la variable de entorno `DATABASE_URL` y `DATABASE_DIRECT_URL`. [Este articulo](https://www.prisma.io/docs/data-platform/data-proxy/prisma-cli-with-data-proxy#set-a-direct-database-connection-url-in-your-prisma-schema) explica por qué necesitamos dos URL.

1. Migrar esquema

   ```bash
   pnpm prisma migrate dev
   ```

1. (Opcional) Seed data

   ```bash
   pnpm prisma db seed
   ```

## Historial de Estrellas

[![Gráfica Historial de Estrellas](https://api.star-history.com/svg?repos=sqlchat/sqlchat&type=Date)](https://star-history.com/#sqlchat/sqlchat&Date)

## Comunidad

[![Únete a nuestro Discord](https://img.shields.io/badge/%20-Hang%20out%20on%20Discord-5865F2?style=for-the-badge&logo=discord&labelColor=EEEEEE)](https://discord.gg/z6kakemDjm)

[![Síguenos en Twitter](https://img.shields.io/badge/Follow%20us%20on%20Twitter-1DA1F2?style=for-the-badge&logo=twitter&labelColor=EEEEEE)](https://twitter.com/Bytebase)

<img width="256" src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/wechat-qrcode.webp" alt="sqlchat">

## Patrocinadores

<p>
  <a href="https://www.bytebase.com">
    <img src="https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/bytebase.webp" width=300>
  </a>
</p>

## Licencia

Este proyecto está bajo la Licencia BSL. Consulte el archivo [LICENSE](LICENSE) para obtener el texto completo de la licencia.

## FAQ

<details><summary>¿Cómo Hospedar mi propio SQL Chat?</summary>
<p>

- Puede implementar SQL Chat en Vercel con un solo clic

  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsqlchat%2Fsqlchat&env=OPENAI_API_KEY"><img src="https://img.shields.io/badge/deploy%20on-Vercel-brightgreen.svg?style=for-the-badge&logo=vercel" alt="vercel"></a>

- Puede implementar su SQL Chat con docker en segundos

  ```bash
  docker run --name sqlchat --platform linux/amd64 -p 3000:3000 sqlchat/sqlchat
  ```

</p>
</details>

<details><summary>¿Cómo usar mi clave API de OpenAI?</summary>
<p>

- Puede configurar la `OPENAI_API_KEY` como una variable de entorno.

  ```bash
  docker run --name sqlchat --platform linux/amd64 --env OPENAI_API_KEY=xxx -p 3000:3000 sqlchat/sqlchat
  ```

- Puede configurar la `OPENAI_API_KEY` en el cuadro de diálogo de la configuración.

</p>
</details>

<details><summary>¿Siempre dice que tengo un problema de conexión de red?</summary>
<p>

Asegúrese de tener una conexión de red estable que pueda acceder al endpoint de la API de OpenAI.

```bash
ping api.openai.com
```

Si no puede acceder al endpoint de la API de OpenAI, puede intentar configurar el `OPENAI_API_ENDPOINT` en la UI o como una variable de entorno.

</p>
</details>

<details><summary>You exceeded your current quota, please check your plan and billing details</summary>
<p>

![openai quota](https://raw.githubusercontent.com/sqlchat/sqlchat/main/public/error-exceed-openai-quota.webp)

Su clave OpenAI se ha quedado sin cuota. Por favor revise su [cuenta de OpenAI ](https://platform.openai.com/account/api-keys).

</p>
</details>
