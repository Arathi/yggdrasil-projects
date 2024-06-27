import { v4 as nextUUID } from "uuid";
import Profile from "@/domains/profile";

export default class ProfileService {
  async generate(name: string, userId: string): Promise<Profile> {
    return {
      id: nextUUID(),
      userId,
      name,
    };
  }

  async save(profile: Profile) {}
  async findByUserId(userId: string): Promise<Array<Profile>> {
    return [];
  }
}
