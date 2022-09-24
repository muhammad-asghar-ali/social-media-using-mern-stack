import React from 'react';
import './register.css'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Register() {
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault()
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Password don't match!")
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        passwordAgain: passwordAgain.current.value
      }
      try {
        await axios.post(`http://localhost:4000/api/auth/register`, user)
        navigate("/login", { replace: true })
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <div className='register'>
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">Social</h3>
          <span className="registerDesc">Connect with friends and the world around you.</span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input placeholder='Username' ref={username} className="registerInput" />
            <input placeholder='Email' ref={email} type="email" className="registerInput" />
            <input placeholder='Password' ref={password} minLength={6} type="password" className="registerInput" />
            <input placeholder='Password Again' minLength={6} ref={passwordAgain} type="password" className="registerInput" />
            <button className="registerButton" type='submit'>Sign Up</button>
            <button className="RegisterButton">Login Account</button>
          </form>
        </div>
      </div>
    </div>
  )
}
