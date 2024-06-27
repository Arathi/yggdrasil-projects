import Profile from "./profile";
import User from "./user";

export interface AuthenticateRequest {
  agent: Agent;
  username: string;
  password: string;
  clientToken?: string;
  requestUser?: boolean;
}

interface Agent {
  name: string;
  version: number;
}

const DefaultAgent: Agent = {
  name: "Minecraft",
  version: 1,
};

export interface AuthenticateResponse {
  user?: User;
  clientToken: string;
  accessToken: string;
  availableProfiles: Profile[];
  selectedProfile: Profile;
}

type Hexadecimal = string;
