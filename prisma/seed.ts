import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient()

const chatData: Prisma.ChatCreateInput[] = [
  {
    id: uuidv4(),
    createdAt: new Date(),
    ctx: {},
    prompts: {
      create: [
        {
          id: uuidv4(),
          createdAt: new Date(),
          q: "Hello",
          a: "What can I help you with today?",
          upvote: true,
          downvote: false,
        },
        {
          id: uuidv4(),
          createdAt: new Date(),
          q: "How are you?",
          a: "Fine, thank you, and you?",
          upvote: true,
          downvote: false,
        },
      ],
    },
  },
  {
    id: uuidv4(),
    createdAt: new Date(),
    ctx: {},
    prompts: {
      create: [
        {
          id: uuidv4(),
          createdAt: new Date(),
          q: "Tell me a joke",
          a: "What do you call a fake noodle? An Impasta.",
          upvote: true,
          downvote: false,
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const c of chatData) {
    const chat = await prisma.chat.create({
      data: c,
    })
    console.log(`Created chat with id: ${chat.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
