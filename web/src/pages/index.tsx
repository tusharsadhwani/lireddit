import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = () => {
  const [postsQuery] = usePostsQuery();

  return (
    <Layout>
      {postsQuery.data?.posts.map((post) => (
        <Post {...post} creatorName={post.creator.username} headerLink />
      ))}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
