import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useLoginMutation } from "../generated/graphql";
import { mapFormErrors } from "../utils";

const Login = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Layout>
      <Flex dir="column" justify="center" align="center">
        <Box w={400}>
          <Heading>Register</Heading>
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login(values);
              if (response.data?.login.errors) {
                const errors = mapFormErrors(response.data?.login.errors);
                setErrors(errors);
                return;
              }

              router.push("/");
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="username/email"
                  label="Username or Email"
                />
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
                <Button mt={4} type="submit" isLoading={isSubmitting}>
                  login
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Login;
