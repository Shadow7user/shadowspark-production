
import { IAccountRepository, Account } from "@/domain/accounts/domain/account";
import prisma from "@/lib/prisma";

export class PrismaAccountRepository implements IAccountRepository {
  async findAll(): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      include: {
        user: true,
      },
    });
    return accounts.map(account => ({
      ...account,
      user: account.user
    }));
  }
}
