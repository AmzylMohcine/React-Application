import React, { useContext, useEffect, useState } from "react"
import Axios from "axios"
// to works with params url
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import LoadingDotdsIcon from "./LoadingDotsIcon"

function ProfilFollowers() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { username } = useParams()

  // run anytime state changes => useEffect

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`)
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
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/profil/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} />
            {follower.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilFollowers
