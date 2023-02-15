import React, { useContext, useEffect } from "react"
import Page from "./Page"
import StateContext from "../StateContext"

function Profil() {
  const appState = useContext(StateContext)
  return (
    <Page title="profil">
      <h2>
        <img class="avatar-small" src={appState.user.avatar} /> {appState.user.username}
        <button class="btn btn-primary btn-sm ml-2">
          Follow <i class="fas fa-user-plus"></i>
        </button>
      </h2>

      <div class="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" class="active nav-item nav-link">
          Posts: 3
        </a>
        <a href="#" class="nav-item nav-link">
          Followers: 101
        </a>
        <a href="#" class="nav-item nav-link">
          Following: 40
        </a>
      </div>

      <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action">
          <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
          <span class="text-muted small">on 2/10/2020 </span>
        </a>
        <a href="#" class="list-group-item list-group-item-action">
          <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #2</strong>
          <span class="text-muted small">on 2/10/2020 </span>
        </a>
        <a href="#" class="list-group-item list-group-item-action">
          <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
          <span class="text-muted small">on 2/10/2020 </span>
        </a>
      </div>
    </Page>
  )
}

export default Profil
