import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Axios from "axios"
import { CSSTransition } from "react-transition-group"
Axios.defaults.baseURL = "http://localhost:8080"

//import Contexts
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
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
import Profil from "./components/Profil"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
import Search from "./components/Search"
import Chat from "./components/Chat"

function Main() {
  // this is initialisestates of useStates
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("Token-App")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("Token-App"),
      username: localStorage.getItem("username-App"),
      avatar: localStorage.getItem("avatar-App")
    },
    //search
    isSearchOpen: false,
    isChatOpen: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "openSearch":
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen = false
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("Token-App", state.user.token)
      localStorage.setItem("username-App", state.user.username)
      localStorage.setItem("avatar-App", state.user.avatar)
    } else {
      localStorage.removeItem("Token-App")
      localStorage.removeItem("username-App")
      localStorage.removeItem("avatar-App")
    }
  }, [state.loggedIn])

  return (
    // individual component with different context avd value state and dispatch
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/post/:id" element={state.loggedIn ? <ViewSinglePost /> : <HomeGuest />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/create-post" element={state.loggedIn ? <CreatePost /> : <HomeGuest />} />
            <Route path="/profil/:username/*" element={state.loggedIn ? <Profil /> : <HomeGuest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

// prevent refreching page
if (module.hot) {
  module.hot.accept()
}
