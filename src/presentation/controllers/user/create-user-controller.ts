import { inject, singleton } from "tsyringe";

import { RequestValidation } from "@src/decorators";
import { UserDTO } from "@src/domain/dtos";
import { ICreateUser, UserUseCasePrams } from "@src/domain/use-cases";
import { logger } from "@src/helpers";
import { isAppError } from "@src/presentation/helpers/asserts";
import {
  makeHttpRespFromError,
  created,
  serverError,
} from "@src/presentation/helpers/http";
import { IController, HttpResponse } from "@src/presentation/protocols";

@singleton()
export class CreateUserController implements IController {
  constructor(
    @inject("CreateUserService")
    private readonly createUser: ICreateUser
  ) {}
  @RequestValidation(UserDTO)
  async handle({
    email,
    name,
    password,
    avatarUrl,
  }: UserUseCasePrams["create"]): Promise<HttpResponse> {
    try {
      const response = await this.createUser.create({
        email,
        name,
        password,
        avatarUrl,
      });

      if (isAppError(response)) {
        return makeHttpRespFromError(response);
      }

      return created(response);
    } catch (error) {
      logger.error(error);

      return serverError();
    }
  }
}
