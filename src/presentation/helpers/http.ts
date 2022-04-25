import { AppError } from "@src/validation/protocols";

import { HttpResponse } from "../protocols";

export function badRequest(appError: AppError): HttpResponse {
  return {
    statusCode: 400,
    body: {
      message: appError.message,
      code: appError.code,
    },
  };
}

export function serverError(): HttpResponse {
  return {
    statusCode: 500,
    body: {
      message: "internal server error",
      code: "internal-server-error",
    },
  };
}

export function authentication(appError: AppError): HttpResponse {
  return {
    statusCode: 401,
    body: {
      code: appError.code,
      message: appError.message,
    },
  };
}

export function created(body?: unknown): HttpResponse {
  return {
    statusCode: 201,
    body,
  };
}

export function ok(body?: unknown): HttpResponse {
  return {
    statusCode: 200,
    body,
  };
}

export function noContent(): HttpResponse {
  return {
    statusCode: 204,
    body: null,
  };
}

export function notFound(error: AppError): HttpResponse {
  return {
    statusCode: 404,
    body: {
      code: error.code,
      message: error.message,
    },
  };
}

export function makeHttpRespFromError({
  statusCode,
  message,
  code,
}: AppError): HttpResponse {
  return {
    statusCode,
    body: {
      code,
      message,
    },
  };
}
