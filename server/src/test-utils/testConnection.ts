import { MikroORM } from "@mikro-orm/core";
import { TEST_DB_NAME } from "../constants";
import mikroConfig from "../mikro-orm.config";

export const testConnection = async (reset: boolean = false) => {
  const orm = await MikroORM.init(mikroConfig(TEST_DB_NAME));

  if (reset) {
    const schemaGenerator = orm.getSchemaGenerator();
    await schemaGenerator.dropSchema();
    await schemaGenerator.createSchema();
  }

  return orm;
};
