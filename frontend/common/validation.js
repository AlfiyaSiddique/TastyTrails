
// Regex
const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex=/^[a-zA-Z]{3,}$/

// Validation for each form field
const validate = {
  firstName: (value) => {
   if (value.length < 3) {
      // Error if the name is shorter than 3 characters
      return {
        firstName: true,
        firstNameError: "First name must be at least 3 characters long.",
      };
    } else if (!nameRegex.test(value)) {
      // Error if the name contains special characters or numbers
      return {
        firstName: true,
        firstNameError: "Special characters or numbers are not allowed.",
      };
    } else {
      return { firstName: false, firstNameError: false };
    }
  },
  lastName: (value) => {
    if (value.trim().length < 3) {
      // Error if the last name is shorter than 3 characters
      return {
        lastName: true,
        lastNameError: "Last name must be at least 3 characters long.",
      };
    } else if (!nameRegex.test(value)) {
      // Error if the last name contains special characters or numbers
      return {
        lastName: true,
        lastNameError: "Special characters or numbers are not allowed.",
      };
    } else {
      return { lastName: false, lastNameError: false };
    }
  },
  username: async (value) => {
    if (value.trim().length < 3) {
      return {
        username: true,
        usernameError: "Username must 3 characters long.",
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
  cpasssword: (value, password) => {
    if (value !== password) {
      return {
        cpassword: true,
        cpasswordError: "Confirm Password does not match",
      };
    } else {
      return { cpassword: false, cpasswordError: false };
    }
  },
  name: (value)=>{
    if (value.trim().length < 4) {
      return {
        name: true,
        nameError: "Recipe name must be 4 characters long.",
      };
    } else {
      return { name: false, nameError: false };
    }
  },

  description: (value)=>{
    if (value.trim().split(" ").length < 20 ||
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

  arr: (minLen, len, name, message)=>{
    if(len < minLen ){
      return {
        [name]: true,
        [name+"Error"]: message,
      };
    }else{
        return {
          [name]: false,
          [name+"Error"]: false,
        }
    }
  },
};

export default validate;
