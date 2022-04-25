import { injectable, inject, container } from "tsyringe";

import {
  AuthenticationUseCaseParams,
  AuthenticationUseCaseReturns,
  IAuthenticateUserByJWT,
} from "@src/domain/use-cases";
import { InvalidAccessTokenError } from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IJwtManager } from "../protocols/cryptography/jwt";
import { IUserRepository } from "../protocols/db/user";
import { removePasswordFiled } from "../util";

@injectable()
export class AuthenticateUserByJWTService implements IAuthenticateUserByJWT {
  constructor(
    @inject("JwtFacade")
    private readonly JwtManager: IJwtManager,
    @inject("UsersRepository")
    private readonly usersRepository: IUserRepository
  ) {}

  async authByToken({
    token,
  }: AuthenticationUseCaseParams["authByToken"]): Promise<
    AuthenticationUseCaseReturns["authByToken"] | AppError
  > {
    const isValid = this.JwtManager.verify(token);

    if (!isValid) return new InvalidAccessTokenError();

    const decodedJWT = this.JwtManager.decode(token);

    const user = await this.usersRepository.findById({
      userId: decodedJWT.sub,
    });

    if (!user) return new InvalidAccessTokenError();

    return removePasswordFiled(user);
  }
}

container.registerSingleton<IAuthenticateUserByJWT>(
  "AuthenticateUserByJWTService",
  AuthenticateUserByJWTService
);
