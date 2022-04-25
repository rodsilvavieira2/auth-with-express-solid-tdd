import jwt from "jsonwebtoken";

import { AppError } from "@src/validation/protocols";

export const mockError = () => {
  throw new Error();
};

export const invalidJWT = () => jwt.sign({ data: "any_data" }, "secret");
class AppErrorMockError extends AppError {
  constructor() {
    super("any_code", "any_message");
  }
}

export function mockAppError() {
  return new AppErrorMockError();
}
