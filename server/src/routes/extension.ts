import { AppContext, AppState } from "@/app";
import {
  RegisterRequest,
  RegisterResponse,
} from "@/domains/extension/register";
import { convertToMessage } from "@/domains/user";
import Router from "@koa/router";

const router = new Router<AppState, AppContext>();

router.post("/register", async (ctx) => {
  const { userSvc, profileSvc } = ctx;

  const reqBody = ctx.request.body as RegisterRequest;
  const user = await userSvc.generate(reqBody.username, reqBody.password);
  const profile = await profileSvc.generate(reqBody.username, user.id);

  const respBody: RegisterResponse = {
    user: convertToMessage(user),
    profile: {
      name: profile.name,
      id: profile.id,
    },
  };
  ctx.body = respBody;
});

export default router;
