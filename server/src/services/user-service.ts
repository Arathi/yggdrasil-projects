import { PrismaClient, Profile, User } from "@prisma/client";
import BCrypt from "bcrypt";
import { Property } from "@/domains/yggdrasil/user";
import { getLogger } from "@/utils/logger";

const logger = getLogger("user-svc");

const Rounds = 10;

export default class UserService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    email: string,
    name: string,
    password: string,
    language?: string
  ) {
    const salt = await BCrypt.genSalt(Rounds);
    const bcryptPassword = await BCrypt.hash(password, salt);
    return this.prisma.user.create({
      data: {
        email,
        password: bcryptPassword,
        language,
        profiles: {
          create: [
            {
              name,
            },
          ],
        },
      },
      include: {
        profiles: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profiles: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profiles: true,
      },
    });
  }

  async updateProfileId(profile: Profile) {
    this.updateProfileIdById(profile.userId, profile.id);
  }

  async updateProfileIdById(userId: string, profileId: string) {
    logger.info(`正在更新用户 ${userId} 的 profileId 为 ${profileId}`);
    this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileId: profileId,
      },
    });
  }

  getProperties(user: User): Property[] {
    const properties: Property[] = [];

    if (user.language !== null) {
      properties.push({
        name: "preferredLanguage",
        value: user.language,
      });
    }

    if (user.country !== null) {
      properties.push({
        name: "registrationCountry",
        value: user.country,
      });
    }

    return properties;
  }
}
