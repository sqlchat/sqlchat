import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Conversation, Message } from "@/types";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json([]);
  }

  const conversation = req.body.conversation as Conversation;
  const messages = req.body.messages as Message[];
  try {
    await prisma.chat.create({
      data: {
        id: conversation.id,
        createdAt: new Date(conversation.createdAt),
        ctx: {},
        messages: {
          create: messages.map((message) => ({
            id: message.id,
            createdAt: new Date(message.createdAt),
            role: message.creatorRole,
            content: message.content,
            upvote: true,
            downvote: false,
          })),
        },
      },
    });
  } catch (err) {
    console.error(err);
  }

  res.status(200).json(true);
}
