import axios from "axios";
import backendURL from "./backendUrl";

const getUsernames = async () => {
  return await axios
    .get(`${backendURL}/api/usernames`)
    .then((data) => data.data.usernames)
    .catch((err) => {
      console.log(err);
    });
};

const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = {
  firstName: (value) => {
    if (value.trim().length < 3) {
      return {
        firstName: true,
        firstNameError: "First name must 3 characters long.",
      };
    } else {
      return { firstName: false, firstNameError: false };
    }
  },

  lastName: (value) => {
    if (value.trim().length < 3) {
      return {
        lastName: true,
        lastNameError: "Last name must 3 characters long.",
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
      const usernames = await getUsernames();
      console.log(usernames)
      if (usernames.includes(value)) {
        return { username: true, usernameError: "Username already exist." };
      }
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
};

export default validate;
