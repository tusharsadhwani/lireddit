import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @PrimaryColumn()
  @Field(() => Int)
  userId!: number;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "CASCADE",
  })
  @Field()
  user!: User;

  @PrimaryColumn()
  @Field(() => Int)
  postId!: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE",
  })
  @Field(() => Post)
  post!: Post;

  @Column()
  @Field()
  comment!: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt!: Date;
}
