import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  posts: Array<Post>;
  post?: Maybe<Post>;
  upvoteStatus?: Maybe<Scalars['Boolean']>;
  users: Array<User>;
  user?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryUpvoteStatusArgs = {
  postId: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  imgUrl?: Maybe<Scalars['String']>;
  creatorId: Scalars['Int'];
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  upvoteCount: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  posts: Post;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  updatePost: Post;
  deletePost: Scalars['Boolean'];
  upvote: Post;
  downvote: Post;
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  imgUrl?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationUpvoteArgs = {
  postId: Scalars['Int'];
};


export type MutationDownvoteArgs = {
  postId: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  options: LoginInput;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type LoginFormDataFragment = (
  { __typename?: 'UserResponse' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserDataFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & Pick<FieldError, 'field' | 'message'>
  )>> }
);

export type UserDataFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email'>
);

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  content: Scalars['String'];
  imgUrl?: Maybe<Scalars['String']>;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'content' | 'imgUrl'>
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type DownvoteMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type DownvoteMutation = (
  { __typename?: 'Mutation' }
  & { downvote: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'upvoteCount'>
  ) }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & LoginFormDataFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & LoginFormDataFragment
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'content' | 'createdAt' | 'updatedAt'>
  ) }
);

export type UpvoteMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type UpvoteMutation = (
  { __typename?: 'Mutation' }
  & { upvote: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'upvoteCount'>
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserDataFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'content' | 'upvoteCount' | 'imgUrl'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'content' | 'imgUrl' | 'upvoteCount' | 'createdAt' | 'updatedAt'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type UpvoteStatusQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type UpvoteStatusQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'upvoteStatus'>
);

export const UserDataFragmentDoc = gql`
    fragment UserData on User {
  id
  username
  email
}
    `;
export const LoginFormDataFragmentDoc = gql`
    fragment LoginFormData on UserResponse {
  user {
    ...UserData
  }
  errors {
    field
    message
  }
}
    ${UserDataFragmentDoc}`;
export const CreatePostDocument = gql`
    mutation createPost($title: String!, $content: String!, $imgUrl: String) {
  createPost(title: $title, content: $content, imgUrl: $imgUrl) {
    id
    title
    content
    imgUrl
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation deletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const DownvoteDocument = gql`
    mutation downvote($postId: Int!) {
  downvote(postId: $postId) {
    id
    title
    upvoteCount
  }
}
    `;

export function useDownvoteMutation() {
  return Urql.useMutation<DownvoteMutation, DownvoteMutationVariables>(DownvoteDocument);
};
export const LoginDocument = gql`
    mutation login($usernameOrEmail: String!, $password: String!) {
  login(options: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    ...LoginFormData
  }
}
    ${LoginFormDataFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation register($username: String!, $email: String!, $password: String!) {
  register(options: {username: $username, email: $email, password: $password}) {
    ...LoginFormData
  }
}
    ${LoginFormDataFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation updatePost($id: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, title: $title, content: $content) {
    id
    title
    content
    createdAt
    updatedAt
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const UpvoteDocument = gql`
    mutation upvote($postId: Int!) {
  upvote(postId: $postId) {
    id
    title
    upvoteCount
  }
}
    `;

export function useUpvoteMutation() {
  return Urql.useMutation<UpvoteMutation, UpvoteMutationVariables>(UpvoteDocument);
};
export const MeDocument = gql`
    query me {
  me {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query post($id: Int!) {
  post(id: $id) {
    id
    title
    content
    upvoteCount
    imgUrl
    creator {
      id
      username
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    title
    content
    imgUrl
    upvoteCount
    creator {
      id
      username
    }
    createdAt
    updatedAt
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const UpvoteStatusDocument = gql`
    query upvoteStatus($postId: Int!) {
  upvoteStatus(postId: $postId)
}
    `;

export function useUpvoteStatusQuery(options: Omit<Urql.UseQueryArgs<UpvoteStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UpvoteStatusQuery>({ query: UpvoteStatusDocument, ...options });
};