import React, { useContext, useEffect, useState } from "react"
import Axios from "axios"
// to works with params url
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import LoadingDotdsIcon from "./LoadingDotsIcon"
import Page from "./Page"

function ProfilPosts() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { username } = useParams()

  // run anytime state changes => useEffect

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)
        setPosts(response.data)
        setIsLoading(false)
        // console.log(response.data)
      } catch (e) {
        console.log("there is a problem wih posts")
      }
    }
    fetchPosts()
  }, [username])

  if (isLoading) return <LoadingDotdsIcon />

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate)
        const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title} </strong> <span className="text-muted small"> on {dateFormated} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilPosts
