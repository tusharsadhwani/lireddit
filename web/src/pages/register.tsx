import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useRegisterMutation } from "../generated/graphql";
import { mapFormErrors } from "../utils";

const Register = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Layout>
      <Flex dir="column" justify="center" align="center">
        <Box w={400}>
          <Heading>Register</Heading>
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await register(values);
              if (response.data?.register.errors) {
                const errors = mapFormErrors(response.data?.register.errors);
                setErrors(errors);
                return;
              }

              router.push("/");
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
                <Flex mt={4} justify="space-between" align="center">
                  <Button type="submit" isLoading={isSubmitting}>
                    Register
                  </Button>
                  <Link as={NextLink} href="/login">
                    Login Instead
                  </Link>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Register;
