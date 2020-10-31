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
  const postContent = faker.lorem.sentences();
  const postImgUrl = faker.image.imageUrl();

  const fakeUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let userId: number;

  test("register and login", async () => {
    const gqlResponse = await gCall({
      source: REGISTER_MUTATION,
      variableValues: fakeUser,
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    const user = gqlResponse.data?.register.user as User;
    expect(user.username).toEqual(fakeUser.username.toLowerCase());
    expect(user.id).toBeDefined();
    userId = user.id;
  });

  let postId: number | undefined;

  test("create post and check using orm", async () => {
    const gqlResponse = await gCall({
      source: CREATE_POST_MUTATION,
      variableValues: {
        title: postTitle,
        content: postContent,
        imgUrl: postImgUrl,
      },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.errors).toBeUndefined();

    const fetchedPost = await Post.findOne({ title: postTitle });
    expect(fetchedPost?.title).toEqual(postTitle);
    expect(fetchedPost?.content).toEqual(postContent);
    expect(fetchedPost?.imgUrl).toEqual(postImgUrl);
    expect(fetchedPost?.id).toBeDefined();
    postId = fetchedPost?.id;
  });

  test("fetch posts and check if new post is fetched", async () => {
    const gqlResponse = await gCall({
      source: POSTS_QUERY,
      variableValues: {},
      contextValue: { req: {} as any, res: {} as any },
    });
    expect(gqlResponse.errors).toBeUndefined();

    const posts = gqlResponse.data?.posts as Post[];
    const post = posts.find((post) => post.title === postTitle);
    expect(post).toBeDefined();
    expect(post?.creator.id).toEqual(userId);
    expect(post?.content).toEqual(postContent);
  });

  const updatedPostTitle = faker.lorem.sentence();
  const updatedPostContent = faker.lorem.sentences();
  test("update post", async () => {
    const gqlResponse = await gCall({
      source: UPDATE_POST_MUTATION,
      variableValues: {
        id: postId,
        title: updatedPostTitle,
        content: updatedPostContent,
      },
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
  const newPostContent = faker.lorem.sentences();
  test("Errors in updating or deleting when logged out", async () => {
    let gqlResponse = await gCall({
      source: CREATE_POST_MUTATION,
      variableValues: { title: newPostTitle, content: newPostContent },
      contextValue: { req: {} as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: UPDATE_POST_MUTATION,
      variableValues: {
        id: postId,
        title: newPostTitle,
        content: newPostContent,
      },
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: DELETE_POST_MUTATION,
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
      source: REGISTER_MUTATION,
      variableValues: fakeUser,
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    const user = gqlResponse.data?.register.user as User;
    expect(user.username).toEqual(fakeUser.username.toLowerCase());
    userId = user.id;

    gqlResponse = await gCall({
      source: CREATE_POST_MUTATION,
      variableValues: { title: newPostTitle },
      contextValue: { req: { session: {} } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: UPDATE_POST_MUTATION,
      variableValues: { id: postId, title: newPostTitle },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();

    gqlResponse = await gCall({
      source: DELETE_POST_MUTATION,
      variableValues: { id: postId },
      contextValue: { req: { session: { userId } } as any, res: {} as any },
    });
    expect(gqlResponse.data).toBeFalsy();
    expect(gqlResponse.errors).toBeDefined();
  });

  test("delete post", async () => {
    const gqlResponse = await gCall({
      source: DELETE_POST_MUTATION,
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

const REGISTER_MUTATION = `
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
}`;

const CREATE_POST_MUTATION = `
mutation createPost($title: String!, $content: String!, $imgUrl: String) {
  createPost(title: $title, content: $content, imgUrl: $imgUrl) {
    id
    title
    content
    imgUrl
    createdAt
    updatedAt
  }
}`;

const POSTS_QUERY = `
query posts {
  posts {
    id
    title
    content
    imgUrl
    createdAt
    updatedAt
    creator {
      id
      username
    }
  }
}`;

const UPDATE_POST_MUTATION = `
mutation updatePost($id: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, title: $title, content: $content) {
    id
    title
    content
    createdAt
    updatedAt
  }
}`;

const DELETE_POST_MUTATION = `
mutation deletePost($id: Int!) {
  deletePost(id: $id)
}`;
