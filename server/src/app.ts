import Koa from "koa";
import UserService from "./services/user-service";
import ProfileService from "./services/profile-service";
import TokenService from "./services/token-service";

import yggdrasil from "./routes/yggdrasil";
import extension from "./routes/extension";
import koaBody from "koa-body";

export interface AppState {
  //
}

export interface AppContext {
  userSvc: UserService;
  profileSvc: ProfileService;
  tokenSvc: TokenService;
}

export function createApp() {
  const app = new Koa<AppState, AppContext>();

  // context
  app.context.userSvc = new UserService();
  app.context.profileSvc = new ProfileService();
  app.context.tokenSvc = new TokenService();

  // middleware
  app.use(koaBody());

  // routes
  app.use(yggdrasil.routes()).use(yggdrasil.allowedMethods());
  app.use(extension.routes()).use(extension.allowedMethods());

  return app;
}
