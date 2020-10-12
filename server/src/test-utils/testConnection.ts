import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { createConnection } from "typeorm";
import { TEST_DB_NAME } from "../constants";

export const testConnection = async (reset: boolean = false) => {
  const conn = await createConnection({
    type: "postgres",
    database: TEST_DB_NAME,
    username: "postgres",
    password: "password",
    synchronize: true,
    dropSchema: reset,
    entities: [User, Post],
  });
  return conn;
};
