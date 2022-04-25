import { inject, singleton } from "tsyringe";

import { IDeleteUserById, UserUseCasePrams } from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { isAppError } from "@src/presentation/helpers/asserts";
import {
  makeHttpRespFromError,
  noContent,
  serverError,
} from "@src/presentation/helpers/http";
import { IController, HttpResponse } from "@src/presentation/protocols";

@singleton()
export class DeleteUserController implements IController {
  constructor(
    @inject("DeleteUserByIdService")
    private readonly deleteUserById: IDeleteUserById
  ) {}

  async handle({
    userId,
  }: UserUseCasePrams["deleteById"]): Promise<HttpResponse> {
    try {
      const isDeleted = await this.deleteUserById.deleteById({
        userId,
      });

      if (isAppError(isDeleted)) {
        return makeHttpRespFromError(isDeleted);
      }

      return noContent();
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
