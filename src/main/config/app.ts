import dotenv from "dotenv";
import express, { Express } from "express";

import "@src/main/map-tsyringe-instancies";
import { setUpMiddlewares } from "./middlewares";
import { setUpRoutes } from "./route";
import { setUpSwagger } from "./swagger";

dotenv.config();

export async function setUpApp(): Promise<Express> {
  const app = express();

  setUpMiddlewares(app);
  setUpRoutes(app);

  if (process.env.NODE_ENV !== "test") {
    setUpSwagger(app);
  }

  return app;
}
