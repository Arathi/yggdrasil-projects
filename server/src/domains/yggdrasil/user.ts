export default interface User {
  username: string;
  properties: Property[];
  id: string;
}

export interface Property {
  name: string;
  value: string;
}
