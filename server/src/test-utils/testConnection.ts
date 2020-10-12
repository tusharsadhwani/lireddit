import { createConnection } from "typeorm";
import { TEST_DB_NAME } from "../constants";
import { typeormConfig } from "../typeorm.config";

export const testConnection = async (reset: boolean = false) => {
  const conn = await createConnection(typeormConfig(TEST_DB_NAME, reset));
  return conn;
};
