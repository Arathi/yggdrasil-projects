import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { PrismaClient } from "@prisma/client";

import User from "./domains/user";
import Profile from "./domains/profile";

import UserService from "./services/user-service";
import ProfileService from "./services/profile-service";
import TokenService, { AccessToken } from "./services/token-service";

import yggdrasil from "./routes/yggdrasil";
import extension from "./routes/extension";

export interface AppState {
  accessToken?: AccessToken;
  user?: User;
  profile?: Profile;
}

export interface AppContext {
  userSvc: UserService;
  profileSvc: ProfileService;
  tokenSvc: TokenService;
}

export function createApp(prisma: PrismaClient) {
  const app = new Koa<AppState, AppContext>();

  // context
  app.context.userSvc = new UserService(prisma);
  app.context.profileSvc = new ProfileService(prisma);
  app.context.tokenSvc = new TokenService();

  // middleware
  app.use(bodyParser());

  // routes
  app.use(yggdrasil.routes()).use(yggdrasil.allowedMethods());
  app.use(extension.routes()).use(extension.allowedMethods());

  return app;
}
