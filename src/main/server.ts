import { prismaClient } from "@src/infra/db/postgres/client";

const PORT = process.env.PORT || 8080;

prismaClient.$connect().then(async () => {
  const { setUpApp } = await import("@src/main/config/app");

  const app = await setUpApp();

  app.listen(PORT, () => console.log(`server on port ${PORT}`));
});
