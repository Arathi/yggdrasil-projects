import { v4 as nextUUID } from "uuid";
import JWT, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_KEY = "yggt";
const ISSUER = "Yggdrasil-Auth";

export interface AccessToken {
  /**
   * Token ID
   */
  id: string;

  /**
   * 用户ID
   */
  userId: string;

  /**
   * 档案ID
   */
  profileId: string;

  /**
   * 签发人
   */
  issuer: string;

  /**
   * 过期时间
   */
  expiredAt: number;

  /**
   * 签发时间
   */
  issueAt: number;
}

export interface Payload extends JwtPayload {
  /**
   * user.id
   */
  sub?: string | undefined;

  /**
   * token
   */
  yggt?: string | undefined;

  /**
   * profile.id
   */
  spr?: string | undefined;

  /**
   * 签发人，固定为Yggdrasil-Auth
   */
  iss?: string | undefined;

  /**
   * 过期时间（秒时间戳）
   */
  exp?: number | undefined;

  /**
   * 签发时间（秒时间戳）
   */
  iat?: number | undefined;
}

export default class TokenService {
  async generateClientToken(): Promise<string> {
    return nextUUID();
  }

  async generateAccessToken(
    userId: string,
    profileId: string,
    id?: string,
    issueAt?: number,
    expiredAt?: number
  ): Promise<string> {
    const now = new Date().valueOf() / 1000;
    const payload: Payload = {
      sub: userId,
      yggt: id ?? nextUUID(),
      spr: profileId,
      iss: ISSUER,
      exp: expiredAt ?? now + 7200,
      iat: issueAt ?? now,
    };
    const options = {};
    return JWT.sign(payload, ACCESS_TOKEN_KEY, options);
  }

  async parseAccessToken(jwt: string): Promise<AccessToken | null> {
    const payload = JWT.decode(jwt);
    if (payload === null) {
      return null;
    } else if (typeof payload === "string") {
      return null;
    }

    const now = new Date().valueOf() / 1000;

    const {
      sub: userId,
      yggt: id,
      spr: profileId,
      iss: issuer = ISSUER,
      exp: expiredAt = now + 7200,
      iat: issueAt = now,
    } = payload;

    if (userId === undefined || id === undefined || profileId === undefined) {
      return null;
    }

    return {
      id,
      userId,
      profileId,
      issuer,
      expiredAt,
      issueAt,
    };
  }

  async refresh() {
    //
  }
}
