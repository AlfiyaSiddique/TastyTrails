// eslint-disable-next-line no-unused-vars
import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css'
import Navbar from './Components/Navbar'
import Landing from './Pages/Landing'
import Footer from './Components/Footer'

function App() {
  return (
    <main>
  <BrowserRouter>
  <Navbar/>
  <Routes>
  <Route path='/' element={<Landing/>}/>
  <Route path='/login' element={<Landing/>}/>
  </Routes>
  <Footer/>
  </BrowserRouter>
  </main>
  )
}

export default App
