import { injectable, inject, container } from "tsyringe";

import {
  IFindUserById,
  UserUseCasePrams,
  UserUseCaseReturns,
} from "@src/domain/use-cases";
import { UserNotFoundError } from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IUserRepository } from "../protocols/db/user";
import { removePasswordFiled } from "../util";

@injectable()
export class FindUserByIdService implements IFindUserById {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUserRepository
  ) {}
  async findById({
    userId,
  }: UserUseCasePrams["findById"]): Promise<
    UserUseCaseReturns["base"] | AppError
  > {
    const user = await this.usersRepository.findById({ userId });

    if (!user) return new UserNotFoundError();

    return removePasswordFiled(user);
  }
}

container.registerSingleton<IFindUserById>(
  "FindUserByIdService",
  FindUserByIdService
);
