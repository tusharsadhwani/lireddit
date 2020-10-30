import { GetServerSideProps } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { useMeQuery, usePostQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

interface PostPageProps {
  idString?: string;
}

const PostPage: React.FC<PostPageProps> = ({ idString }) => {
  if (!idString) return <p>Post not found</p>; //TODO: 404
  const id = parseInt(idString);
  if (!id) return <p>Post not found</p>; //TODO: 404

  const [postQuery] = usePostQuery({ variables: { id } });
  const [{ data: meData }] = useMeQuery();

  const post = postQuery.data?.post;

  if (post === undefined) return <div />; //TODO: loading
  if (post === null) return <p>Post not found</p>; //TODO: 404

  return (
    <Layout>
      <Post
        {...post}
        creatorName={post.creator.username}
        userIsOwner={!!meData?.me && meData?.me?.id === post.creator.id}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { idString: context.params?.id },
  };
};

export default withUrqlClient(createUrqlClient)(PostPage);
