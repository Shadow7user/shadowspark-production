
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  emailVerified: Date | null;
};

export interface IUserRepository {
  findAll(): Promise<User[]>;
}
