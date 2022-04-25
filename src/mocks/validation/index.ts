import { AppError } from "@src/validation/protocols";

class GenericAppError extends AppError {
  constructor() {
    super("any_code", "any_message");
  }
}

export function makeAppErrorMock(): AppError {
  return new GenericAppError();
}
