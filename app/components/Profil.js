import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
// access to url parameters
import { useParams } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"
import ProfilPosts from "./ProfilPosts"
import { useImmer } from "use-immer"

function Profil() {
  // returns object with many parameters , distracting all object and take only the username
  const { username } = useParams()
  const appState = useContext(StateContext)
  // initial values
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profilData: {
      profileUsername: "...",
      profilAvatar: "https://gravatar.com/avatar/placeholder=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" }
    }
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        // first param url that we want send a  request to , /profil/username , the second one , is the token of the user
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        // set the data with the values
        setState(draft => {
          draft.profilData = response.data
        })
      } catch (e) {
        console.log("There was a problem")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  useEffect(() => {
    if (state.startFollowingRequestCount > 0) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          // first param url that we want send a  request to , /profil/username , the second one , is the token of the user
          const response = await Axios.post(`/addFollow/${state.profilData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          // set the data with the values
          setState(draft => {
            draft.profilData.isFollowing = true
            draft.profilData.counts.followerCount++
            draft.followActionLoading = false
          })
        } catch (e) {
          console.log("There was a problem")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.startFollowingRequestCount])

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }

  useEffect(() => {
    if (state.stopFollowingRequestCount > 0) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          // first param url that we want send a  request to , /profil/username , the second one , is the token of the user
          const response = await Axios.post(`/removeFollow/${state.profilData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          // set the data with the values
          setState(draft => {
            draft.profilData.isFollowing = false
            draft.profilData.counts.followerCount--
            draft.followActionLoading = false
          })
        } catch (e) {
          console.log("There was a problem")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])

  return (
    <Page title="profil">
      <h2>
        <img className="avatar-small" src={state.profilData.profilAvatar} /> {state.profilData.profileUsername}
        {appState.loggedIn && !state.profilData.isFollowing && appState.user.username != state.profilData.profileUsername && state.profilData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profilData.isFollowing && appState.user.username != state.profilData.profileUsername && state.profilData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Stop Following <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profilData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profilData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profilData.counts.followingCount}
        </a>
      </div>

      <ProfilPosts />
    </Page>
  )
}

export default Profil
