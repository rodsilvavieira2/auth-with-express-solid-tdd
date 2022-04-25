import { inject, singleton } from "tsyringe";

import { IAuthenticateUserByJWT } from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { MissingAccessToken } from "@src/validation/errors";

import { isAppError } from "../helpers/asserts";
import {
  authentication,
  makeHttpRespFromError,
  ok,
  serverError,
} from "../helpers/http";
import { IMiddleware, HttpResponse } from "../protocols";

type Request = {
  accessToken?: string;
};

@singleton()
export class AuthMiddleware implements IMiddleware {
  constructor(
    @inject("AuthenticateUserByJWTService")
    private readonly authenticateUserByJWT: IAuthenticateUserByJWT
  ) {}
  async handle({ accessToken }: Request): Promise<HttpResponse> {
    if (!accessToken) {
      return authentication(new MissingAccessToken());
    }

    try {
      const user = await this.authenticateUserByJWT.authByToken({
        token: accessToken,
      });

      if (isAppError(user)) {
        return makeHttpRespFromError(user);
      }

      return ok({ userId: user.id });
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
