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
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { MyContext } from "../types";

@Resolver(Comment)
export default class CommentResolver {
  @FieldResolver(() => Post)
  post(@Root() comment: Comment) {
    return Post.findOne(comment.postId);
  }

  @FieldResolver(() => User)
  user(@Root() comment: Comment) {
    return User.findOne(comment.userId);
  }

  @Query(() => [Comment])
  async comments(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<Comment[]> {
    if (!req.session.userId) throw new Error("Not Logged in");

    const userId = parseInt(req.session.userId);
    if (!userId) throw new Error("Invalid user id"); //TODO: middleware

    const post = await Post.findOne(postId);
    if (!post) throw new Error("Post not found");

    return Comment.find({
      where: { postId, userId },
      order: { createdAt: "DESC" },
      take: 10,
    });
  }

  @Mutation(() => Comment)
  async comment(
    @Arg("postId", () => Int) postId: number,
    @Arg("comment", () => String) comment: string,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    if (!req.session.userId) throw new Error("Not Logged in");

    const post = await Post.findOne(postId);
    if (!post) throw new Error("Post not found");

    const userId = parseInt(req.session.userId);
    if (!userId) throw new Error("Invalid user id"); //TODO: middleware

    return Comment.create({ postId, userId, comment }).save();
  }
}
