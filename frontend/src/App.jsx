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

function App() {
  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/user" element={<Dashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
