import { User } from "@src/domain/models";
import { UserUseCasePrams } from "@src/domain/use-cases";

export type UserRepositoryParams = {
  findByEmail: {
    email: string;
  };
};

export interface IUserRepository {
  create(params: UserUseCasePrams["create"]): Promise<User>;

  deleteById(params: UserUseCasePrams["deleteById"]): Promise<boolean>;

  update(params: UserUseCasePrams["update"]): Promise<User>;

  findById(params: UserUseCasePrams["findById"]): Promise<User | null>;

  findByEmail(
    params: UserRepositoryParams["findByEmail"]
  ): Promise<User | null>;
}
