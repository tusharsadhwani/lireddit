import { GetServerSideProps } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { usePostQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

interface PostPageProps {
  id?: string;
}

const PostPage: React.FC<PostPageProps> = ({ id }) => {
  if (!id) return <p>Post not found</p>; //TODO: 404

  const postId = parseInt(id);
  const [postQuery] = usePostQuery({ variables: { id: postId } });

  const post = postQuery.data?.post;

  if (post === undefined) return <div />; //TODO: loading
  if (post === null) return <p>Post not found</p>; //TODO: 404

  return (
    <Layout>
      <Post {...post} creatorName={post.creator.username} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.params?.id },
  };
};

export default withUrqlClient(createUrqlClient)(PostPage);
