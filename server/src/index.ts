import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import redis from "redis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import PostResolver from "./resolvers/post";
import UserResolver from "./resolvers/user";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();

  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const redisClient = redis.createClient();
  const RedisStore = connectRedis(session);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "c56800cfj2qm46890v42qmy8qv0-*9)N$MYT&*#%VM5v789wt30",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    debug: !__prod__,
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => {
      return { req, res, em: orm.em };
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log("Server started on localhost:4000"));
};

main();
