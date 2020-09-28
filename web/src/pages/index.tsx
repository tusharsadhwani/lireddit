import { Text } from "@chakra-ui/core";
import { Layout } from "../components/Layout";
import { useMeQuery } from "../generated/graphql";

const Index = () => {
  const [meQuery] = useMeQuery();

  return (
    <Layout>
      <Text>
        {meQuery.data?.me
          ? `Logged in as ${meQuery.data.me.username}`
          : "logged out"}
      </Text>
    </Layout>
  );
};

export default Index;
