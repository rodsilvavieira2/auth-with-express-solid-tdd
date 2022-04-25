import { AppError } from "@src/validation/protocols";

import { UserDTO } from "../dtos";
import { User } from "../models";

type UserId = {
  userId: string;
};

export type UserUseCasePrams = {
  create: UserDTO;
  deleteById: UserId;
  findById: UserId;
  update: {
    userId: string;
    data: Partial<Pick<User, "avatarUrl" | "name" | "email" | "password">>;
  };
};

export type UserUseCaseReturns = {
  create: {
    user: Omit<User, "password">;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  base: Omit<User, "password">;
};

export interface ICreateUser {
  create(
    params: UserUseCasePrams["create"]
  ): Promise<UserUseCaseReturns["create"] | AppError>;
}

export interface IDeleteUserById {
  deleteById(params: UserUseCasePrams["deleteById"]): Promise<void | AppError>;
}

export interface IUpdateUser {
  update(
    params: UserUseCasePrams["update"]
  ): Promise<UserUseCaseReturns["base"] | AppError>;
}

export interface IFindUserById {
  findById(
    params: UserUseCasePrams["findById"]
  ): Promise<UserUseCaseReturns["base"] | AppError>;
}
