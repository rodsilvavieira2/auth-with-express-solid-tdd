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
    const isDeleted = await this.usersRepository.deleteById({
      userId,
    });

    if (!isDeleted) {
      return new UserNotFoundError();
    }

    return undefined;
  }
}

container.registerSingleton<IDeleteUserById>(
  "DeleteUserByIdService",
  DeleteUserByIdService
);
