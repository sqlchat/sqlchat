declare namespace NodeJS {
  export interface ProcessEnv {
    // Required. Node environment.
    NODE_ENV: string;
    // Required. Postgres database connection string to store the data.
    // e.g. postgresql://postgres:YOUR_PASSWORD@localhost:5432/sqlchat?schema=sqlchat
    DATABASE_URL: string;
    // Required. Do not share your OpenAI API key with anyone! It should remain a secret.
    OPENAI_API_KEY: string;
    // Optional. OpenAI API endpoint. Defaults to https://api.openai.com.
    OPENAI_API_ENDPOINT: string;
    // Optional. NextAuth.js URL. Defaults to the current domain.
    NEXTAUTH_URL: string;
    // Optional. NextAuth.js secret. Defaults to a randomly generated string.
    NEXTAUTH_SECRET: string;
    // Optional. NextAuth.js GitHub OAuth client ID.
    GITHUB_ID: string;
    // Optional. NextAuth.js GitHub OAuth client secret.
    GITHUB_SECRET: string;
    // Optional. NextAuth.js Google OAuth client ID.
    GOOGLE_CLIENT_ID: string;
    // Optional. NextAuth.js Google OAuth client secret.
    GOOGLE_CLIENT_SECRET: string;
    // Optional. NextAuth.js email server.
    // This can't be tested locally. Must be deployed to the web to send mail.
    EMAIL_SERVER: string;
    // Optional. Stripe publishable key.
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    // Optional. Stripe API key.
    STRIPE_API_KEY: string;
    // Optional. Stripe webhook secret.
    STRIPE_WEBHOOK_SECRET: string;
    // Optional. Stripe price id for Pro plan 1 year subscription.
    STRIPE_PRICE_ID_PRO_1_YEAR_SUBSCRIPTION: string;
  }
}
