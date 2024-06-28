import { PrismaClient } from "@prisma/client";

export default class ProfileService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generate(userId: string, name: string) {
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        name,
      },
    });
    return profile;
  }

  async findById(id: string) {
    return await this.prisma.profile.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.profile.findMany({
      where: {
        userId,
      },
    });
  }
}
