import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  title!: string;

  @Column()
  @Field()
  content!: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imgUrl!: string;

  @Column()
  @Field(() => Int)
  creatorId!: number;

  @ManyToOne(() => User, (creator) => creator.posts)
  @Field(() => User)
  creator!: User;

  @CreateDateColumn()
  @Field(() => String)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt!: Date;
}
