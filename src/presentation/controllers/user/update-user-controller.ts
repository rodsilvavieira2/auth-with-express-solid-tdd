import { inject, singleton } from "tsyringe";

import { RequestValidation } from "@src/decorators";
import { UpdateUserDTO } from "@src/domain/dtos";
import { UserUseCasePrams, IUpdateUser } from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { isAppError } from "@src/presentation/helpers/asserts";
import {
  makeHttpRespFromError,
  ok,
  serverError,
} from "@src/presentation/helpers/http";
import { IController, HttpResponse } from "@src/presentation/protocols";

export type UpdateUserRequest = {
  userId: string;
} & UserUseCasePrams["update"]["data"];
@singleton()
export class UpdateUserController implements IController {
  constructor(
    @inject("UpdateUserService")
    private readonly updateUser: IUpdateUser
  ) {}

  @RequestValidation(UpdateUserDTO)
  async handle({
    userId,
    email,
    name,
    password,
    avatarUrl,
  }: UpdateUserRequest): Promise<HttpResponse> {
    try {
      const isUpdatedData = await this.updateUser.update({
        userId,
        data: {
          email,
          name,
          password,
          avatarUrl,
        },
      });

      if (isAppError(isUpdatedData)) {
        return makeHttpRespFromError(isUpdatedData);
      }

      return ok({ ...isUpdatedData });
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
