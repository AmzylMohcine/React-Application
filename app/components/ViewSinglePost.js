import React, { useEffect, useState } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotdsIcon from "./LoadingDotsIcon"
import reactMarkdown from "react-markdown"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import ReactTooltip from "react-tooltip"

function ViewSinglePost() {
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
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
          <a className="delete-post-button text-danger" data-tip="Delete" data-for="delete">
            <i className="fas fa-trash"></i>
          </a>{" "}
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
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
