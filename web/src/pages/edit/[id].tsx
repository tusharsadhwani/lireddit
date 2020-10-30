import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import createUrqlClient from "../../utils/createUrqlClient";

export interface EditPostProps {
  idString?: string;
}

const EditPost: React.FC<EditPostProps> = ({ idString }) => {
  const router = useRouter();
  const [, updatePost] = useUpdatePostMutation();

  if (!idString) return <p>Post not found</p>; //TODO: 404

  const id = parseInt(idString);
  if (!id) return <p>Post not found</p>; //TODO: 404

  const [{ data: postData }] = usePostQuery({ variables: { id } });
  if (postData?.post === undefined) return <Layout>Loading</Layout>; //TODO: loading
  if (postData?.post === null) return <Layout>Post not found</Layout>; //TODO: 404

  return (
    <Layout>
      <Formik
        initialValues={{
          title: postData?.post?.title,
          content: postData?.post?.content,
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await updatePost({ ...values, id });
          if (response.error) {
            setErrors({ title: "An error occured." }); //TODO: better error msg
            return;
          }
          const post = response.data?.updatePost.id;
          router.push(`/${post}`); //TODO: cache invalidation
        }}
      >
        {({ isSubmitting }) => (
          <Form id="editpost" style={{ width: "100%" }}>
            <Box>
              <InputField name="title" placeholder="Post Title" />
            </Box>
            <Box>
              <InputField name="content" placeholder="Post Content" autosize />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              Update
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { idString: context.params?.id },
  };
};

export default withUrqlClient(createUrqlClient)(EditPost);
