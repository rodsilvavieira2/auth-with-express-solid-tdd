import { Express, Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";

export const setUpRoutes = (app: Express) => {
  const router = Router();
  app.use("/api", router);

  readdirSync(join(__dirname, "../routes")).map(async (file) => {
    if (file.endsWith(".route.ts")) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
