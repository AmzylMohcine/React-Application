import React, { useEffect, useState } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"

function ViewSinglePost() {
  const [post, setPost] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()

  // run anytime state changes => useEffect

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/post/${id}`)
        setPost(response.data)

        setIsLoading(false)
        console.log(response.data)
      } catch (e) {
        console.log("there is a problem wih posts")
      }
    }
    fetchPosts()
  }, [])

  if (isLoading) return <div> Loading ... </div>
  const date = new Date(post.createdDate)
  const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profil/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profil/${post.author.username}`}>{post.author.username}</Link> on {dateFormated}
      </p>

      <div className="body-content">
        <p>{post.body}</p>
      </div>
    </Page>
  )
}

export default ViewSinglePost
