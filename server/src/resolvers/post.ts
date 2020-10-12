import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Post } from "../entities/Post";

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
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => PostResponse)
  async createPost(
    @Arg("title", () => String) title: string
  ): Promise<PostResponse> {
    if (!title) {
      return { error: "Title cannot be empty" };
    }
    const newPost = await Post.create({ title }).save();
    return { post: newPost };
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string
  ): Promise<PostResponse> {
    if (!title) return { error: "Title must not be empty" };

    const post = await Post.findOne(id);
    if (!post) return { error: "Post not found" };

    post.title = title;
    await post.save();
    return { post };
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    const post = await Post.findOne(id);
    if (!post) return false;

    await post.remove();
    return true;
  }
}
