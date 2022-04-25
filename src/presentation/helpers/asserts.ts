import { AppError } from "@src/validation/protocols";

import { HttpResponse, HttpError } from "../protocols";

export function isAppError(obj: unknown): obj is AppError {
  return obj instanceof AppError;
}

export function isHttpError(
  httpResponse: HttpResponse
): httpResponse is HttpError {
  return httpResponse.statusCode >= 400;
}

export function isHttpSuccess<T = unknown>(
  httpResponse: HttpResponse
): httpResponse is HttpResponse<T> {
  return httpResponse.statusCode < 400;
}
