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
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDeletePostMutation } from "../generated/graphql";
import PostIcon from "./PostIcon";

interface PostProps {
  id: number;
  title: string;
  content: string;
  imgUrl?: string | null;
  creatorName: string;
  headerLink?: boolean;
  userIsOwner?: boolean;
}

export const Post: React.FC<PostProps> = ({
  id,
  title,
  content,
  imgUrl,
  creatorName,
  headerLink,
  userIsOwner = false,
}) => {
  const theme = useTheme() as any;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const router = useRouter();
  const [, deletePost] = useDeletePostMutation();

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditPost = () => {
    setEditLoading(true);
    router.push(`/edit/${id}`);
  };

  const handleDeletePost = async () => {
    setDeleteLoading(true);

    const deleted = await deletePost({ id });
    if (deleted.data?.deletePost)
      if (router.route == "/") router.reload();
      else router.push("/");
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
        <Heading as={headerLink ? "a" : undefined} href={`/${id}`}>
          {title}
        </Heading>
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
      </Flex>
      <Text
        fontStyle="italic"
        color={isDark ? theme.darkColors.subtitle : theme.colors.subtitle}
        fontSize={16}
      >
        by {creatorName}
      </Text>
      <Text mt={3} whiteSpace="pre">
        {content}
      </Text>
      {imgUrl ? <Image src={imgUrl} mt={3} /> : null}
    </Box>
  );
};
