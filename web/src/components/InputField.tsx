import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";
import TextAreaAutosize from "react-textarea-autosize";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  textarea?: boolean;
  autosize?: boolean;
  onResize?: (newHeight: number) => void;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  autosize,
  onResize,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <Box mt={4}>
      <FormControl isInvalid={!!error}>
        {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
        <Input
          as={autosize ? TextAreaAutosize : textarea ? "textarea" : "input"}
          minRows={4}
          onHeightChange={onResize}
          py={textarea || autosize ? 3 : 0}
          height={textarea ? 40 : undefined}
          transitionDuration="0"
          {...field}
          {...props}
          id={field.name}
        />
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    </Box>
  );
};
