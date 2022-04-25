import { inject, singleton } from "tsyringe";

import { IFindUserById, UserUseCasePrams } from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { isAppError } from "@src/presentation/helpers/asserts";
import {
  makeHttpRespFromError,
  ok,
  serverError,
} from "@src/presentation/helpers/http";
import { IController, HttpResponse } from "@src/presentation/protocols";

@singleton()
export class FindUserByIdController implements IController {
  constructor(
    @inject("FindUserByIdService")
    private readonly findUserById: IFindUserById
  ) {}

  async handle({
    userId,
  }: UserUseCasePrams["findById"]): Promise<HttpResponse> {
    try {
      const isUser = await this.findUserById.findById({
        userId,
      });

      if (isAppError(isUser)) {
        return makeHttpRespFromError(isUser);
      }

      return ok({ ...isUser });
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
