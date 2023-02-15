import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
import { useParams } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"

function Profil() {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [profilData, setProfilData] = useState({
    profileUsername: "...",
    profilAvatar: "https://gravatar.com/avatar/placeholder=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token })
        setProfilData(response.data)
      } catch (e) {
        console.log("There was a problem")
      }
    }
    fetchData()
  }, [])
  return (
    <Page title="profil">
      <h2>
        <img className="avatar-small" src={profilData.profilAvatar} /> {profilData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profilData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profilData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profilData.counts.followingCount}
        </a>
      </div>

      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #2</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </a>
      </div>
    </Page>
  )
}

export default Profil
