type FieldErrors = { field: string; message: string }[];

export const mapFormErrors = (fieldErrors: FieldErrors) => {
  const errors: { [key: string]: string } = {};
  fieldErrors.map(({ field, message }) => {
    if (errors[field] === undefined) {
      errors[field] = message;
    }
  });
  return errors;
};
