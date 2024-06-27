import Router from "@koa/router";
import { AppContext, AppState } from "@/app";
import { convertToMessage } from "@/domains/user";
import {
  AuthenticateRequest,
  AuthenticateResponse,
} from "@/domains/yggdrasil/authenticate";
import ErrorResponse from "@/domains/yggdrasil/error";
import Profile from "@/domains/yggdrasil/profile";
import { RefreshRequest, RefreshResponse } from "@/domains/yggdrasil/refresh";

const router = new Router<AppState, AppContext>();

router.post("/authenticate", async (ctx) => {
  const { userSvc, tokenSvc, profileSvc } = ctx;
  const reqBody = ctx.request.body as AuthenticateRequest;

  const user = await userSvc.findByUserName(reqBody.username);
  if (user === null) {
    // 用户名不存在或者密码错误
    ctx.status = 403;
    ctx.body = {
      error: "ForbiddenOperationException",
      errorMessage: "Invalid credentials. Invalid username or password.",
    } as ErrorResponse;
    return;
  }

  const clientToken =
    reqBody.clientToken ?? (await tokenSvc.generateClientToken());
  const accessToken = await tokenSvc.generateAccessToken();
  const profiles = await profileSvc.findByUserId(user.id);

  const availableProfiles: Profile[] = profiles.map((profile) => ({
    name: profile.name,
    id: profile.id,
  }));
  const profile = availableProfiles.find(
    (pf) => pf.id === user.selectedProfileId
  );
  if (profile === undefined) {
    ctx.status = 403;
    ctx.body = {
      error: "ForbiddenOperationException",
      errorMessage: "未找到已选取的Profile",
    } as ErrorResponse;
    return;
  }

  const respBody: AuthenticateResponse = {
    clientToken,
    accessToken,
    availableProfiles,
    selectedProfile: profile,
  };

  if (reqBody.requestUser === true) {
    respBody.user = convertToMessage(user);
  }

  ctx.body = respBody;
});

router.post("/refresh", async (ctx) => {
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

  const accessToken = await tokenSvc.generateAccessToken();
  const { clientToken, selectedProfile, requestUser = false } = reqBody;

  const respBody: RefreshResponse = {
    accessToken,
    clientToken,
    selectedProfile,
  };
  if (requestUser) {
    respBody.user = convertToMessage(user);
  }
  ctx.body = respBody;
});

router.get("/validate", (ctx) => {
  //
});

router.get("/signout", (ctx) => {
  //
});

router.get("/invalidate", (ctx) => {
  //
});

export default router;
