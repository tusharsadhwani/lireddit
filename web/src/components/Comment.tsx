import { Box, Text, useColorMode, useTheme } from "@chakra-ui/core";
import React from "react";
import { formatTimestamp } from "../utils/formatTimestamp";

interface CommentProps {
  comment: string;
  creatorName: string;
  createdAt: string;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  creatorName,
  createdAt,
}) => {
  const theme = useTheme() as any;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      borderWidth={1}
      borderColor={isDark ? theme.darkColors.border : theme.colors.border}
      borderRadius={5}
      w="100%"
      p={4}
      mb={2}
    >
      <Text
        fontStyle="italic"
        color={isDark ? theme.darkColors.subtitle : theme.colors.subtitle}
        fontSize={16}
        mb={1}
      >
        {creatorName}, {formatTimestamp(createdAt)}
      </Text>
      <Text whiteSpace="break-spaces">{comment}</Text>
    </Box>
  );
};
