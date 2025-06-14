export const validateNonEmptyString = (value, fieldName) => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    console.error(`Invalid ${fieldName}. It must be a non-empty string.`);
    return false;
  }
  return true;
};