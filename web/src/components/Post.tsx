import { Box, Heading, Text, useColorMode, useTheme } from "@chakra-ui/core";

interface PostProps {
  title: string;
  content: string;
  creatorName: string;
}

export const Post: React.FC<PostProps> = ({ title, content, creatorName }) => {
  const theme = useTheme() as any;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      borderWidth={1}
      borderColor={isDark ? theme.darkColors.border : theme.colors.border}
      borderRadius={5}
      w={700}
      p={4}
      mb={6}
    >
      <Heading>{title}</Heading>
      <Text
        fontStyle="italic"
        color={isDark ? theme.darkColors.subtitle : theme.colors.subtitle}
        fontSize={16}
      >
        by {creatorName}
      </Text>
      <Text mt={3}>{content}</Text>
    </Box>
  );
};
