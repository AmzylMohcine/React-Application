import React, { useContext, useEffect } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import axios from "axios"
import { Link } from "react-router-dom"

function Search() {
  const appDispatch = useContext(DispatchContext)

  //immer let us use lots of propreties instead of using lot uf states(useStates)
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  })

  function closeSearchHandler(e) {
    e.preventDefault()
    appDispatch({ type: "closeSearch" })
  }
  // if press esc , remove search overlay
  function keyPress(e) {
    e.preventDefault()
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" })
    }
  }

  useEffect(() => {
    document.addEventListener("keyup", keyPress)
    return () => document.removeEventListener("keyup", keyPress)
  }, [])

  //set up delay and watching searchterm for change
  useEffect(() => {
    //not considering that white space is a search input
    if (state.searchTerm.trim()) {
      // show loading cirvle while typing
      setState(draft => {
        draft.show = "loading"
      })
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++
        })
      }, 750)
      return () => clearTimeout(delay)
    } else {
      setState(draft => {
        draft.show = "neaither"
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount) {
      // send axios request here
      const ourRequest = axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await axios.post(`/search`, { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
          setState(draft => {
            draft.results = response.data
            //set show to results to show results
            draft.show = "results"
          })
        } catch (e) {
          console.log("problem , request was cancled ")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.requestCount])

  function handleInput(e) {
    const value = e.target.value
    setState(draft => {
      draft.searchTerm = value
    })
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={closeSearchHandler} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : " ")}> </div>
          <div className={"live-search-results" + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} fouds )
                </div>
                {/* loop  */}

                {state.results.map(post => {
                  const date = new Date(post.createdDate)
                  const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                  return (
                    <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title} </strong>{" "}
                      <span className="text-muted small">
                        by {post.author.username}on {dateFormated}{" "}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <h5 className="alert alert-danger text-center shadow-sm"> sorry we could not find any result </h5>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
