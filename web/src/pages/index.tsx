import { Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = () => {
  const [meQuery] = useMeQuery();
  const [postsQuery] = usePostsQuery();

  return (
    <Layout>
      <Text>
        {meQuery.data?.me
          ? `Logged in as ${meQuery.data.me.username}`
          : "Logged out"}
      </Text>
      <br />
      {postsQuery.data?.posts.map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
