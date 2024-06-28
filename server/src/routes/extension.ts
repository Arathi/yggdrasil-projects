import Router from "@koa/router";
import { AppContext, AppState } from "@/app";
import {
  RegisterRequest,
  RegisterResponse,
} from "@/domains/extension/register";
import { getLogger } from "@/utils/logger";

const logger = getLogger("extension-router");

const router = new Router<AppState, AppContext>();

router.post("/register", async (ctx) => {
  const { userSvc } = ctx;

  const reqBody = ctx.request.body as RegisterRequest;
  const { email, name, password, language } = reqBody;

  const user = await userSvc.create(email, name, password, language);
  const profile = user.profiles[0];
  userSvc.updateProfileId(profile);

  const respBody: RegisterResponse = {
    user: {
      username: user.email,
      properties: userSvc.getProperties(user),
      id: user.id,
    },
    profile: {
      name: profile.name,
      id: profile.id,
    },
  };
  ctx.body = respBody;
});

export default router;
