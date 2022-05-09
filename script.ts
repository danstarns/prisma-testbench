import { PrismaClient } from "@prisma/client";
import * as util from "util";

const sleep = util.promisify(setTimeout);

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

// A `main` function so that you can use async/await
async function main() {
  prisma.$on("info", (data) => {
    console.log(data);
    if (/Started query engine/.test(data.message)) {
      const words = data.message.split(" ");
      const url = words[words.length - 1];

      console.log(words, url);
    }
  });

  await prisma.$connect();

  await sleep(10000);

  console.log("findMany");

  await prisma.user.findMany();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
