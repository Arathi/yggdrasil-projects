import { program } from "commander";
import pkg from "../package.json";
import { createApp } from "./app";

program
  .name("yggdrasil-server")
  .description("Yggdrasil服务端")
  .version(pkg.version);

program.option("-p, --port <value>", "端口", "3000");

program.parse();

const { port = 3000 } = program.opts();

const app = createApp();
app.listen(port);
console.info(`正在监听端口：${port}`);
