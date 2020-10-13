import faker from "faker";
import { Connection } from "typeorm";
import { User } from "../entities/User";
import { gCall } from "../test-utils/gCall";
import { testConnection } from "../test-utils/testConnection";

let conn: Connection;

beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

describe("ORM tests", () => {
  test("create and checks a test user", async () => {
    const fakeUser = {
      username: faker.internet.userName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };
    await User.create(fakeUser).save();

    const fetchedUser = await User.findOneOrFail({
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

  test("create and check a test user using graphql", async () => {
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
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data?.register.user.username).toEqual(
      fakeUser.username.toLowerCase()
    );

    const fetchedUser = await User.findOneOrFail({
      email: fakeUser.email.toLowerCase(),
    });
    expect(fetchedUser.username).toEqual(fakeUser.username.toLowerCase());
  });

  test("try login via username", async () => {
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
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data?.login.user.username).toEqual(
      fakeUser.username.toLowerCase()
    );
  });

  test("try login via email", async () => {
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
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data?.login.user.username).toEqual(
      fakeUser.username.toLowerCase()
    );
  });
});
