import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Axios from "axios"

Axios.defaults.baseURL = "http://localhost:8080"

// my componenets
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"

function Main() {
  const [loggedIn, setLoggedin] = useState(Boolean(localStorage.getItem("Token-App")))
  const [flashMessages, setFlashMessages] = useState([])
  function addFlashMessage(msg) {
    setFlashMessages(prev => prev.concat(msg))
  }
  return (
    <BrowserRouter>
      <FlashMessages messages={flashMessages} />
      <Header loggedIn={loggedIn} setLoggedin={setLoggedin} />
      <Routes>
        <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/post/:id" element={<ViewSinglePost />} />
        <Route path="/create-post" element={<CreatePost addFlashMessage={addFlashMessage} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

// prevent refreching page
if (module.hot) {
  module.hot.accept()
}
