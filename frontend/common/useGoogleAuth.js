import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const useGoogleAuth = (onSuccessCallback,isSignup) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        const { email, name ,id,picture } = res.data;
        const username = email.split("@")[0]; // Extract username from email
        const [firstName, lastName] = name.split(' '); // Split name
        const password = id;
        
         const form_data = isSignup ? { 
          firstName, 
          lastName, 
          profile: picture,
          username,
          email,
          password
        } : { 
          searchTerm: username,
          email,
          password
        };

        // Call the success callback with form_data
        onSuccessCallback(form_data);
      } catch (err) {
        console.log(err);
      }
    },
    onError: (error) => {
      console.log("Google Login Failed", error);
    },
  });

  return googleLogin; // Returns the googleLogin function
};

export default useGoogleAuth;