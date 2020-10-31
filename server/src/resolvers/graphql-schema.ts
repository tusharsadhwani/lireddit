import { buildSchema } from "type-graphql";
import CommentResolver from "./comment";
import PostResolver from "./post";
import UserResolver from "./user";

export const createSchema = () =>
  buildSchema({
    resolvers: [PostResolver, UserResolver, CommentResolver],
    validate: false,
  });
