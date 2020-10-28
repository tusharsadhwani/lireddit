import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { useMeQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Profile = () => {
  const [{ data: meData }] = useMeQuery();

  if (meData === undefined) return <div />; //TODO: loading

  if (meData.me === null) return <Layout>You are not logged in</Layout>;

  return <Layout>Logged in as {meData.me?.username}</Layout>;
};

export default withUrqlClient(createUrqlClient)(Profile);
