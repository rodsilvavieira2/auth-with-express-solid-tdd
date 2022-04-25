import { Router } from "express";
import { container } from "tsyringe";

import {
  expressRouteAdapter,
  expressMiddlewareAdapter,
} from "@src/main/adapters";
import {
  DeleteUserController,
  FindUserByIdController,
  UpdateUserController,
} from "@src/presentation/controllers/user";
import { AuthMiddleware } from "@src/presentation/middleware";

const updateUserController = container.resolve(UpdateUserController);
const deleteUserController = container.resolve(DeleteUserController);
const findUserByIdController = container.resolve(FindUserByIdController);

const authMiddleware = container.resolve(AuthMiddleware);

export default (router: Router) => {
  router.patch(
    "/users/:userId",
    expressMiddlewareAdapter(authMiddleware),
    expressRouteAdapter(updateUserController)
  );

  router.delete(
    "/users/:userId",
    expressMiddlewareAdapter(authMiddleware),
    expressRouteAdapter(deleteUserController)
  );

  router.get(
    "/users/:userId",
    expressMiddlewareAdapter(authMiddleware),
    expressRouteAdapter(findUserByIdController)
  );
};
