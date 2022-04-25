import { container, injectable } from "tsyringe";

import { Token } from "@src/domain/models";
import {
  ITokenRepository,
  TokenRepositoryParams,
} from "@src/services/protocols/db/tokens";

import { prismaClient } from "./client";

@injectable()
export class TokensRepository implements ITokenRepository {
  async updateByToken({
    data,
    token,
  }: TokenRepositoryParams["updateByToken"]): Promise<Token> {
    const { expiresIn, token: newToken } = data;

    const result = await prismaClient.tokens.update({
      where: {
        token,
      },
      data: {
        expiresIn,
        token: newToken,
      },
    });

    return result;
  }
  async findByToken({
    token,
  }: TokenRepositoryParams["findByToken"]): Promise<Token | null> {
    const result = await prismaClient.tokens.findFirst({
      where: {
        token,
      },
    });

    return result;
  }

  async create({
    expiresIn,
    token,
    userId,
  }: TokenRepositoryParams["create"]): Promise<Token> {
    const result = await prismaClient.tokens.create({
      data: {
        token,
        expiresIn,
        userId,
      },
    });

    return result;
  }

  async deleteById({ id }: TokenRepositoryParams["deleteById"]): Promise<void> {
    await prismaClient.tokens.delete({
      where: {
        id,
      },
    });
  }
}

container.registerSingleton<ITokenRepository>(
  "TokensRepository",
  TokensRepository
);
