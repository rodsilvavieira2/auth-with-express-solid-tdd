import { config } from "dotenv";
import { container } from "tsyringe";

config();

export const JWT_CONFIG = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: "1d",
  REFRESH_TOKEN_EXPIRES_IN_DAYS: 30,
} as const;

container.register("accessTokenKey", {
  useValue: JWT_CONFIG.ACCESS_TOKEN_SECRET,
});

container.register("accessTokenExpiresIn", {
  useValue: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
});

/** Bcrypt values */

container.register("bcryptRoundsOuSalts", {
  useValue: 10,
});
