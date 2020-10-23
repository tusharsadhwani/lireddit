import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React, { useRef } from "react";

import { useCreatePostMutation } from "../generated/graphql";
import { InputField } from "./InputField";

export interface CreatePostFormProps {}

export const CreatePostForm: React.FC<CreatePostFormProps> = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [, createPost] = useCreatePostMutation();

  return (
    <Formik
      initialValues={{ title: "", content: "" }}
      onSubmit={async (values, { setErrors, resetForm }) => {
        const response = await createPost(values);
        if (response.error) {
          setErrors({ title: "An error occured." });
          return;
        }
        resetForm();
      }}
    >
      {({ values, isSubmitting }) => (
        <Form style={{ width: "100%" }}>
          <Flex align="flex-end" mb={4}>
            <Box flexGrow={1} mr={4}>
              <InputField name="title" placeholder="Create Post..." />
            </Box>
            <Button type="submit" isLoading={isSubmitting}>
              Create
            </Button>
          </Flex>

          <Box
            h={values.title ? contentRef.current?.clientHeight : 0}
            mb={values.title ? 3 : 0}
            opacity={values.title ? 1 : 0}
            transition="all 300ms ease-in-out"
          >
            <Box ref={contentRef}>
              <InputField name="content" placeholder="Post Content" textarea />
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
