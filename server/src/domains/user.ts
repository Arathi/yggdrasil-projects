import UserMessage from "./yggdrasil/user";

export default interface User {
  id: string;
  name: string;
  password: string;
  selectedProfileId?: string;
  language?: string;
  country?: string;
}

export function convertToMessage(user: User): UserMessage {
  const properties: UserMessage["properties"] = [];

  if (user.language !== undefined) {
    properties.push({
      name: "preferredLanguage",
      value: user.language,
    });
  }

  if (user.country !== undefined) {
    properties.push({
      name: "registrationCountry",
      value: user.country,
    });
  }

  return {
    id: user.id,
    username: user.name,
    properties,
  };
}
