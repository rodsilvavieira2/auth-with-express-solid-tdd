import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { UsersRepositorySpy } from "@src/mocks/data/db";
import { UserNotFoundError } from "@src/validation/errors";

import { DeleteUserByIdService } from "./delete-user-by-id-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();

  const sut = new DeleteUserByIdService(usersRepositorySpy);

  return {
    sut,
    usersRepositorySpy,
  };
}

describe("DeleteUserByIdService", () => {
  let params: UserUseCasePrams["deleteById"];

  beforeEach(() => {
    params = {
      userId: faker.datatype.uuid(),
    };
  });

  it("should delete a user", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    const result = await sut.deleteById(params);

    expect(usersRepositorySpy.deleteByIdParams).toEqual({
      userId: params.userId,
    });

    expect(result).toBeFalsy();
  });

  it("should delete an AppError if not find the user ", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    jest.spyOn(usersRepositorySpy, "deleteById").mockResolvedValue(false);

    const result = await sut.deleteById(params);

    expect(result).toEqual(new UserNotFoundError());
  });
});
