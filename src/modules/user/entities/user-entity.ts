export class User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  password: string;
  refreshToken: string | null;
  createdAt: Date;
}