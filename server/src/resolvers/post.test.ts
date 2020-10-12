import faker from "faker";
import { Connection } from "typeorm";
import { Post } from "../entities/Post";
import { gCall } from "../test-utils/gCall";
import { testConnection } from "../test-utils/testConnection";

let conn: Connection;

beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

describe("check if database works", () => {
  const postTitle = faker.lorem.sentence();

  it("creates and checks a test post", async () => {
    const post = await Post.create({ title: postTitle }).save();
    expect(post.title).toEqual(postTitle);

    const fetchedPost = await Post.findOne({ title: postTitle });
    expect(fetchedPost?.title).toEqual(postTitle);
  });
});

describe("check if graphql works", () => {
  const postTitle = faker.lorem.sentence();

  let postId: number | undefined;

  it("create post and check using orm", async () => {
    await gCall({
      source: `
        mutation createPost($title: String!) {
          createPost(title: $title) {
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
      contextValue: { req: {} as any, res: {} as any },
    });

    const fetchedPost = await Post.findOne({ title: postTitle });
    expect(fetchedPost?.title).toEqual(postTitle);
    postId = fetchedPost?.id;
  });

  it("fetch posts and check new post is fetched", async () => {
    const gqlResponse = await gCall({
      source: `
        query posts {
          posts {
            id
            title
            createdAt
            updatedAt
          }
        }
      `,
      variableValues: {},
      contextValue: { req: {} as any, res: {} as any },
    });

    expect(
      (gqlResponse.data?.posts as Post[])
        .map((post) => post.title)
        .includes(postTitle)
    );
  });

  const updatedPostTitle = faker.lorem.sentence();
  it("update post", async () => {
    const gqlResponse = await gCall({
      source: `
        mutation updatePost($id: Int!, $title: String!) {
          updatePost(id: $id, title: $title) {
            post {
              id
              title
              createdAt
              updatedAt
            }
          }
        }
      `,
      variableValues: { id: postId, title: updatedPostTitle },
      contextValue: { req: {} as any, res: {} as any },
    });

    expect((gqlResponse.data?.updatePost.post as Post).title).toEqual(
      updatedPostTitle
    );
    const fetchedPost = await Post.findOne(postId);
    expect(fetchedPost?.title).toEqual(updatedPostTitle);
  });

  it("delete post", async () => {
    const gqlResponse = await gCall({
      source: `
        mutation deletePost($id: Int!) {
          deletePost(id: $id)
        }
      `,
      variableValues: { id: postId },
      contextValue: { req: {} as any, res: {} as any },
    });

    expect(gqlResponse.data?.deletePost).toEqual(true);

    const fetchedPost = await Post.findOne({
      title: updatedPostTitle,
    });
    expect(fetchedPost).toBeUndefined();
  });
});
