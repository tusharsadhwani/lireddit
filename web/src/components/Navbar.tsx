import { Flex, Heading } from "@chakra-ui/core";
import React from "react";
import { DarkModeSwitch } from "./DarkModeSwitch";

export const Navbar: React.FC = () => {
  return (
    <Flex px={4} height={55} justify="space-between" align="center">
      <Heading>Lireddit</Heading>
      <DarkModeSwitch />
    </Flex>
  );
};
