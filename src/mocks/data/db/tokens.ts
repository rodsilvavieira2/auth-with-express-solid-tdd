import { Token } from "@src/domain/models";
import { createTokenMock } from "@src/mocks/models";
import {
  ITokenRepository,
  TokenRepositoryParams,
} from "@src/services/protocols/db/tokens";

export class TokensRepositorySpy implements ITokenRepository {
  createParams: TokenRepositoryParams["create"];
  updateByTokenParams: TokenRepositoryParams["updateByToken"];
  deleteByIdParams: TokenRepositoryParams["deleteById"];
  findByTokenParams: TokenRepositoryParams["findByToken"];

  findByTokenReturn: Token = createTokenMock();
  createReturn: Token = createTokenMock();
  updateByTokenReturn: Token = createTokenMock();

  async create(params: TokenRepositoryParams["create"]): Promise<Token> {
    this.createParams = params;

    return this.createReturn;
  }

  async updateByToken(
    params: TokenRepositoryParams["updateByToken"]
  ): Promise<Token> {
    this.updateByTokenParams = params;

    return this.updateByTokenReturn;
  }

  async deleteById(params: TokenRepositoryParams["deleteById"]): Promise<void> {
    this.deleteByIdParams = params;
  }

  async findByToken(
    params: TokenRepositoryParams["findByToken"]
  ): Promise<Token> {
    this.findByTokenParams = params;

    return this.findByTokenReturn;
  }
}
