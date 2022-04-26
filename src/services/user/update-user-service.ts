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
    const user = await this.usersRepository.findById({
      userId,
    });

    if (!user) {
      return new UserNotFoundError();
    }

    const updatedData = await this.usersRepository.update({
      userId,
      data,
    });

    return removePasswordFiled(updatedData);
  }
}

container.registerSingleton<IUpdateUser>(
  "UpdateUserService",
  UpdateUserService
);
