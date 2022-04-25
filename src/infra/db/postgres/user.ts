import { container, injectable } from "tsyringe";

import { User } from "@src/domain/models";
import { UserUseCasePrams } from "@src/domain/use-cases";
import {
  IUserRepository,
  UserRepositoryParams,
} from "@src/services/protocols/db/user";

import { prismaClient } from "./client";

@injectable()
export class UsersRepository implements IUserRepository {
  async create({
    email,
    name,
    password,
  }: UserUseCasePrams["create"]): Promise<User> {
    const result = await prismaClient.users.create({
      data: { name, email, password },
    });

    return result;
  }

  async deleteById({
    userId,
  }: UserUseCasePrams["deleteById"]): Promise<boolean> {
    try {
      await prismaClient.users.delete({
        where: {
          id: userId,
        },
      });

      return true;
    } catch {
      return false;
    }
  }

  async update({ data, userId }: UserUseCasePrams["update"]): Promise<User> {
    const { email, name, password } = data;

    try {
      const result = await prismaClient.users.update({
        where: { id: userId },
        data: { email, name, password },
      });
      return result;
    } catch {
      return null;
    }
  }

  async findByEmail({
    email,
  }: UserRepositoryParams["findByEmail"]): Promise<User | null> {
    const result = await prismaClient.users.findFirst({
      where: {
        email,
      },
    });

    return result;
  }

  async findById({
    userId = "",
  }: UserUseCasePrams["findById"]): Promise<User | null> {
    const result = await prismaClient.users.findFirst({
      where: {
        id: userId,
      },
    });

    return result;
  }
}

container.registerSingleton<IUserRepository>(
  "UsersRepository",
  UsersRepository
);
