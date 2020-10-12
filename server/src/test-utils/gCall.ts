import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { MyContext } from "../types";
import { createSchema } from "../resolvers/graphql-schema";

interface Options {
  source: string;
  variableValues: Maybe<{
    [key: string]: any;
  }>;
  contextValue: MyContext;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
  contextValue,
}: Options) => {
  if (!schema) schema = await createSchema();

  return graphql({
    schema,
    source,
    variableValues,
    contextValue,
  });
};
