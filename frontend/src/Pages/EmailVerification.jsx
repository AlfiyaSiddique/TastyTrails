import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AccountVerificationPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); // To show loading while verifying
  const [error, setError] = useState(null);
  const location = useLocation();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // Extract the token from the URL query parameters
  const navigator = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const jwt = queryParams.get("jtoken");
  const userId = queryParams.get("id");
  useEffect(() => {
    if (token) {
      verifyAccount(token);
    } else {
      setError("Invalid verification link.");
      setLoading(false);
    }
  }, [token]);

  // Function to handle account verification
  const verifyAccount = async (token) => {
    try {
      setLoading(true);

      // Send a GET request with the token in the URL
      const response = await axios.get(
        `${backendURL}/api/verify-account?token=${token}`
      );

      if (response.status === 200) {
        const userData = await axios.post(`${backendURL}/api/user/fetch`, {
          id: userId,
        });
        console.log(userData);
        setTimeout(() => {
          setIsVerified(true);
          navigator(`/user/${userData.data._id}`, {
            state: { user: userData.data },
          });
        }, 2000); // Redirect after a short delay
        localStorage.setItem("tastytoken", JSON.stringify(jwt));

        localStorage.setItem(
          "username",
          JSON.stringify(userData.data.username)
        );

        
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white mt-10">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
      />
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="p-8 flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-full bg-red-700 flex items-center justify-center mb-6">
            <span className="text-white text-3xl font-semibold">✓</span>
          </div>

          <h2 className="text-3xl font-bold text-center text-red-700 mb-4">
            Email Verification
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 mb-8">
              Verifying your account...
            </p>
          ) : error ? (
            <p className="text-center text-red-700 mb-8">{error}</p>
          ) : (
            <p className="text-center text-gray-600 mb-8">
              Your account has been verified successfully.
            </p>
          )}

          <p className="text-center text-sm mt-4">
            <a href="/login" className="text-red-700 hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationPage;
