import { Text } from "@chakra-ui/core";
import React from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Layout } from "../components/Layout";

const Index = () => (
  <Layout>
    <DarkModeSwitch />
    Test
    <Text>Next ❤️ Chakra</Text>
  </Layout>
);

export default Index;
