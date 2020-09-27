import { Flex, useColorMode, FlexProps } from "@chakra-ui/core";
import { useEffect } from "react";

export const Layout = (props: FlexProps) => {
  const { colorMode: _colorMode, setColorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  // _colorMode is undefined or empty string in the beginning
  const colorMode = _colorMode == "light" ? "light" : "dark";
  useEffect(() => {
    setColorMode(colorMode);
  });

  return (
    <Flex
      minH="100vh"
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    />
  );
};
