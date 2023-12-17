import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "~/env";
import * as schema from "./schema";

export const db = drizzle(
  new Pool({
    connectionString: env.DATABASE_URL,
  }),
  { schema },
);

export type dbType = typeof db;
