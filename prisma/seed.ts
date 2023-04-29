import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const chatData: Prisma.ChatCreateInput[] = [
  {
    id: uuidv4(),
    createdAt: new Date(),
    ctx: {},
    messages: {
      create: [
        {
          id: uuidv4(),
          createdAt: new Date(),
          role: "system",
          content: "You are a bot",
          upvote: true,
          downvote: false,
        },
        {
          id: uuidv4(),
          createdAt: new Date(),
          role: "user",
          content: "What can I help you with today?",
          upvote: true,
          downvote: false,
        },
        {
          id: uuidv4(),
          createdAt: new Date(),
          role: "assistant",
          content: "Hello",
          upvote: true,
          downvote: false,
        },
      ],
    },
  },
];

const principalData: Prisma.PrincipalCreateInput[] = [
  {
    createdAt: new Date(),
    type: "BOT",
    status: "ACTIVE",
    name: "sqlchat",
    display_name: "SQL Chatbot",
    email: "sqlchat@example.com",
    email_verified: true,
    password_hash: "abcde",
  },
  {
    createdAt: new Date(),
    type: "END_USER",
    status: "ACTIVE",
    name: "alice",
    display_name: "Alice PG",
    email: "alice@example.com",
    email_verified: true,
    password_hash: "abcde",
  },
  {
    createdAt: new Date(),
    type: "END_USER",
    status: "ACTIVE",
    name: "bob",
    display_name: "Bob MySQL",
    email: "bob@example.com",
    email_verified: true,
    password_hash: "abcde",
  },
  {
    createdAt: new Date(),
    type: "END_USER",
    status: "BLOCKED",
    name: "mallory",
    display_name: "Mallory Oracle",
    email: "mallory@example.com",
    email_verified: true,
    password_hash: "abcde",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const c of chatData) {
    const chat = await prisma.chat.create({
      data: c,
    });
    console.log(`Created chat with id: ${chat.id}`);
  }

  for (const p of principalData) {
    const principal = await prisma.principal.create({
      data: p,
    });
    console.log(`Created principal with id: ${principal.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
