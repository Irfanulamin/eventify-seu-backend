import dotenv from "dotenv";
dotenv.config();

import serverless from "serverless-http";
import connectDB from "./config/db";
import app from "./app";

let isDbConnected = false;

const handler = async (req: any, res: any, next: any) => {
  try {
    if (!isDbConnected) {
      await connectDB();
      isDbConnected = true;
    }
    next();
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const server = serverless(app);

export default async function (req: any, res: any) {
  await handler(req, res, async () => {
    await server(req, res);
  });
}
