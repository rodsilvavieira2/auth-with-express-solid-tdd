/* eslint-disable import/no-extraneous-dependencies */
import cors from "cors";
import { Express, json } from "express";
import morgan from "morgan";

export function setUpMiddlewares(app: Express) {
  app.use(json());
  app.use(cors());

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("common"));
  }
}
