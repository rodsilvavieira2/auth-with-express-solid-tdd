import { injectable, inject, container } from "tsyringe";

import {
  AuthenticationUseCaseParams,
  AuthenticationUseCaseReturns,
  IRefreshTokenReset,
} from "@src/domain/use-cases";
import { JWT_CONFIG } from "@src/main/config/env";
import {
  RefreshTokenNotFoundError,
  ExpiredRefreshTokenError,
  UserNotFoundError,
} from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IJwtManager } from "../protocols/cryptography/jwt";
import { IUuiDManager } from "../protocols/cryptography/uuid";
import { IDateManager } from "../protocols/date";
import { ITokenRepository } from "../protocols/db/tokens";
import { IUserRepository } from "../protocols/db/user";

@injectable()
export class RefreshTokenResetService implements IRefreshTokenReset {
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
    private readonly dateManager: IDateManager
  ) {}

  async reset({
    refreshToken,
  }: AuthenticationUseCaseParams["reset"]): Promise<
    AuthenticationUseCaseReturns["reset"] | AppError
  > {
    const isToken = await this.tokensRepository.findByToken({
      token: refreshToken,
    });

    if (!isToken) {
      return new RefreshTokenNotFoundError();
    }

    const now = this.dateManager.getDate();

    const isExpired = this.dateManager.isBefore(isToken.expiresIn, now);

    if (isExpired) {
      return new ExpiredRefreshTokenError();
    }

    const isUser = await this.usersRepository.findById({
      userId: isToken.userId,
    });

    if (!isUser) {
      return new UserNotFoundError();
    }

    const { id, name, email } = isUser;

    const accessToken = this.jwtManager.create(id, {
      email,
      name,
    });

    const newRefreshToken = this.uuidManager.gen();

    const expiresIn = this.dateManager.addDays(
      JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS
    );

    await this.tokensRepository.updateByToken({
      token: refreshToken,
      data: {
        expiresIn,
        token: newRefreshToken,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

container.registerSingleton<IRefreshTokenReset>(
  "RefreshTokenResetService",
  RefreshTokenResetService
);
