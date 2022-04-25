import { injectable, inject, container } from "tsyringe";

import {
  IUpdateUser,
  UserUseCasePrams,
  UserUseCaseReturns,
} from "@src/domain/use-cases";
import { UserNotFoundError } from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IUserRepository } from "../protocols/db/user";
import { removePasswordFiled } from "../util";

@injectable()
export class UpdateUserService implements IUpdateUser {
  constructor(
    @inject("UsersRepository") private readonly usersRepository: IUserRepository
  ) {}
  async update({
    data,
    userId,
  }: UserUseCasePrams["update"]): Promise<
    UserUseCaseReturns["base"] | AppError
  > {
    const isUpdated = await this.usersRepository.update({
      userId,
      data,
    });

    if (!isUpdated) return new UserNotFoundError();

    return removePasswordFiled(isUpdated);
  }
}

container.registerSingleton<IUpdateUser>(
  "UpdateUserService",
  UpdateUserService
);
