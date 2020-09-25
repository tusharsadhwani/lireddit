import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import PostResolver from "./resolvers/post";
import UserResolver from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    debug: !__prod__,
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => console.log("Server started on localhost:4000 "));
};

main();
