import Profile from "../yggdrasil/profile";
import User from "../yggdrasil/user";

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  profile: Profile;
}
