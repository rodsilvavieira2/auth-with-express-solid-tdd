import { injectable, inject, container } from "tsyringe";

import {
  IAuthentication,
  AuthenticationUseCaseParams,
  AuthenticationUseCaseReturns,
} from "@src/domain/use-cases";
import { JWT_CONFIG } from "@src/main/config/env";
import { InvalidCredentialsError } from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IHasherManager } from "../protocols/cryptography/hash";
import { IJwtManager } from "../protocols/cryptography/jwt";
import { IUuiDManager } from "../protocols/cryptography/uuid";
import { IDateManager } from "../protocols/date";
import { ITokenRepository } from "../protocols/db/tokens";
import { IUserRepository } from "../protocols/db/user";
import { removePasswordFiled } from "../util";

@injectable()
export class AuthenticationService implements IAuthentication {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUserRepository,
    @inject("TokensRepository")
    private readonly tokensRepository: ITokenRepository,
    @inject("UuidFacade")
    private readonly uuidManager: IUuiDManager,
    @inject("JwtFacade")
    private readonly jwtManager: IJwtManager,
    @inject("DayjsFacade")
    private readonly dateManager: IDateManager,
    @inject("BcryptFacade")
    private readonly hasherManager: IHasherManager
  ) {}
  async auth({
    email,
    password,
  }: AuthenticationUseCaseParams["auth"]): Promise<
    AuthenticationUseCaseReturns["auth"] | AppError
  > {
    const userExists = await this.usersRepository.findByEmail({
      email,
    });

    if (!userExists) return new InvalidCredentialsError();

    const isValid = await this.hasherManager.compare(
      password,
      userExists.password
    );

    if (!isValid) return new InvalidCredentialsError();

    const { id, name } = userExists;

    const accessToken = this.jwtManager.create(id, {
      email,
      name,
    });

    const refreshToken = this.uuidManager.gen();

    const expiresIn = this.dateManager.addDays(
      JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS
    );

    await this.tokensRepository.create({
      expiresIn,
      token: refreshToken,
      userId: userExists.id,
    });

    return {
      user: removePasswordFiled(userExists),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

container.registerSingleton<IAuthentication>(
  "AuthenticationService",
  AuthenticationService
);
