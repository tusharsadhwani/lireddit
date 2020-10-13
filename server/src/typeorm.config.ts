import { ConnectionOptions } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const typeormConfig = (
  dbName: string,
  reset: boolean = false
): ConnectionOptions => ({
  type: "postgres" as const,
  database: dbName,
  username: "postgres",
  password: "password",
  synchronize: true,
  dropSchema: reset,
  entities: [User, Post],
  logging: true,
});
