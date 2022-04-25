/* eslint-disable import/no-extraneous-dependencies */
import dotenv from "dotenv";
import NodeEnvironment from "jest-environment-node";
import { exec } from "node:child_process";
import crypto from "node:crypto";
import util from "node:util";
import { Client } from "pg";

import type { Config } from "@jest/types";

dotenv.config({ path: ".env.test" });

const execSync = util.promisify(exec);

const prismaBinary = "./node_modules/.bin/prisma";

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: Config.ProjectConfig) {
    super(config);

    const dbUser = process.env.TEST_DATABASE_USER;
    const dbPass = process.env.TEST_DATABASE_PASS;
    const dbHost = process.env.TEST_DATABASE_HOST;
    const dbPort = process.env.TEST_DATABASE_PORT;
    const dbName = process.env.TEST_DATABASE_NAME;

    this.schema = `test_${crypto.randomUUID()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`${prismaBinary} migrate dev`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
