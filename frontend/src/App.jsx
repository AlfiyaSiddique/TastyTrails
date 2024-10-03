// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState,useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import ScrollToTop from "./Components/Scrolltotop";
import Landing from "./Pages/Landing";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Recipes from "./Pages/Recipes";
import Dashboard from "./Pages/Dashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddRecipe from "./Pages/AddRecipe";
import OneRecipe from "./Pages/OneRecipe";
import UpdateRecipe from "./Pages/UpdateRecipe";


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
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
          <Route path="/recipes" element={<Recipes key={"recipes"} type=""/>} />
          <Route path="/mainmeals" element={<Recipes key={"Main-meal"} type="Main-meal"/>} />
          <Route path="/smallbites" element={<Recipes key={"Small-bite"} type="Small-bite"/>} />
          <Route path="/healthy" element={<Recipes key={"Healthy"} type="Healthy"/>} />
          <Route path="/user/:id" element={<Dashboard />} />
          <Route path="/user/:id/new/recipe" element={<AddRecipe />} />
          <Route path="/user/:id/update/recipe" element={<UpdateRecipe />} />
          <Route path="/recipe/:id" element={<OneRecipe/>} />
        </Routes>
        <Footer />
      </BrowserRouter>

      {showScroll && <ScrollToTop />}
    </main>
  );
}

export default App;
