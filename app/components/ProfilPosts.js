import React, { useContext, useEffect, useState } from "react"
import Axios from "axios"
// to works with params url
import Post from "./Post"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import LoadingDotdsIcon from "./LoadingDotsIcon"

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
        return <Post noAuthor={true} post={post} key={post._id} />
      })}
    </div>
  )
}

export default ProfilPosts
