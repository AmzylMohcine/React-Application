import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import DispatchContext from "../DispatchContext"

function HomeGuest() {
  const appDispatch = useContext(DispatchContext)
  // const [username, setUsername] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  }

  function OurReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediatly":
        // set haserrors to false
        draft.username.hasErrors = false
        // get the value of the input
        draft.username.value = action.value

        //test if the value of the username input is more than 30 caracters

        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = " username cannot exceed 30 caracters."
        }
        // test if username have special caracters
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "username can only contain letters and numbers."
        }

        return
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "username must be atleast 3 caracters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "that username is already taken"
        } else {
          draft.username.isUnique = true
        }
        return
      case "emailImmediatly":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "you must provide a valid email adress."
        }
        //check if there is no error
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "that email is already used"
        } else {
          draft.email.isUnique = true
        }
        return
      case "passwordImmediatly":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "password cannot exceed 50 caracters"
        }
        return
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = "password must be atleast 12 caracter"
        }
        return
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(OurReducer, initialState)

  // set delay for the username type
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "usernameAfterDelay" })
      }, 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  // set delay for the email type

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "emailAfterDelay" })
      }, 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  //set delay for password

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "passwordAfterDelay" })
      }, 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  //check in the database if username exists
  useEffect(() => {
    if (state.username.checkCount) {
      // send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post(`/doesUsernameExist`, { username: state.username.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "usernameUniqueResults", value: response.data })
        } catch (e) {
          console.log("problem , request was cancled ")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.username.checkCount])

  //email exists
  useEffect(() => {
    if (state.email.checkCount) {
      // send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post(`/doesEmailExist`, { email: state.email.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "emailUniqueResults", value: response.data })
        } catch (e) {
          console.log("problem , request was cancled ")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "usernameImmediatly", value: state.username.value })
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true })
    dispatch({ type: "emailImmediatly", value: state.email.value })
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
    dispatch({ type: "passwordImmediatly", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value })

    dispatch({ type: "submitForm" })
  }
  // submit form
  useEffect(() => {
    if (state.submitCount) {
      // send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post(`/register`, { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
          appDispatch({ type: "login", data: response.data })
          appDispatch({ type: "flashMessage", value: "congrats! Welcome to your new account " })
        } catch (e) {
          console.log("problem , request was cancled ")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  return (
    <>
      <Page title="Welcome " wide={true}>
        <div className="row align-items-center">
          <div className="col-lg-7 py-3 py-md-5">
            <h1 className="display-3">Remember Writings?</h1>
            <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
          </div>
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <small>Username</small>
                </label>
                <input
                  onChange={e => {
                    dispatch({ type: "usernameImmediatly", value: e.target.value })
                  }}
                  id="username-register"
                  name="username"
                  className="form-control"
                  type="text"
                  placeholder="Pick a username"
                  autoComplete="off"
                />

                <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveVlidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
                </CSSTransition>
              </div>
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <small>Email</small>
                </label>
                <input
                  onChange={e => {
                    dispatch({ type: "emailImmediatly", value: e.target.value })
                  }}
                  id="email-register"
                  name="email"
                  className="form-control"
                  type="text"
                  placeholder="you@example.com"
                  autoComplete="off"
                />
                <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveVlidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
                </CSSTransition>
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input
                  onChange={e => {
                    dispatch({ type: "passwordImmediatly", value: e.target.value })
                  }}
                  id="password-register"
                  name="password"
                  className="form-control"
                  type="password"
                  placeholder="Create a password"
                />
                <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveVlidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
                </CSSTransition>
              </div>
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Sign up for ComplexApp
              </button>
            </form>
          </div>
        </div>
      </Page>
    </>
  )
}

export default HomeGuest
