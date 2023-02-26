import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"
function NotFound() {
  return (
    <Page title="not found">
      <div className="text-center">
        {" "}
        <h2> Woops , we cannot find that page </h2>
        <p className="lead text-muted">
          visit the <Link to={"/"}> Homepage</Link> to get a fresh start
        </p>
      </div>
    </Page>
  )
}

export default NotFound
