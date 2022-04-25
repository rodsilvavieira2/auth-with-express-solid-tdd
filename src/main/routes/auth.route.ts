import { Router } from "express";
import { container } from "tsyringe";

import {
  AuthenticateController,
  CreateUserController,
  RefreshTokenResetController,
} from "@src/presentation/controllers";

import { expressRouteAdapter } from "../adapters";

const authenticationController = container.resolve(AuthenticateController);
const refreshTokenResetController = container.resolve(
  RefreshTokenResetController
);
const createUserController = container.resolve(CreateUserController);

export default (router: Router) => {
  router.post("/signup", expressRouteAdapter(createUserController));

  router.post("/login", expressRouteAdapter(authenticationController));

  router.post(
    "/refresh-token",
    expressRouteAdapter(refreshTokenResetController)
  );
};
