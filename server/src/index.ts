import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import redis from "redis";
import { COOKIE_NAME, DB_NAME, TEST_DB_NAME, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import cors from "cors";
import { createSchema } from "./resolvers/graphql-schema";

const main = async () => {
  const db_name = process.env.TESTING ? TEST_DB_NAME : DB_NAME;
  const orm = await MikroORM.init(mikroConfig(db_name));
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
    schema: await createSchema(),
    context: ({ req, res }) => {
      return { req, res, em: orm.em };
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log("Server started on localhost:4000"));
};

main();
