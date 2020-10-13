import faker from "faker";
import { Connection } from "typeorm";
import { Post } from "../entities/Post";
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

describe("GraphQL tests", () => {
  const postTitle = faker.lorem.sentence();

  const fakeUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let userId: number | undefined;

  test("register and login", async () => {
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
            id
            username
            email
          }
        }
      }
      `,
      variableValues: fakeUser,
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    const user = gqlResponse.data?.register.user as User;
    expect(user.username).toEqual(fakeUser.username.toLowerCase());
    userId = user.id;
  });

  let postId: number | undefined;

  test("create post and check using orm", async () => {
    const gqlResponse = await gCall({
      source: `
        mutation createPost($title: String!) {
          createPost(title: $title) {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: { title: postTitle },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.errors).toBeUndefined();

    const fetchedPost = await Post.findOne({ title: postTitle });
    expect(fetchedPost?.title).toEqual(postTitle);
    postId = fetchedPost?.id;
  });

  test("fetch posts and check if new post is fetched", async () => {
    const gqlResponse = await gCall({
      source: `
        query posts {
          posts {
            id
            title
            createdAt
            updatedAt
            creator {
              id
              username
            }
          }
        }
      `,
      variableValues: {},
      contextValue: { req: {} as any, res: {} as any },
    });
    expect(gqlResponse.errors).toBeUndefined();

    const posts = gqlResponse.data?.posts as Post[];
    const post = posts.find((post) => post.title === postTitle);
    expect(post).toBeDefined();
    expect(post?.creator.id).toEqual(userId);
  });

  const updatedPostTitle = faker.lorem.sentence();
  test("update post", async () => {
    const gqlResponse = await gCall({
      source: `
        mutation updatePost($id: Int!, $title: String!) {
          updatePost(id: $id, title: $title) {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: { id: postId, title: updatedPostTitle },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.errors).toBeUndefined();

    expect((gqlResponse.data?.updatePost as Post).title).toEqual(
      updatedPostTitle
    );
    const fetchedPost = await Post.findOne(postId);
    expect(fetchedPost?.title).toEqual(updatedPostTitle);
  });

  const newPostTitle = faker.lorem.sentence();
  test("Errors in updating or deleting when logged out", async () => {
    let gqlResponse = await gCall({
      source: `
        mutation createPost($title: String!) {
          createPost(title: $title) {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: { title: newPostTitle },
      contextValue: { req: {} as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: `
        mutation updatePost($id: Int!, $title: String!) {
          updatePost(id: $id, title: $title) {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: { id: postId, title: newPostTitle },
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();
    console.log(gqlResponse);

    gqlResponse = await gCall({
      source: `
        mutation deletePost($id: Int!) {
          deletePost(id: $id)
        }
      `,
      variableValues: { id: postId },
      contextValue: { req: {} as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();
  });

  test("Errors in updating or deleting when not your post", async () => {
    const fakeUser = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    let userId: number | undefined;

    let gqlResponse = await gCall({
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
              id
              username
              email
            }
          }
        }
        `,
      variableValues: fakeUser,
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    const user = gqlResponse.data?.register.user as User;
    expect(user.username).toEqual(fakeUser.username.toLowerCase());
    userId = user.id;

    gqlResponse = await gCall({
      source: `
        mutation createPost($title: String!) {
          createPost(title: $title) {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: { title: newPostTitle },
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: `
        mutation updatePost($id: Int!, $title: String!) {
          updatePost(id: $id, title: $title) {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: { id: postId, title: newPostTitle },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: `
        mutation deletePost($id: Int!) {
          deletePost(id: $id)
        }
      `,
      variableValues: { id: postId },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();
  });

  test("delete post", async () => {
    const gqlResponse = await gCall({
      source: `
        mutation deletePost($id: Int!) {
          deletePost(id: $id)
        }
      `,
      variableValues: { id: postId },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.errors).toBeUndefined();
    expect(gqlResponse.data?.deletePost).toEqual(true);

    const fetchedPost = await Post.findOne({
      title: updatedPostTitle,
    });
    expect(fetchedPost).toBeUndefined();
  });
});
