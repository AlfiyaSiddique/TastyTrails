import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import 'react-toastify/dist/ReactToastify.css';
import AddRecipe from "./Pages/AddRecipe.jsx";
import OneRecipe from "./Pages/OneRecipe.jsx";
import UpdateRecipe from "./Pages/UpdateRecipe.jsx";

function App() {
  const [showScroll, setShowScroll] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main style={{ backgroundColor: darkMode ? "#2e2e2e" : "#fff", color: darkMode ? "#fff" : "#000" }}>
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
        theme={darkMode ? "dark" : "light"} // Update Toast theme
      />
      <BrowserRouter>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> {/* Pass darkMode and toggle */}
        <Routes>
          <Route path="/" element={<Landing darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} />} />
          <Route path="/recipes" element={<Recipes darkMode={darkMode} key={"recipes"} type=""/>} />
          <Route path="/mainmeals" element={<Recipes darkMode={darkMode} key={"Main-meal"} type="Main-meal"/>} />
          <Route path="/smallbites" element={<Recipes darkMode={darkMode} key={"Small-bite"} type="Small-bite"/>} />
          <Route path="/healthy" element={<Recipes darkMode={darkMode} key={"Healthy"} type="Healthy"/>} />
          <Route path="/user/:id" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/user/:id/new/recipe" element={<AddRecipe darkMode={darkMode} />} />
          <Route path="/user/:id/update/recipe" element={<UpdateRecipe darkMode={darkMode} />} />
          <Route path="/recipe/:id" element={<OneRecipe darkMode={darkMode} />} />
        </Routes>
        <Footer darkMode={darkMode} /> {/* Pass darkMode prop */}
      </BrowserRouter>

      {showScroll && <ScrollToTop />}
    </main>
  );
}

export default App;
