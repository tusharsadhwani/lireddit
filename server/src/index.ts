import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import redis from "redis";
import { COOKIE_NAME, DB_NAME, TEST_DB_NAME, __prod__ } from "./constants";
import cors from "cors";
import { createSchema } from "./resolvers/graphql-schema";
import { createConnection } from "typeorm";
import { typeormConfig } from "./typeorm.config";

import dotenv from "dotenv-safe";
dotenv.config({
  allowEmptyValues: !__prod__,
  example: ".env.EXAMPLE",
});

const main = async () => {
  const dbName = process.env.TESTING ? TEST_DB_NAME : DB_NAME;
  await createConnection(typeormConfig(dbName));

  const app = express();
  const origin = __prod__
    ? process.env.CORS_ORIGIN
    : process.env.CORS_ORIGIN_DEV;

  app.use(
    cors({
      credentials: true,
      origin: `${origin}`,
    })
  );

  const redisClient = redis.createClient();
  const RedisStore = connectRedis(session);

  app.set("trust proxy", 1);
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
        domain: __prod__ ? process.env.DOMAIN : undefined,
      },
      saveUninitialized: false,
      secret: "c56800cfj2qm46890v42qmy8qv0-*9)N$MYT&*#%VM5v789wt30",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    debug: !__prod__,
    schema: await createSchema(),
    context: ({ req, res }) => {
      return { req, res };
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log("Server started on localhost:4000"));
};

main();
