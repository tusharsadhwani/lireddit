import { Box, Button, Flex, Heading, Text } from "@chakra-ui/core";
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

  return (
    <Flex id="navbar" px={4} height={55} align="center">
      <Heading as="a" href="/">
        Lireddit
      </Heading>
      <Spacer />
      {meData?.me ? (
        <>
          <Text>{meData.me.username}</Text>
          <Button m={4} onClick={() => logout()} isLoading={logoutFetching}>
            Logout
          </Button>
        </>
      ) : (
        <Button
          m={4}
          onClick={() => router.push(`/login?back=${location.pathname}`)}
        >
          Login
        </Button>
      )}
      <DarkModeSwitch />
    </Flex>
  );
};

const Spacer: React.FC = () => <Box flexGrow={1} />;

export const Navbar = dynamic(async () => _Navbar, { ssr: false });
