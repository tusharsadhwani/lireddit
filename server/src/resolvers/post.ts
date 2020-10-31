import { Upvote } from "../entities/Upvote";
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

  @FieldResolver(() => Int)
  async upvoteCount(@Root() post: Post): Promise<number> {
    //TODO: N+1 problem with all field resolvers
    const upvotes = await Upvote.find({ postId: post.id });
    return upvotes.reduce((sum, { isUpvote }) => (isUpvote ? ++sum : --sum), 0);
  }

  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Query(() => Boolean, { nullable: true })
  async upvoteStatus(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean | undefined> {
    if (!req.session.userId) throw new Error("Not Logged in");

    const userId = parseInt(req.session.userId);
    if (!userId) throw new Error("Invalid user id"); //TODO: middleware

    const post = await Post.findOne(postId);
    if (!post) throw new Error("Post not found");

    const upvote = await Upvote.findOne({ postId, userId });
    return upvote?.isUpvote;
  }

  @Mutation(() => Post)
  async createPost(
    @Ctx() { req }: MyContext,
    @Arg("title", () => String) title: string,
    @Arg("content", () => String) content: string,
    @Arg("imgUrl", () => String, { nullable: true }) imgUrl?: string
  ): Promise<Post> {
    //TODO: make auth middleware, and check if user with that id actually exists
    if (!req.session.userId) throw new Error("Not Logged in");

    title = title.trim();
    content = content.trim();
    if (!title) throw new Error("Title cannot be empty");
    if (!content) throw new Error("Content cannot be empty");

    //TODO: url validation
    if (imgUrl) imgUrl = imgUrl.trim();

    return Post.create({
      title,
      content,
      imgUrl,
      creatorId: parseInt(req.session.userId),
    }).save();
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("content", () => String) content: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) throw new Error("Not Logged in");

    title = title.trim();
    content = content.trim();
    if (!title) throw new Error("Title cannot be empty");
    if (!content) throw new Error("Content cannot be empty");

    const post = await Post.findOne(id);
    if (!post) throw new Error("Post not found");

    if (post.creatorId !== parseInt(req.session.userId))
      throw new Error("Unauthorized");

    post.title = title;
    post.content = content;
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

  @Mutation(() => Post)
  async upvote(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) throw new Error("Not Logged in");

    const post = await Post.findOne(postId);
    if (!post) throw new Error("Post not found");

    const userId = parseInt(req.session.userId);
    if (!userId) throw new Error("Invalid user id"); //TODO: middleware

    const previousUpvote = await Upvote.findOne({ postId, userId });
    if (previousUpvote && !previousUpvote.isUpvote) {
      previousUpvote.isUpvote = true;
      await previousUpvote.save();
    } else {
      await Upvote.create({ postId, userId, isUpvote: true }).save();
    }

    return post;
  }

  @Mutation(() => Post)
  async downvote(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) throw new Error("Not Logged in");

    const post = await Post.findOne(postId);
    if (!post) throw new Error("Post not found");

    const userId = parseInt(req.session.userId);
    if (!userId) throw new Error("Invalid user id"); //TODO: middleware

    const previousUpvote = await Upvote.findOne({ postId, userId });
    if (previousUpvote && previousUpvote.isUpvote) {
      previousUpvote.isUpvote = false;
      await previousUpvote.save();
    } else {
      await Upvote.create({ postId, userId, isUpvote: false }).save();
    }

    return post;
  }
}
