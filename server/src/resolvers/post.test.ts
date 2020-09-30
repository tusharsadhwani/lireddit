import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { Post } from "../entities/Post";
import { gCall } from "../test-utils/gCall";
import { testConnection } from "../test-utils/testConnection";

let orm: MikroORM<IDatabaseDriver<Connection>>;

beforeAll(async () => {
  orm = await testConnection();
});

afterAll(async () => {
  await orm.close();
});

describe("check if database works", () => {
  const postTitle = "Test post";

  it("creates a test post", async () => {
    const post = orm.em.create(Post, { title: postTitle });
    expect(post.title).toEqual(postTitle);
    await orm.em.persistAndFlush(post);
  });

  it("checks if the post persisted", async () => {
    const fetchedPost = await orm.em.findOne(Post, { title: postTitle });
    expect(fetchedPost?.title).toEqual(postTitle);
  });
});

describe("check if graphql works", () => {
  const postTitle = "Test post 2";

  it("creates a test post using graphql", async () => {
    const result = await gCall({
      source: `
        mutation createPost($title: String!) {
          createPost(title: $title) {
            error
            post {
              id
              title
              createdAt
              updatedAt
            }
          }
        }
      `,
      variableValues: { title: postTitle },
      contextValue: { em: orm.em, req: {} as any, res: {} as any },
    });
    console.log("data: ", result.data);
    console.log("errors: ", result.errors);
  });

  it("checks if the post persisted", async () => {
    const fetchedPost = await orm.em.findOne(Post, { title: postTitle });
    expect(fetchedPost?.title).toEqual(postTitle);
  });
});
