import { withUrqlClient } from "next-urql";
import React from "react";
import { CreatePostForm } from "../components/CreatePostForm";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = () => {
  const [postsQuery] = usePostsQuery();
  const [{ data: meData }] = useMeQuery();

  return (
    <Layout>
      {meData?.me ? <CreatePostForm /> : null}
      {postsQuery.data?.posts.map((post) => (
        <Post
          key={post.id}
          creatorName={post.creator.username}
          {...post}
          headerLink
        />
      ))}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
