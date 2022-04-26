/* eslint-disable consistent-return */

import { injectable, inject, container } from "tsyringe";

import { IDeleteUserById, UserUseCasePrams } from "@src/domain/use-cases";
import { UserNotFoundError } from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IUserRepository } from "../protocols/db/user";

@injectable()
export class DeleteUserByIdService implements IDeleteUserById {
  constructor(
    @inject("UsersRepository") private readonly usersRepository: IUserRepository
  ) {}
  async deleteById({
    userId,
  }: UserUseCasePrams["deleteById"]): Promise<void | AppError> {
    const user = await this.usersRepository.findById({
      userId,
    });

    if (!user) {
      return new UserNotFoundError();
    }

    await this.usersRepository.deleteById({
      userId,
    });

    return undefined;
  }
}

container.registerSingleton<IDeleteUserById>(
  "DeleteUserByIdService",
  DeleteUserByIdService
);
