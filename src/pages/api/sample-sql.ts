// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { statement, query } = req.body;

    try {
      const sample_sql = await prisma.sampleSql.create({
        data: {
          sql: statement,
          table: "",
          query: query,
        },
      });

      res.status(200).json(sample_sql);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }
  if (req.method == "GET") {
    const { query } = req.query;
    try {
      const sample_sql = await prisma.sampleSql.findFirst({ where: { query: query.toString() } });

      res.status(200).json(sample_sql);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }
};
