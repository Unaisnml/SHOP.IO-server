// Email validation
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

//Validate the length of password or name
export const validateLength = (text, min, max) => {
  if (text.length < min || text.length > max) {
    return false;
  } else {
    return true;
  }
};
