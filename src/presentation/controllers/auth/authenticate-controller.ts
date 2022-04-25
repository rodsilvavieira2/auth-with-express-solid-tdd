import { inject, singleton } from "tsyringe";

import { RequestValidation } from "@src/decorators";
import { AuthenticationDTO } from "@src/domain/dtos";
import {
  AuthenticationUseCaseParams,
  IAuthentication,
} from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { isAppError } from "@src/presentation/helpers/asserts";
import {
  makeHttpRespFromError,
  ok,
  serverError,
} from "@src/presentation/helpers/http";
import { IController, HttpResponse } from "@src/presentation/protocols";

@singleton()
export class AuthenticateController implements IController {
  constructor(
    @inject("AuthenticationService")
    private readonly authentication: IAuthentication
  ) {}

  @RequestValidation(AuthenticationDTO)
  async handle(
    request: AuthenticationUseCaseParams["auth"]
  ): Promise<HttpResponse> {
    try {
      const isAuthenticate = await this.authentication.auth(request);

      if (isAppError(isAuthenticate)) {
        return makeHttpRespFromError(isAuthenticate);
      }

      return ok({ ...isAuthenticate });
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
