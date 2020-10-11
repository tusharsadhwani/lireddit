import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import faker from "faker";
import { User } from "../entities/User";
import { gCall } from "../test-utils/gCall";
import { testConnection } from "../test-utils/testConnection";

let orm: MikroORM<IDatabaseDriver<Connection>>;

beforeAll(async () => {
  orm = await testConnection();
});

afterAll(async () => {
  await orm.close();
});

describe("ORM tests", () => {
  it("create and checks a test user", async () => {
    const fakeUser = {
      username: faker.internet.userName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };
    const post = orm.em.create(User, fakeUser);
    await orm.em.persistAndFlush(post);

    const fetchedUser = await orm.em.findOneOrFail(User, {
      email: fakeUser.email,
    });
    expect(fetchedUser.username).toEqual(fakeUser.username);
  });
});

describe("GraphQL tests", () => {
  const fakeUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it("create and check a test user using graphql", async () => {
    const gqlResponse = await gCall({
      source: `
      mutation register($username: String!, $email: String!, $password: String!) {
        register(
          options: { username: $username, email: $email, password: $password }
        ) {
          errors {
            field
            message
          }
          user {
            username
            email
          }
        }
      }
      `,
      variableValues: fakeUser,
      contextValue: { em: orm.em, req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data?.register.user.username).toEqual(
      fakeUser.username.toLowerCase()
    );

    const fetchedUser = await orm.em.findOneOrFail(User, {
      email: fakeUser.email.toLowerCase(),
    });
    expect(fetchedUser.username).toEqual(fakeUser.username.toLowerCase());
  });

  it("try login via username", async () => {
    const gqlResponse = await gCall({
      source: `
      mutation login($usernameOrEmail: String!, $password: String!) {
        login(options: { usernameOrEmail: $usernameOrEmail, password: $password }) {
          user {
            username
            email
          }
          errors {
            field
            message
          }
        }
      }      
      `,
      variableValues: { ...fakeUser, usernameOrEmail: fakeUser.username },
      contextValue: { em: orm.em, req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data?.login.user.username).toEqual(
      fakeUser.username.toLowerCase()
    );
  });

  it("try login via email", async () => {
    const gqlResponse = await gCall({
      source: `
      mutation login($usernameOrEmail: String!, $password: String!) {
        login(options: { usernameOrEmail: $usernameOrEmail, password: $password }) {
          user {
            username
            email
          }
          errors {
            field
            message
          }
        }
      }      
      `,
      variableValues: { ...fakeUser, usernameOrEmail: fakeUser.email },
      contextValue: { em: orm.em, req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data?.login.user.username).toEqual(
      fakeUser.username.toLowerCase()
    );
  });
});
