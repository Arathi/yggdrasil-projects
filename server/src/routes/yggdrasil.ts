import Router from "@koa/router";
import { AppContext, AppState } from "@/app";
import {
  AuthenticateRequest,
  AuthenticateResponse,
} from "@/domains/yggdrasil/authenticate";
import ErrorResponse from "@/domains/yggdrasil/error";
import Profile from "@/domains/yggdrasil/profile";
import { RefreshRequest, RefreshResponse } from "@/domains/yggdrasil/refresh";
import { getLogger } from "@/utils/logger";

const logger = getLogger("yggdrasil-router");

const router = new Router<AppState, AppContext>();

router.post("/authserver/authenticate", async (ctx) => {
  const { userSvc, tokenSvc, profileSvc } = ctx;
  const reqBody = ctx.request.body as AuthenticateRequest;

  const user = await userSvc.findByEmail(reqBody.username);
  if (user === null) {
    // 用户名不存在或者密码错误
    ctx.status = 403;
    ctx.body = {
      error: "ForbiddenOperationException",
      errorMessage: "Invalid credentials. Invalid username or password.",
    } as ErrorResponse;
    return;
  }

  let profileIndex = user.profiles.findIndex((p) => p.id === user.profileId);
  if (profileIndex < 0) profileIndex = 0;
  const spr = user.profiles[profileIndex];

  const { clientToken = await tokenSvc.generateClientToken() } = reqBody;
  // const profiles = await profileSvc.findByUserId(user.id);

  const availableProfiles: Profile[] = user.profiles.map((pf) => ({
    name: pf.name,
    id: pf.id,
  }));
  if (availableProfiles.length === 0) {
    logger.info(`用户${user.id}的档案数量为0`);
    ctx.status = 403;
    ctx.body = {
      error: "ForbiddenOperationException",
      errorMessage: "未找到档案",
    } as ErrorResponse;
    return;
  }

  let profile: Profile | undefined = undefined;
  if (user.profileId !== null) {
    profile = availableProfiles.find((pf) => pf.id === user.profileId);
  }
  if (profile === undefined) {
    logger.warn(`未找到用户${user.id}的档案${user.profileId}`);
    profile = availableProfiles[0];
    userSvc.updateProfileIdById(user.id, profile.id);
  }

  const accessToken = await tokenSvc.generateAccessToken(user.id, profile.id);

  const respBody: AuthenticateResponse = {
    clientToken,
    accessToken,
    availableProfiles,
    selectedProfile: profile,
  };

  if (reqBody.requestUser === true) {
    respBody.user = {
      username: user.email,
      properties: userSvc.getProperties(user),
      id: user.id,
    };
  }

  ctx.body = respBody;
});

router.post("/authserver/refresh", async (ctx) => {
  const { userSvc, tokenSvc } = ctx;

  const reqBody = ctx.request.body as RefreshRequest;
  const payload = await tokenSvc.parseAccessToken(reqBody.accessToken);
  if (payload === null) {
    // JWT解析失败
    ctx.status = 403;
    ctx.body = {
      error: "ForbiddenOperationException",
      errorMessage: "Invalid token",
    } as ErrorResponse;
    return;
  }

  const user = await userSvc.findById(payload.userId);
  if (user === null) {
    // 用户名不存在或者密码错误
    ctx.status = 403;
    ctx.body = {
      error: "ForbiddenOperationException",
      errorMessage: `未找到用户${payload.userId}`,
    } as ErrorResponse;
    return;
  }

  const accessToken = await tokenSvc.generateAccessToken(
    payload.userId,
    payload.profileId
  );
  const { clientToken, selectedProfile, requestUser = false } = reqBody;

  const respBody: RefreshResponse = {
    accessToken,
    clientToken,
    selectedProfile,
  };
  if (requestUser) {
    respBody.user = {
      username: user.email,
      properties: userSvc.getProperties(user),
      id: user.id,
    };
  }
  ctx.body = respBody;
});

router.get("/authserver/validate", (ctx) => {
  //
});

router.get("/authserver/signout", (ctx) => {
  //
});

router.get("/authserver/invalidate", (ctx) => {
  //
});

export default router;
