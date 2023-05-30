import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Conversation, Message } from "@/types";
import { getModel } from "@/utils";
import { getEndUser } from "./auth/end-user";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json([]);
  }
  const conversation = req.body.conversation as Conversation;
  const messages = req.body.messages as Message[];
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: conversation.id,
      },
    });
    const endUser = await getEndUser(req, res);
    if (chat) {
      await prisma.message.createMany({
        data: messages.map((message) => ({
          chatId: chat.id,
          createdAt: new Date(message.createdAt),
          endUser: endUser,
          role: message.creatorRole,
          content: message.content,
          upvote: false,
          downvote: false,
        })),
      });
    } else {
      await prisma.chat.create({
        data: {
          id: conversation.id,
          createdAt: new Date(conversation.createdAt),
          model: getModel((req.headers["x-openai-model"] as string) || ""),
          ctx: {},
          messages: {
            create: messages.map((message) => ({
              createdAt: new Date(message.createdAt),
              endUser: endUser,
              role: message.creatorRole,
              content: message.content,
              upvote: false,
              downvote: false,
            })),
          },
        },
      });
    }
  } catch (err) {
    console.error(err);
  }

  res.status(200).json(true);
}
