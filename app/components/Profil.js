import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
// access to url parameters
import { useParams } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"
import ProfilPosts from "./ProfilPosts"

function Profil() {
  // returns object with many parameters , distracting all object and take only the username
  const { username } = useParams()
  const appState = useContext(StateContext)
  // initial values
  const [profilData, setProfilData] = useState({
    profileUsername: "...",
    profilAvatar: "https://gravatar.com/avatar/placeholder=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // first param url that we want send a  request to , /profil/username , the second one , is the token of the user
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token })
        // set the data with the values
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

      <ProfilPosts />
    </Page>
  )
}

export default Profil
