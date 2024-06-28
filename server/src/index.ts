import { program } from "commander";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app";
import { getLogger } from "./utils/logger";
import pkg from "../package.json";

const logger = getLogger("main");

program
  .name("yggdrasil-server")
  .description("Yggdrasil服务端")
  .version(pkg.version);
program.option("-p, --port <value>", "端口", "3000");
program.parse();

const prisma = new PrismaClient();

async function main() {
  const { port = 3000 } = program.opts();
  const app = createApp(prisma);
  app.listen(port);
  logger.info(`正在监听端口：${port}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error("出现异常：");
    logger.error(e);
    await prisma.$disconnect();
  });
