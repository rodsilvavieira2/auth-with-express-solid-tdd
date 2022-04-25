import faker from "@faker-js/faker";
import {
  AuthenticationUseCaseParams,
  AuthenticationUseCaseReturns,
  IAuthenticateUserByJWT,
  IAuthentication,
  IRefreshTokenReset,
} from "@src/domain/use-cases";
import { AppError } from "@src/validation/protocols";

import { createUserMock } from "../models";

export class AuthenticateUserByJWTSpy implements IAuthenticateUserByJWT {
  params: AuthenticationUseCaseParams["authByToken"];
  result: AuthenticationUseCaseReturns["authByToken"] | AppError =
    createUserMock();

  async authByToken(
    params: AuthenticationUseCaseParams["authByToken"]
  ): Promise<AuthenticationUseCaseReturns["authByToken"] | AppError> {
    this.params = params;

    return this.result;
  }
}

export class AuthenticationSpy implements IAuthentication {
  params: AuthenticationUseCaseParams["auth"];
  result: AuthenticationUseCaseReturns["auth"] | AppError = {
    tokens: {
      accessToken: faker.datatype.uuid(),
      refreshToken: faker.datatype.uuid(),
    },
    user: createUserMock(),
  };

  async auth(
    params: AuthenticationUseCaseParams["auth"]
  ): Promise<AuthenticationUseCaseReturns["auth"] | AppError> {
    this.params = params;

    return this.result;
  }
}

export class RefreshTokenResetSpy implements IRefreshTokenReset {
  params: AuthenticationUseCaseReturns["reset"];
  result: AuthenticationUseCaseReturns["reset"] | AppError = {
    accessToken: faker.datatype.uuid(),
    refreshToken: faker.datatype.uuid(),
  };

  async reset(
    params: AuthenticationUseCaseReturns["reset"]
  ): Promise<AuthenticationUseCaseReturns["reset"] | AppError> {
    this.params = params;

    return this.result;
  }
}
