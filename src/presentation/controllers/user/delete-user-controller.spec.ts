import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { DeleteUserByIdSpy } from "@src/mocks/presentation/user";
import { makeAppErrorMock } from "@src/mocks/validation";
import {
  makeHttpRespFromError,
  noContent,
  serverError,
} from "@src/presentation/helpers/http";

import { DeleteUserController } from "./delete-user-controller";

function makeSut() {
  const deleteUserByIdSpy = new DeleteUserByIdSpy();

  const sut = new DeleteUserController(deleteUserByIdSpy);

  return {
    deleteUserByIdSpy,
    sut,
  };
}

describe("DeleteUserController", () => {
  let params: UserUseCasePrams["deleteById"];

  beforeEach(() => {
    params = {
      userId: faker.datatype.uuid(),
    };
  });

  it("should handle the request and delete a existing user", async () => {
    const { deleteUserByIdSpy, sut } = makeSut();

    const response = await sut.handle(params);

    expect(deleteUserByIdSpy.params).toEqual(params);

    expect(response).toEqual(noContent());
  });

  it("should return a http error status if not delete the user", async () => {
    const { deleteUserByIdSpy, sut } = makeSut();

    const error = makeAppErrorMock();

    deleteUserByIdSpy.result = error;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(error));
  });

  it("should return a http server error if the deleteById method throws", async () => {
    const { deleteUserByIdSpy, sut } = makeSut();

    jest.spyOn(deleteUserByIdSpy, "deleteById").mockRejectedValue(new Error());

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
