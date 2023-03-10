import React, { useContext, useEffect, useRef } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import { io } from "socket.io-client"
import { Link } from "react-router-dom"

const socket = io("http://localhost:8080")
function Chat() {
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  })
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  // ref is like a box to hold the value in , we gonna use it to do something to an element
  // in this case we use ref to autofocus on input when the chat it's visible
  const chatField = useRef(null)
  const chatLog = useRef(null)

  // autofocus on the input chat with ref hook
  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus()
      appDispatch({ type: "clearChat" })
    }
  }, [appState.isChatOpen])

  // scrooll down to the last message
  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementChat" })
    }
  }, [state.chatMessages])

  // send chat from server
  useEffect(() => {
    socket.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })
  }, [])

  function handleFieldChange(e) {
    const value = e.target.value
    setState(draft => {
      draft.fieldValue = value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // send message to chat server

    socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })

    setState(draft => {
      // add message to state collection of messages
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar, id: appState.user._id })
      draft.fieldValue = ""
    })
  }
  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : " ")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            )
          }
          return (
            <div className="chat-other" key={index}>
              <Link to={`/profil/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profil/${message.username}`}>
                    <strong>
                      {message.username} :{""}{" "}
                    </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.fieldValue} onChange={handleFieldChange} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  )
}

export default Chat
