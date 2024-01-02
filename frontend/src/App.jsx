// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/Landing";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Recipes from "./Pages/Recipes";
import Dashboard from "./Pages/Dashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
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
          <Route path="/recipe/:id" element={<Dashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
