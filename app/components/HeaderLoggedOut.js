import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext)

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username, password })
      if (response.data) {
        // set the data in the localstorage
        // localStorage.setItem("Token-App", response.data.token)
        // localStorage.setItem("username-App", response.data.username)
        // localStorage.setItem("avatar-App", response.data.avatar)
        appDispatch({ type: "login", data: response.data })
        appDispatch({ type: "flashMessage", value: "you are connected" })
      } else {
        alert("incorrect user & password ")
      }
    } catch (e) {
      console.log("there was a problem ")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
