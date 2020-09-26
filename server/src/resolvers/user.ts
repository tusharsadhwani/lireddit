import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field: keyof UsernamePasswordInput;

  @Field()
  message: string;
}

@Resolver(User)
export default class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;
    const errors: FieldError[] = [];

    if (username.length < 2) {
      errors.push({
        field: "username",
        message: "Username should be at least 2 characters",
      });
      return { errors };
    }

    const existingUser = await em.findOne(User, {
      username: username.toLowerCase(),
    });
    if (existingUser) {
      errors.push({ field: "username", message: "Username already taken" });
    }
    if (!/^\w+$/.test(username)) {
      errors.push({
        field: "username",
        message: "Username must only contain A-Z, a-z, 0-9 and _",
      });
    }
    if (password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (errors.length > 0) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, {
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    await em.persistAndFlush(newUser);

    return {
      user: newUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;
    const errors: FieldError[] = [];

    if (username.length < 2) {
      errors.push({
        field: "username",
        message: "Username should be at least 2 characters",
      });
      return { errors };
    }

    const existingUser = await em.findOne(User, {
      username: username.toLowerCase(),
    });
    if (!existingUser) {
      errors.push({ field: "username", message: "Username not found" });
      return { errors };
    }

    if (!/^\w+$/.test(username)) {
      errors.push({
        field: "username",
        message: "Username must only contain A-Z, a-z, 0-9 and _",
      });
    }
    if (password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (errors.length > 0) {
      return { errors };
    }

    const isValid = await argon2.verify(existingUser.password, password);

    if (!isValid)
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };

    return {
      user: existingUser,
    };
  }
}
