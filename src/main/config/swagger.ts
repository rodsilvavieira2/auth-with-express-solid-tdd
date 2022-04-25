import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import ymljs from "yamljs";

export function setUpSwagger(app: Express) {
  const swaggerDocument = ymljs.load(`${__dirname}/../docs/swagger.yml`);
  app.use("/", swaggerUi.serve);
  app.get("/", swaggerUi.setup(swaggerDocument));
}
