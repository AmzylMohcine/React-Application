import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotdsIcon from "./LoadingDotsIcon"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const [post, setPost] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // take the id params to use it on axios response
  const { id } = useParams()

  // run anytime state changes => useEffect

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        // data wa sedn to the server => cancelToken , to cancel when axios do not have any response
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)

        setIsLoading(false)
        console.log(response.data)
      } catch (e) {
        console.log("there is a problem wih posts")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page>
        <div>
          {" "}
          <LoadingDotdsIcon />
        </div>
      </Page>
    )
  const date = new Date(post.createdDate)
  const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  //handle delete
  async function deleteHandler() {
    // confirmation pou up
    const areYouSure = window.confirm("do you really want to delete this post")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data) {
          // display a flush message
          appDispatch({ type: "flushMessage", value: "Succesfully Deleted" })
          // redirect to the current profil
          navigate(`/profil/${appState.user.username}`)
        }
      } catch (e) {
        console.log("there was a problem deleting")
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />
            <a onClick={deleteHandler} className="delete-post-button text-danger" data-tip="Delete" data-for="delete">
              <i className="fas fa-trash"></i>
            </a>{" "}
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>
      <p className="text-muted small mb-4">
        <Link to={`/profil/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profil/${post.author.username}`}>{post.author.username}</Link> on {dateFormated}
      </p>
      <div className="body-content">
        <p>
          <ReactMarkdown children={post.body} allowedElements={["p", "br", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]} />
        </p>
      </div>
    </Page>
  )
}

export default ViewSinglePost
