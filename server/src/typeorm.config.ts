import { ConnectionOptions } from "typeorm";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { Upvote } from "./entities/Upvote";
import { User } from "./entities/User";

export const typeormConfig = (
  dbName: string,
  reset: boolean = false
): ConnectionOptions => ({
  type: "postgres" as const,
  database: dbName,
  username: "postgres",
  password: "password",
  synchronize: !__prod__,
  dropSchema: reset,
  entities: [User, Post, Upvote],
  logging: !__prod__,
});
