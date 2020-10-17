import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { usePostQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const PostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const postId = parseInt(id as string);

  const [postQuery] = usePostQuery({ variables: { id: postId } });

  const post = postQuery.data?.post;

  if (post === undefined) return <div />;
  if (post === null) return <p>Post not found</p>;

  return (
    <Layout>
      <Post {...post} creatorName={post.creator.username} />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(PostPage);
