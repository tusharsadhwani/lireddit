import { Box, Button, Flex, Image } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useCreatePostMutation } from "../generated/graphql";
import { cloudinarySignature } from "../utils/cloudinary";
import { InputField } from "./InputField";
import ReactResizeDetector from "react-resize-detector";

export interface CreatePostFormProps {}

export const CreatePostForm: React.FC<CreatePostFormProps> = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, resizeContentTextarea] = useState(0);
  const [uploadHeight, setUploadHeight] = useState(0);

  const [, createPost] = useCreatePostMutation();

  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async () => {
    if (!file) return { success: false, url: "" };

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = "test";
    const secret = process.env.NEXT_PUBLIC_CLOUDINARY_SECRET ?? "";

    const signature = await cloudinarySignature({
      publicId,
      timestamp,
      secret,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/tusharsadhwani/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) return { success: false, url: "" };

    const data = await response.json();
    const url = data.secure_url as string;
    return { success: true, url };
  };

  const handleSetImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.currentTarget.files?.[0];
    if (!newFile) return;

    setFile(newFile);
    setFileUrl(URL.createObjectURL(newFile));
  };

  const router = useRouter();

  return (
    <Formik
      initialValues={{ title: "", content: "" }}
      onSubmit={async (values, { setErrors, resetForm }) => {
        let imgUrl: string | undefined;

        if (file) {
          const upload = await uploadImage();
          if (!upload.success) return;

          imgUrl = upload.url;
        }

        const response = await createPost({ ...values, imgUrl });
        if (response.error) {
          setErrors({ title: "An error occured." }); //TODO: better error msg
          return;
        }
        resetForm();
        const post = response.data?.createPost.id;
        router.push(`/${post}`);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form id="newpost" style={{ width: "100%" }}>
          <Flex mb={4}>
            <Box flexGrow={1} mr={4}>
              <InputField name="title" placeholder="Create Post..." />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              Create
            </Button>
          </Flex>
          <Box
            h={values.title ? contentHeight + uploadHeight : 0}
            mb={values.title ? 4 : 0}
            opacity={values.title ? 1 : 0}
            transition={values.content ? "unset" : "all 300ms ease-in-out"}
            pointerEvents={!values.title ? "none" : undefined}
          >
            <Box ref={contentRef}>
              <InputField
                name="content"
                placeholder="Post Content"
                autosize
                onResize={resizeContentTextarea}
              />
            </Box>
            <ReactResizeDetector onResize={(_, h) => setUploadHeight(h)}>
              {() => (
                <Flex justify="space-between" align="center">
                  <label htmlFor="postImage">
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Select Image
                    </Button>
                  </label>
                  <input
                    ref={fileInputRef}
                    name="postImage"
                    type="file"
                    accept="image/*"
                    onChange={handleSetImage}
                    style={{ display: "none" }}
                  />
                  <Image src={fileUrl} maxH={200} maxW={400} />
                </Flex>
              )}
            </ReactResizeDetector>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
