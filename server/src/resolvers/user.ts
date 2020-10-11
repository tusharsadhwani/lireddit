import argon2 from "argon2";
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
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { MyContext } from "../types";

const EMAIL_REGEX = /^[\w\.]+@[\w\.]+$/;
const USERNAME_REGEX = /^[\w\.]+$/;
@InputType()
class RegisterInput {
  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field()
  password!: string;
}

@InputType()
class LoginInput {
  @Field()
  usernameOrEmail!: string;

  @Field()
  password!: string;
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
  field!: keyof RegisterInput | keyof LoginInput;

  @Field()
  message!: string;
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

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (req.session.userId) {
      return em.findOne(User, { id: req.session.userId });
    }
    return null;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { username, email, password } = options;
    const errors: FieldError[] = [];

    if (username.length < 2)
      errors.push({
        field: "username",
        message: "Username should be at least 2 characters",
      });
    if (!USERNAME_REGEX.test(username))
      errors.push({
        field: "username",
        message: "Username must only contain A-Z, a-z, 0-9 and _",
      });
    if (!EMAIL_REGEX.test(email))
      errors.push({
        field: "email",
        message: "Invalid email",
      });
    if (password.length < 6)
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });

    if (errors.length > 0) {
      return { errors };
    }

    const existingUser = await em.findOne(User, {
      username: username.toLowerCase(),
    });
    if (existingUser) {
      errors.push({ field: "username", message: "Username already taken" });
      return { errors };
    }

    const existingEmail = await em.findOne(User, {
      email: email.toLowerCase(),
    });
    if (existingEmail) {
      errors.push({ field: "email", message: "Email already in use" });
      return { errors };
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await em.persistAndFlush(newUser);

    req.session.userId = newUser.id;

    return {
      user: newUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { usernameOrEmail, password } = options;
    const errors: FieldError[] = [];

    const isEmail = usernameOrEmail.includes("@");

    if (isEmail) {
      const email = usernameOrEmail;
      if (!EMAIL_REGEX.test(email))
        errors.push({
          field: "usernameOrEmail",
          message: "Invalid email",
        });
    } else {
      const username = usernameOrEmail;
      if (username.length < 2)
        errors.push({
          field: "usernameOrEmail",
          message: "Username should be at least 2 characters",
        });
      if (!USERNAME_REGEX.test(username))
        errors.push({
          field: "usernameOrEmail",
          message: "Username must only contain A-Z, a-z, 0-9 and _",
        });
    }

    if (password.length < 6)
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });

    if (errors.length > 0) {
      return { errors };
    }

    const user = await em.findOne(
      User,
      isEmail
        ? { email: usernameOrEmail.toLowerCase() }
        : { username: usernameOrEmail.toLowerCase() }
    );
    if (!user) {
      errors.push({
        field: "usernameOrEmail",
        message: "Username or email not found",
      });
      return { errors };
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid)
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) resolve(false);

        resolve(true);
      })
    );
  }
}
