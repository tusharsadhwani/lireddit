import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import PostIcon from "./PostIcon";
import UpvoteDownvoteButtons from "./UpvoteDownvoteButtons";

interface PostProps {
  id: number;
  title: string;
  content: string;
  imgUrl?: string | null;
  createdAt: string;
  creatorName: string;
  headerLink?: boolean;
  userIsOwner?: boolean;
  upvoteCount?: number;
}

const formatTimestamp = (timestampString: string) => {
  const date = new Date(parseInt(timestampString));
  const now = new Date();

  if (
    date.getDate() !== now.getDate() ||
    date.getMonth() !== now.getMonth() ||
    date.getFullYear() !== now.getFullYear()
  ) {
    return `on ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  }

  const secondDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minuteDiff = Math.floor(secondDiff / 60);
  const hourDiff = Math.floor(minuteDiff / 60);

  return (
    (hourDiff ? `${hourDiff}hr ` : "") +
    (minuteDiff ? `${minuteDiff % 60}min ` : "") +
    (!hourDiff ? `${secondDiff % 60}sec` : "") +
    " ago"
  );
};

export const Post: React.FC<PostProps> = ({
  id,
  title,
  content,
  imgUrl,
  creatorName,
  createdAt,
  headerLink,
  userIsOwner = false,
  upvoteCount,
}) => {
  const theme = useTheme() as any;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const router = useRouter();
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditPost = () => {
    setEditLoading(true);
    router.push(`/edit/${id}`);
  };

  const handleDeletePost = async () => {
    setDeleteLoading(true);

    const deleted = await deletePost({ id });
    if (deleted.data?.deletePost) router.push("/");
    //TODO: show toast when post deleted, show error when post not deleted

    setDeleteLoading(false);
  };

  return (
    <Box
      borderWidth={1}
      borderColor={isDark ? theme.darkColors.border : theme.colors.border}
      borderRadius={5}
      w="100%"
      p={4}
      mb={6}
    >
      <Flex justify="space-between">
        <Box>
          <Heading as={headerLink ? "a" : undefined} href={`/${id}`}>
            {title}
          </Heading>
          <Text
            fontStyle="italic"
            color={isDark ? theme.darkColors.subtitle : theme.colors.subtitle}
            fontSize={16}
            suppressHydrationWarning
          >
            by {creatorName}, {formatTimestamp(createdAt)}
          </Text>
        </Box>
        <Flex direction="column" align="flex-end">
          {userIsOwner ? (
            <Flex>
              <PostIcon
                Icon={FiEdit2}
                onClick={handleEditPost}
                loading={editLoading}
              />
              <PostIcon
                Icon={FiTrash2}
                onClick={handleDeletePost}
                loading={deleteLoading}
              />
            </Flex>
          ) : null}
          <Flex align="center" mt={2}>
            Score: {upvoteCount}
            {meData?.me ? <UpvoteDownvoteButtons postId={id} /> : null}
          </Flex>
        </Flex>
      </Flex>

      <Text mt={3} whiteSpace="break-spaces">
        {content}
      </Text>
      {imgUrl ? <Image mx="auto" src={imgUrl} mt={3} maxH={500} /> : null}
    </Box>
  );
};
