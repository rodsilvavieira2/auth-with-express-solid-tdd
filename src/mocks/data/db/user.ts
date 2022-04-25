import { User } from "@src/domain/models";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { createUserMock } from "@src/mocks/models";
import {
  IUserRepository,
  UserRepositoryParams,
} from "@src/services/protocols/db/user";

export class UsersRepositorySpy implements IUserRepository {
  createParams: UserUseCasePrams["create"];
  deleteByIdParams: UserUseCasePrams["deleteById"];
  updateParams: UserUseCasePrams["update"];
  findByIdParams: UserUseCasePrams["findById"];
  findByEmailParams: UserRepositoryParams["findByEmail"];

  createReturn: User = createUserMock();
  updateReturn: User = createUserMock();
  findByIdReturn: User = createUserMock();
  findByEmailReturn: User = createUserMock();
  deleteByIdReturn = true;

  async create(params: UserUseCasePrams["create"]): Promise<User> {
    this.createParams = params;

    return this.createReturn;
  }
  async deleteById(params: UserUseCasePrams["deleteById"]): Promise<boolean> {
    this.deleteByIdParams = params;

    return this.deleteByIdReturn;
  }

  async update(params: UserUseCasePrams["update"]): Promise<User> {
    this.updateParams = params;

    return this.updateReturn;
  }

  async findById(params: UserUseCasePrams["findById"]): Promise<User> {
    this.findByIdParams = params;

    return this.findByIdReturn;
  }

  async findByEmail(
    params: UserRepositoryParams["findByEmail"]
  ): Promise<User> {
    this.findByEmailParams = params;

    return this.findByEmailReturn;
  }
}
