import React, { useContext, useState, useEffect, useRef } from 'react'
import './messenger.css'
import Topbar from '../../components/Topbar/Topbar'
import Conversation from '../../components/Conversation/Conversation'
import Message from '../../components/Message/Message'
import ChatOnline from '../../components/ChatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import { io } from 'socket.io-client'
import axios from 'axios'

export default function Messenger() {
  const [conversations, setConverations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOlineUsers] = useState([])
  const socket = useRef()
  const { user } = useContext(AuthContext)
  const scrollRef = useRef()

  useEffect(() => {
    socket.current = io("ws://loaclhost:8900")
    socket.current?.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  })

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
    setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage])

  useEffect(() => {
    socket.current?.emit("addUser", user?._id)
    socket.current?.on("getUsers", users => {
      setOlineUsers(user.followings.filter(f => users.some(u =>u.userId === f)))
    })
  }, [user])

  useEffect(() => {
    const getConverations = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/conversations/' + user._id)
        setConverations(res.data.conversation)
      } catch (err) {
        console.log(err)
      }
    }
    getConverations()
  }, [user._id])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/messages/' + currentChat?._id)
        setMessages(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getMessages()
  }, [currentChat])
  // console.log(messages)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat?._id
    }

    const receiverId = currentChat.members.find(member => member !== user?._id)
    socket.current?.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage
    })

    try {
      const res = await axios.post('http://localhost:4000/api/messages', message)
      setMessages([...messages, res.data.message])
      setNewMessage("")
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  return (
    <>
      <Topbar />
      <div className='messenger'>
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input type="text" placeholder='Search for a Friend' className="chatMenuInput" />
            {conversations.map((c) => {
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {
              currentChat ?
                <>
                  {messages.map(m => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user?._id} />
                    </div>
                  ))}

                  <div className="chatboxBottom">
                    <textarea
                      className='chatMessageInput'
                      placeholder='Write something...'
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                  </div>
                </>
                : <span className='noConversation'>Open Conversation to start chat</span>
            }
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline onlineUsers={onlineUsers} currentId={user?._id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  )
}
