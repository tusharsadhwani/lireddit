import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { DarkModeSwitch } from "./DarkModeSwitch";

export const Navbar: React.FC = () => {
  const [meQuery] = useMeQuery();
  const [, logout] = useLogoutMutation();
  const router = useRouter();

  const handleLoginLogoutButton = async () => {
    if (meQuery.data?.me) {
      await logout();
      location.reload();
    } else {
      router.push("login");
    }
  };

  return (
    <Flex px={4} height={55} align="center">
      <Heading>Lireddit</Heading>
      <Spacer />
      <Button
        mr={4}
        onClick={handleLoginLogoutButton}
        children={meQuery.data?.me ? "Logout" : "Login"}
      />
      <DarkModeSwitch />
    </Flex>
  );
};

const Spacer: React.FC = () => <Box flexGrow={1} />;
