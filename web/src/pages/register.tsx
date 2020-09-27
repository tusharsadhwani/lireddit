import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";

const Index = () => (
  <Layout>
    <Flex dir="column" justify="center" align="center">
      <Box w={400}>
        <Heading>Register</Heading>
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            await new Promise((r) => setTimeout(r, 2000));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <InputField name="email" placeholder="email" label="Email" />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <InputField
                name="about"
                placeholder="about"
                label="About"
                textarea
              />
              <Button mt={4} type="submit" isLoading={isSubmitting}>
                register
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  </Layout>
);

export default Index;
