import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { UsersRepositorySpy } from "@src/mocks/data/db";
import { UserNotFoundError } from "@src/validation/errors";

import { removePasswordFiled } from "../util";
import { FindUserByIdService } from "./find-user-by-id-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();

  const sut = new FindUserByIdService(usersRepositorySpy);

  return {
    sut,
    usersRepositorySpy,
  };
}

describe("FindUserByIdService", () => {
  let params: UserUseCasePrams["findById"];

  beforeEach(() => {
    params = {
      userId: faker.datatype.uuid(),
    };
  });

  it("should find a user by id", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    const result = await sut.findById(params);

    expect(usersRepositorySpy.findByIdParams).toEqual({
      userId: params.userId,
    });

    expect(result).toEqual(
      removePasswordFiled(usersRepositorySpy.findByIdReturn)
    );
  });

  it("should return an AppError if not find the user", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    usersRepositorySpy.findByIdReturn = null;

    const result = await sut.findById(params);

    expect(result).toEqual(new UserNotFoundError());
  });
});
