import { Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = () => {
  const [postsQuery] = usePostsQuery();

  return (
    <Layout>
      {postsQuery.data?.posts.map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
