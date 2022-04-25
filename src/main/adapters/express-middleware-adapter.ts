import { NextFunction, Request, Response } from "express";

import { isHttpError, isHttpSuccess } from "@src/presentation/helpers/asserts";
import { IMiddleware } from "@src/presentation/protocols";

type MiddlewareResponse = { userId: string };

export function expressMiddlewareAdapter(middleware: IMiddleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers.authorization?.split(" ")[1],
      ...(req.headers || {}),
    };

    const response = await middleware.handle(request);

    if (isHttpError(response)) {
      return res.status(response.statusCode).json({
        code: response.body.code,
        message: response.body.message,
      });
    }

    if (isHttpSuccess<MiddlewareResponse>(response)) {
      Object.assign(req, { userId: response.body.userId });
    }

    return next();
  };
}
