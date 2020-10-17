import { Box, Flex, useColorMode } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { Navbar } from "./Navbar";

export const Layout: React.FC = ({ children }) => {
  let { colorMode, setColorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  // colorMode is undefined or empty string in the beginning for some reason
  colorMode ||= "dark";
  useEffect(() => {
    setColorMode(colorMode);
  });

  return (
    <Box minH="100vh" bg={bgColor[colorMode]} color={color[colorMode]}>
      <Navbar />
      <Flex flexDir="column" p={4} align="center">
        {children}
      </Flex>
    </Box>
  );
};
