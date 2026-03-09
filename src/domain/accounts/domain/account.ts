
import { User } from "@/domain/users/domain/user";

export type Account = {
  id: string;
  name: string;
  currency: string;
  user: User;
};

export interface IAccountRepository {
  findAll(): Promise<Account[]>;
}
