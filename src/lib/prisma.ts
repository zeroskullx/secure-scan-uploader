import {PrismaClient} from "@prisma/client";

//print all queries in development on terminal
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "dev" ? ["query"] : [],
});
