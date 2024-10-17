// Regex
const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z]{3,}$/;

// Validation for each form field
const validate = {
  firstName: (value) => {
    if (value.length < 3) {
      return {
        firstName: true,
        firstNameError: "First name must be at least 3 characters long.",
      };
    } else if (!nameRegex.test(value)) {
      return {
        firstName: true,
        firstNameError: "No symbols or digits.",
      };
    } else {
      return { firstName: false, firstNameError: false };
    }
  },
  lastName: (value) => {
    if (value.trim().length < 3) {
      return {
        lastName: true,
        lastNameError: "Last name must be at least 3 characters long.",
      };
    } else if (!nameRegex.test(value)) {
      return {
        lastName: true,
        lastNameError: "No symbols or digits.",
      };
    } else {
      return { lastName: false, lastNameError: false };
    }
  },
  username: async (value) => {
    if (value.trim().length < 3) {
      return {
        username: true,
        usernameError: "Username must be 3 characters long.",
      };
    } else {
      return { username: false, usernameError: false };
    }
  },
  email: (value) => {
    if (value.trim().length < 5 || !emailRegex.test(value)) {
      return { email: true, emailError: "Enter Valid Email" };
    } else {
      return { email: false, emailError: false };
    }
  },
  password: (value) => {
    if (!PasswordRegex.test(value)) {
      return {
        password: true,
        passwordError:
          "Minimum 8 characters including 1 uppercase, 1 lowercase, 1 number, 1 symbol",
      };
    } else {
      return { password: false, passwordError: false };
    }
  },
  cpassword: (value, password) => {
    if (value !== password) {
      return {
        cpassword: true,
        cpasswordError: "Confirm Password does not match",
      };
    } else {
      return { cpassword: false, cpasswordError: false };
    }
  },
  name: (value) => {
    if (value.trim().length < 4) {
      return {
        name: true,
        nameError: "Recipe name must be 4 characters long.",
      };
    } else {
      return { name: false, nameError: false };
    }
  },
  description: (value) => {
    if (
      value.trim().split(" ").length < 20 ||
      value.trim().split(" ").length > 100
    ) {
      return {
        description: true,
        descriptionError: "Min. 20 words max. 100 words.",
      };
    } else {
      return { description: false, descriptionError: false };
    }
  },
  arr: (minLen, len, name, message) => {
    if (len < minLen) {
      return {
        [name]: true,
        [name + "Error"]: message,
      };
    } else {
      return {
        [name]: false,
        [name + "Error"]: false,
      };
    }
  },
  feedback: (value) => {
    const minLength = 10;
    const maxLength = 500;
    if (value.trim().length < minLength) {
      return {
        feedback: true,
        feedbackError: `Feedback must be at least ${minLength} characters long.`,
      };
    } else if (value.trim().length > maxLength) {
      return {
        feedback: true,
        feedbackError: `Feedback must not exceed ${maxLength} characters.`,
      };
    } else {
      return { feedback: false, feedbackError: false };
    }
  },
};

export default validate;
