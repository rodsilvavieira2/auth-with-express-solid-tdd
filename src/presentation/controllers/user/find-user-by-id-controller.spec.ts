import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { FindUserByIdSpy } from "@src/mocks/presentation/user";
import { makeAppErrorMock } from "@src/mocks/validation";
import {
  makeHttpRespFromError,
  serverError,
  ok,
} from "@src/presentation/helpers/http";

import { FindUserByIdController } from "./find-user-by-id-controller";

function makeSut() {
  const findUserById = new FindUserByIdSpy();

  const sut = new FindUserByIdController(findUserById);

  return {
    findUserById,
    sut,
  };
}

describe("FindUserByIdController", () => {
  let params: UserUseCasePrams["findById"];

  beforeEach(() => {
    params = {
      userId: faker.datatype.uuid(),
    };
  });

  it("should handle the request and find a existing user", async () => {
    const { findUserById, sut } = makeSut();

    const response = await sut.handle(params);

    expect(findUserById.params).toEqual(params);

    expect(response).toEqual(ok({ ...findUserById.result }));
  });

  it("should return a http error status if not find the user", async () => {
    const { findUserById, sut } = makeSut();

    const error = makeAppErrorMock();

    findUserById.result = error;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(error));
  });

  it("should return a http server error if the findById method throws", async () => {
    const { findUserById, sut } = makeSut();

    jest.spyOn(findUserById, "findById").mockRejectedValue(new Error());

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
