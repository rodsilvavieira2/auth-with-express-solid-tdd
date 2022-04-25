import { AppError } from "@src/validation/protocols";

export type HttpResponse<T = unknown> = {
  statusCode: number;
  body: T;
};

export type HttpError = {
  statusCode: number;
  body: {
    code: string;
    message: string;
  };
};

export interface IController<P = unknown, R = unknown> {
  handle(request: P): Promise<HttpResponse<R>>;
}

export interface IMiddleware<T = unknown, R = unknown> {
  handle(request: T): Promise<HttpResponse<R>>;
}

export interface IValidation {
  validate(input: unknown): AppError | null;
}
