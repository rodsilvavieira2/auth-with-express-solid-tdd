import faker from "@faker-js/faker";
import {
  ICreateUser,
  IUpdateUser,
  IDeleteUserById,
  IFindUserById,
  UserUseCasePrams,
  UserUseCaseReturns,
} from "@src/domain/use-cases";
import { AppError } from "@src/validation/protocols";

import { createUserMock } from "../models";

export class CreateUserSpy implements ICreateUser {
  params: UserUseCasePrams["create"];
  result: UserUseCaseReturns["create"] | AppError = {
    user: createUserMock(),
    tokens: {
      accessToken: faker.datatype.uuid(),
      refreshToken: faker.datatype.uuid(),
    },
  };

  async create(
    params: UserUseCasePrams["create"]
  ): Promise<AppError | UserUseCaseReturns["create"]> {
    this.params = params;

    return this.result;
  }
}

export class UpdateUserSpy implements IUpdateUser {
  params: UserUseCasePrams["update"];
  result: UserUseCaseReturns["base"] | AppError = createUserMock();

  async update(
    params: UserUseCasePrams["update"]
  ): Promise<UserUseCaseReturns["base"] | AppError> {
    this.params = params;

    return this.result;
  }
}

export class DeleteUserByIdSpy implements IDeleteUserById {
  params: UserUseCasePrams["deleteById"];
  result: AppError | undefined;

  async deleteById(
    params: UserUseCasePrams["deleteById"]
  ): Promise<void | AppError> {
    this.params = params;

    return this.result;
  }
}

export class FindUserByIdSpy implements IFindUserById {
  params: UserUseCasePrams["findById"] | undefined;
  result: UserUseCaseReturns["base"] | AppError = createUserMock();

  async findById(
    params: UserUseCasePrams["findById"]
  ): Promise<UserUseCaseReturns["base"] | AppError> {
    this.params = params;

    return this.result;
  }
}
