import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Post {
  @PrimaryKey()
  @Field(() => ID)
  id!: number;

  @Property({ type: "date" })
  @Field(() => String)
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  @Field(() => String)
  updatedAt = new Date();

  @Property({ type: "text" })
  @Field()
  title!: string;
}
