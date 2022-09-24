import React from 'react';
import { useRef, useContext } from 'react';
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core'

export default function Login() {
  const email = useRef()
  const password = useRef()
  const { user, isFetching, dispatch } = useContext(AuthContext)
  
  const handleClick = (e) => {
    e.preventDefault()
    loginCall({email: email.current.value, password: password.current.value}, dispatch)
  }
  console.log(user)
  return (
    <div className='login'>
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Social</h3>
                <span className="loginDesc">Connect with friends and the world around you.</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}>
                  <input placeholder='Email' className="loginInput" required ref={email} />
                  <input placeholder='Password' type="password" className="loginInput" required ref={password}/>
                  <button className="loginButton" type='submit' disabled={isFetching}>{ isFetching ? <CircularProgress color='white' size="20px" /> : "Log In"}</button>
                  <span className="loginForget">Forget Password?</span>
                  <button className="loginRegisterButton">{ isFetching ? <CircularProgress color='white' size="20px" /> : "Create a new Account"}</button>
                </form>
            </div>
        </div>
    </div>
  )
}
