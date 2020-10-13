import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { MyContext } from "../types";

@Resolver(Post)
export default class PostResolver {
  @FieldResolver(() => User)
  creator(@Root() post: Post) {
    return User.findOne(post.creatorId);
  }

  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) throw new Error("Not Logged in");
    if (!title) {
      throw new Error("Title cannot be empty");
    }
    return Post.create({
      title,
      creatorId: parseInt(req.session.userId),
    }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) throw new Error("Not Logged in");
    if (!title) throw new Error("Title must not be empty");

    const post = await Post.findOne(id);
    if (!post) throw new Error("Post not found");

    if (post.creatorId !== parseInt(req.session.userId))
      throw new Error("Unauthorized");

    post.title = title;
    return post.save();
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    if (!req.session.userId) throw new Error("Not Logged in");

    const post = await Post.findOne(id);
    if (!post) return false;

    if (post.creatorId !== parseInt(req.session.userId))
      throw new Error("Unauthorized");

    await post.remove();
    return true;
  }
}
