import { Token } from "@src/domain/models";

export type TokenRepositoryParams = {
  create: Pick<Token, "token" | "expiresIn" | "userId">;
  updateByToken: {
    token: string;
    data: Partial<Pick<Token, "token" | "expiresIn" | "userId">>;
  };
  findByToken: {
    token: string;
  };
  deleteById: {
    id: string;
  };
};

export interface ITokenRepository {
  create(params: TokenRepositoryParams["create"]): Promise<Token>;

  updateByToken(params: TokenRepositoryParams["updateByToken"]): Promise<Token>;

  deleteById(params: TokenRepositoryParams["deleteById"]): Promise<void>;

  findByToken(
    params: TokenRepositoryParams["findByToken"]
  ): Promise<Token | null>;
}
