import { v4 as nextUUID } from "uuid";
import JWT from "jsonwebtoken";

const ACCESS_TOKEN_KEY = "yggt";

export interface AccessTokenPayload {
  userId: string;
  profileId: string;
}

export default class TokenService {
  async generateClientToken(): Promise<string> {
    return nextUUID();
  }

  async generateAccessToken(): Promise<string> {
    const payload = {};
    const options = {};
    return JWT.sign(payload, ACCESS_TOKEN_KEY, options);
  }

  async parseAccessToken(jwt: string): Promise<AccessTokenPayload | null> {
    const payload = JWT.decode(jwt);
    if (payload === null) {
      return null;
    } else if (typeof payload === "string") {
      return null;
    }

    const { iss: userId } = payload;

    if (userId === undefined) {
      return null;
    }

    return {
      userId,
      profileId: payload.sup,
    };
  }
}
