import User from "@/domains/user";
import { v4 as nextUUID } from "uuid";

export default class UserService {
  async generate(userName: string, password: string): Promise<User> {
    const user = {
      id: nextUUID(),
      name: userName,
      password: password,
    };
    // TODO 入库
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return null;
  }

  async findByUserName(userName: string): Promise<User | null> {
    return null;
  }
}
