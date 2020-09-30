import { buildSchema } from "type-graphql";
import PostResolver from "./post";
import UserResolver from "./user";

export const createSchema = () =>
  buildSchema({
    resolvers: [PostResolver, UserResolver],
    validate: false,
  });
