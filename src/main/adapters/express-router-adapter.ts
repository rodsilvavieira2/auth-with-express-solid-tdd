import { Request, Response } from "express";

import { isHttpError } from "@src/presentation/helpers/asserts";
import { IController } from "@src/presentation/protocols";

export function expressRouteAdapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      ...(req.query || {}),
      req_userId: req?.userId,
    };

    const response = await controller.handle(request);

    if (isHttpError(response)) {
      return res.status(response.statusCode).json({
        code: response.body.code,
        message: response.body.message,
      });
    }

    return res.status(response.statusCode).json(response.body);
  };
}
