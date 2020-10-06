import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";

const _Navbar: React.FC = () => {
  const [{ data: meData }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const router = useRouter();

  const handleLoginLogoutButton = async () => {
    if (meData?.me) {
      await logout();
    } else {
      router.push("/login");
    }
  };

  return (
    <Flex px={4} height={55} align="center">
      <Heading>Lireddit</Heading>
      <Spacer />
      <Button
        mr={4}
        onClick={handleLoginLogoutButton}
        isLoading={logoutFetching}
        children={meData?.me ? "Logout" : "Login"}
      />
      <DarkModeSwitch />
    </Flex>
  );
};

const Spacer: React.FC = () => <Box flexGrow={1} />;

export const Navbar = dynamic(async () => _Navbar, { ssr: false });
