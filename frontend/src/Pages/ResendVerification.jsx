import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ResendVerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10); // Initial countdown timer
  const [canResend, setCanResend] = useState(false);
  const location = useLocation();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  // Extract the email from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  useEffect(() => {
    if (!email) {
      setError("Invalid request. No email provided.");
    }

    // Start the countdown timer when the component mounts
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResend(true); // Enable resend button when timer reaches zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval when component unmounts
  }, [email]);

  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success state before starting the resend

    try {
      const response = await axios.post(`${backendURL}/api/reverify-account`, {
        email: email,
      });

      if (response.status === 200) {
        setSuccess(true);
        setCanResend(false); // Disable resend button again
        setTimeRemaining(10); // Reset timer after successful resend

        // Trigger the toast only once here
        toast.success("Verification email sent successfully.");

        // Restart the countdown timer after resetting timeRemaining
        const timer = setInterval(() => {
          setTimeRemaining((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setCanResend(true); // Enable resend button when timer reaches zero
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => clearInterval(timer); // Cleanup the interval when the component unmounts or timer resets
      } else {
        setError("Failed to resend verification email. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  const formattedTime = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-red-700 mt-10">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop />
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-10">
        <h2 className="text-3xl font-semibold text-center text-red-700 mb-6">Verify Your Email</h2>

        <p className="text-center text-gray-600 mb-8">
          A verification email has been sent to <strong>{email}</strong>. Please check your inbox.
        </p>

        {error && <p className="text-center text-red-700 mb-4">{error}</p>}
        {success && (
          <p className="text-center text-green-600 mb-4">
            Verification email sent! Please check your inbox.
          </p>
        )}

        <button
          className={`w-full py-3 mt-6 rounded-md text-white font-semibold ${
            canResend ? "bg-red-700 hover:bg-red-800" : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={resendVerificationEmail}
          disabled={!canResend || loading}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        {!canResend && (
          <p className="text-center text-gray-600 mt-4">
            Please wait {formattedTime} before requesting again.
          </p>
        )}

        <p className="text-center text-sm mt-6">
          <a href="/login" className="text-red-700 hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
