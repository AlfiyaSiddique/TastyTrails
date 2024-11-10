// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar.jsx";
import ScrollToTop from "./Components/Scrolltotop.jsx";
import Landing from "./Pages/Landing.jsx";
import Footer from "./Components/Footer.jsx";
import ScrollProgressBar from "./Components/ScrollProgressBar.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Recipes from "./Pages/Recipes.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddRecipe from "./Pages/AddRecipe.jsx";
import OneRecipe from "./Pages/OneRecipe.jsx";
import UpdateRecipe from "./Pages/UpdateRecipe.jsx";
import Contributors from "./Pages/Contributors.jsx"; // Import the Contributors component
import PrivacyPolicy from "./Components/PrivacyPolicy.jsx";
import NotFound from "./Pages/NotFound.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import RecipeSuggestions from "./Pages/RecipeSuggestions.jsx";
import EmailVerification from "./Pages/EmailVerification.jsx"
import ResendVerificationPage from "./Pages/ResendVerification.jsx";

import UserProfile from "./Pages/Profile.jsx";
import UserSearch from "./Pages/SearchPage.jsx";


// function App() {
//   return (
//     <div>
//       {/* Render ScrollProgressBar at the top */}
//       <ScrollProgressBar />
//       <Navbar />
//       {/* Other components, routes, or layouts */}
//     </div>
//   );
// };

function App() {
  const [showScroll, setShowScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<EmailVerification/>}></Route>
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
          <Route path="/reverify-email" element={<ResendVerificationPage />} />
          <Route
            path="/recipes"
            element={<Recipes key={"recipes"} type="" />}
          />
          <Route path="/search" element={<UserSearch />} />
          <Route
            path="/mainmeals"
            element={<Recipes key={"Main-meal"} type="Main-meal" />}
          />
          <Route
            path="/smallbites"
            element={<Recipes key={"Small-bite"} type="Small-bite" />}
          />
          <Route
            path="/healthy"
            element={<Recipes key={"Healthy"} type="Healthy" />}
          />
          <Route path="/user/:id" element={<Dashboard />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/user/:id/new/recipe" element={<AddRecipe />} />
          <Route path="/user/:id/update/recipe" element={<UpdateRecipe />} />
          <Route path="/recipe/:id" element={<OneRecipe />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/recipe-suggestions" element={<RecipeSuggestions />} />
          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<NotFound/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
      </BrowserRouter>

      {showScroll && <ScrollToTop />}
    </main>
  );
}

export default App;
