import { inject, injectable } from "tsyringe";

import { RequestValidation } from "@src/decorators";
import { RefreshTokenDTO } from "@src/domain/dtos";
import {
  AuthenticationUseCaseParams,
  IRefreshTokenReset,
} from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { isAppError } from "@src/presentation/helpers/asserts";
import {
  makeHttpRespFromError,
  ok,
  serverError,
} from "@src/presentation/helpers/http";
import { IController, HttpResponse } from "@src/presentation/protocols";

@injectable()
export class RefreshTokenResetController implements IController {
  constructor(
    @inject("RefreshTokenResetService")
    private readonly refreshTokenReset: IRefreshTokenReset
  ) {}
  @RequestValidation(RefreshTokenDTO)
  async handle({
    refreshToken,
  }: AuthenticationUseCaseParams["reset"]): Promise<HttpResponse> {
    try {
      const result = await this.refreshTokenReset.reset({ refreshToken });

      if (isAppError(result)) {
        return makeHttpRespFromError(result);
      }

      return ok({ ...result });
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
