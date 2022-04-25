import jwt from "jsonwebtoken";

import { mockError } from "@src/mocks/util";

import { JwtFacade } from "./jwt-facade";

const ACCESS_TOKEN_KEY = "any_access_token_key";
const ACCESS_TOKEN_EXPIRES_IN = "any_access_token_expires_in";

function makeSut() {
  const sut = new JwtFacade(ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRES_IN);

  return {
    sut,
  };
}

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
}));

describe("JwtFacade", () => {
  it("should call jwt.sign with correctly params", () => {
    const { sut } = makeSut();

    const sub = "any_sub";
    const payload = { email: "any_email", name: "any_name" };

    sut.create(sub, payload);

    expect(jwt.sign).toBeCalledWith(payload, ACCESS_TOKEN_KEY, {
      subject: sub,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  });

  it("should call jwt.verify with correctly params", () => {
    const { sut } = makeSut();

    const token = "any_token";

    sut.verify(token);

    expect(jwt.verify).toBeCalledWith(token, ACCESS_TOKEN_KEY);
  });

  it("should return the jwt.sign return value", () => {
    const { sut } = makeSut();

    const sub = "any_sub";
    const payload = { email: "any_email", name: "any_name" };
    const token = "any_token";

    jest.spyOn(jwt, "sign").mockReturnValue(token as any);

    const result = sut.create(sub, payload);

    expect(result).toBe(token);
  });

  it("should return true if the jwt.verify accept the jwt", () => {
    const { sut } = makeSut();

    const token = "any_token";

    const result = sut.verify(token);

    expect(result).toBe(true);
  });

  it("should return false if the jwt.verify not accept the jwt and throws a error", () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, "verify").mockImplementation(mockError);

    const token = "any_token";

    const result = sut.verify(token);

    expect(result).toBe(false);
  });

  it("should throw if jwt.sign throws", () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, "sign").mockImplementation(mockError);

    const sub = "any_sub";
    const payload = { email: "any_email", name: "any_name" };

    expect(() => sut.create(sub, payload)).toThrow();
  });

  it("should call jwt.decode witch correctly params", () => {
    const { sut } = makeSut();

    const token = "any_token";

    const decodeSpy = jest.spyOn(jwt, "decode");

    sut.decode(token);

    expect(decodeSpy).toBeCalledWith(token);
  });

  it("should return the return value of jwt.decode", () => {
    const { sut } = makeSut();

    const expectedResult = { data: "any_data" };

    const token = "any_token";

    jest.spyOn(jwt, "decode").mockReturnValue(expectedResult);

    const result = sut.decode(token);

    expect(result).toEqual(expectedResult);
  });

  it("should throw if jwt.sign throws", () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, "decode").mockImplementation(mockError);

    const token = "any_token";

    expect(() => sut.decode(token)).toThrow();
  });
});
