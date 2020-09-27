import { Box, useColorMode } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { Navbar } from "./Navbar";

export const Layout: React.FC = ({ children }) => {
  const { colorMode: _colorMode, setColorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  // _colorMode is undefined or empty string in the beginning
  const colorMode = _colorMode == "light" ? "light" : "dark";
  useEffect(() => {
    setColorMode(colorMode);
  });

  return (
    <Box minH="100vh" bg={bgColor[colorMode]} color={color[colorMode]}>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </Box>
  );
};
