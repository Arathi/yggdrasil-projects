import Profile from "./profile";
import User from "./user";

export interface RefreshRequest {
  accessToken: string;
  clientToken: string;
  selectedProfile: Profile;
  requestUser?: boolean;
}

export interface RefreshResponse {
  accessToken: string;
  clientToken: string;
  selectedProfile: Profile;
  user?: User;
}
