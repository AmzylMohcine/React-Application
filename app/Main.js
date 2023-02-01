import React from "react"
import ReactDOM from "react-dom"

function ExempleComponent() {
  return (
    <div>
      <h1> our App </h1>
      <p> the sky is bdldqdqddqsddqdqdue </p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))

root.render(<ExempleComponent />)

// prevent refreching page
if (module.hot) {
  module.hot.accept()
}
