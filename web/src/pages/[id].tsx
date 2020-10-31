import { Text } from "@chakra-ui/core";
import { GetServerSideProps } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Comment } from "../components/Comment";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import {
  useMeQuery,
  usePostQuery,
  useCommentsQuery,
} from "../generated/graphql";
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
  const [{ data: commentData }] = useCommentsQuery({
    variables: { postId: id },
  });

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
      <Text fontSize={20} mr="auto">
        Comments:
      </Text>
      {commentData?.comments.map(({ id, user, createdAt, comment }) => (
        <Comment
          key={id}
          creatorName={user.username}
          createdAt={createdAt}
          comment={comment}
        />
      ))}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { idString: context.params?.id },
  };
};

export default withUrqlClient(createUrqlClient)(PostPage);
