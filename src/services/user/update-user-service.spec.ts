import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { UsersRepositorySpy } from "@src/mocks/data/db";
import { UserNotFoundError } from "@src/validation/errors";

import { removePasswordFiled } from "../util";
import { UpdateUserService } from "./update-user-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();

  const sut = new UpdateUserService(usersRepositorySpy);

  return {
    sut,
    usersRepositorySpy,
  };
}

describe("UpdateUserService", () => {
  let params: UserUseCasePrams["update"];

  beforeEach(() => {
    params = {
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
      },
      userId: faker.datatype.uuid(),
    };
  });

  it("should update a user", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    const result = await sut.update(params);

    expect(usersRepositorySpy.findByIdParams).toEqual({
      userId: params.userId,
    });

    expect(usersRepositorySpy.updateParams).toEqual({
      userId: params.userId,
      data: params.data,
    });

    expect(result).toEqual(
      removePasswordFiled(usersRepositorySpy.updateReturn)
    );
  });

  it("should return an AppError if not find the user", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    usersRepositorySpy.findByIdReturn = null;

    const result = await sut.update(params);

    expect(result).toEqual(new UserNotFoundError());
  });
});
