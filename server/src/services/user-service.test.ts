import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import UserService from "./user-service";

const prisma = new PrismaClient();
const svc = new UserService(prisma);

test("生成用户", async () => {
  console.info(`开始测试生成用户 ...`);
  const email = faker.internet.email();
  const name = faker.internet.userName();
  const password = faker.internet.password();
  const user = await svc.create(email, name, password, "zh_CN");
  console.info(`创建用户：${user.id} ${user.email}`);
});
