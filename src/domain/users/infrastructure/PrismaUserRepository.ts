
import { IUserRepository, User } from "@/domain/users/domain/user";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }
}
