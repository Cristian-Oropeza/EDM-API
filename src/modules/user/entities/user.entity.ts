export class User {
  id!: number;
  name!: string;
  lastName!: string;
  username!: string;
  hash?: string | null | undefined;
  password?: string;
  createdAt!: Date;
}