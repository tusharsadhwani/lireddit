import { FieldError } from "../generated/graphql";

export const mapFormErrors = (fieldErrors: FieldError[]) => {
  const errors: { [key: string]: string } = {};
  fieldErrors.map(({ field, message }) => {
    if (errors[field] === undefined) {
      errors[field] = message;
    }
  });
  return errors;
};
