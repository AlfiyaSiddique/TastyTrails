// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar.jsx";
import ScrollToTop from "./Components/Scrolltotop.jsx";
import Landing from "./Pages/Landing.jsx";
import Footer from "./Components/Footer.jsx";
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
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
          <Route
            path="/recipes"
            element={<Recipes key={"recipes"} type="" />}
          />
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
