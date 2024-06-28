import Profile from "../yggdrasil/profile";
import User from "../yggdrasil/user";

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  language?: string;
}

export interface RegisterResponse {
  user: User;
  profile: Profile;
}
