import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@ObjectType()
class PostResponse {
  @Field({ nullable: true })
  post?: Post;

  @Field({ nullable: true })
  error?: String;
}

@Resolver(Post)
export default class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => PostResponse)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<PostResponse> {
    if (!title) {
      return { error: "Title cannot be empty" };
    }
    const newPost = em.create(Post, { title });
    await em.persistAndFlush(newPost);
    return { post: newPost };
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<PostResponse> {
    const post = await em.findOne(Post, { id });
    if (!post) return { error: "Post not found" };

    if (!title) return { error: "Title must not be empty" };

    post.title = title;
    await em.persistAndFlush(post);
    return { post };
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const post = await em.findOne(Post, { id });
    console.log(post);

    if (!post) return false;

    await em.nativeDelete(Post, { id });
    //TODO: The post doesn't show up in searches anymore, but it can still be
    // edited or found by ID
    return true;
  }
}
