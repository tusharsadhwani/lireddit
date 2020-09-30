import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const mikroConfig = (dbName: string) =>
  ({
    user: "postgres",
    password: "password",
    dbName,
    type: "postgresql",
    debug: !__prod__,
    migrations: {
      path: path.join(__dirname, "./migrations"),
      pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
  } as Parameters<typeof MikroORM.init>[0]);

export default mikroConfig;
