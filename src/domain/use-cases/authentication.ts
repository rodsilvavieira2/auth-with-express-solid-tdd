import { AppError } from "@src/validation/protocols";

import { User } from "../models";

type UserAuthData = Omit<User, "password">;

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthenticationUseCaseParams = {
  auth: Pick<User, "email" | "password">;
  authByToken: {
    token: string;
  };
  reset: {
    refreshToken: string;
  };
};

export type AuthenticationUseCaseReturns = {
  auth: {
    user: UserAuthData;
    tokens: AuthTokens;
  };
  authByToken: UserAuthData;
  reset: AuthTokens;
};

export interface IAuthentication {
  auth(
    params: AuthenticationUseCaseParams["auth"]
  ): Promise<AuthenticationUseCaseReturns["auth"] | AppError>;
}

export interface IAuthenticateUserByJWT {
  authByToken(
    params: AuthenticationUseCaseParams["authByToken"]
  ): Promise<AuthenticationUseCaseReturns["authByToken"] | AppError>;
}

export interface IRefreshTokenReset {
  reset(
    params: AuthenticationUseCaseParams["reset"]
  ): Promise<AuthenticationUseCaseReturns["reset"] | AppError>;
}
