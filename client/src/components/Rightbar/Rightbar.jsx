import React, { useContext } from 'react'
import './rightbar.css'
import { Users } from '../../dummyData'
import Online from '../Online/Online'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Add, Remove } from '@material-ui/icons'

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [friends, setFriends] = useState([])
  const {user: currentUser, dispatch } = useContext(AuthContext)
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id))

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id))
  }, [currentUser, user?._id])

  useEffect(() => {
    const getFreiends = async () => {
      try {
        const friendList = await axios.get("http://localhost:4000/api/users/friends/" + user._id)
        setFriends(friendList.data)
      } catch (err) {
        console.log(err)
      }
    }
    getFreiends()
  }, [user])

  const handleClick = async () => {
    try{  
      if(followed){
        await axios.put("http://localhost:4000/api/users/"+user._id+"/unfollow", {userId: currentUser._id})
        dispatch({type: "UNFOLLOW", payload: user._id})
      } else {
        await axios.put("http://localhost:4000/api/users/"+user._id+"/follow", {userId: currentUser._id})
        dispatch({type: "FOLLOW", payload: user._id})
      }
    } catch(err){
      console.log(err)
    }
    setFollowed(!followed)
  }
  const HomeRightBar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={`${PF}/gift.png`} alt="" className='birthday' />
          <span className="birthdayText"><b>John Doe</b> and <b>3 other friend</b> have a birthday today</span>
        </div>
        <img src={`${PF}/ad.png`} alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className='rightbarFriendList'>
          {Users.map(u => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightBar = () => {
    return (
      <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove /> : <Add /> }
        </button> 
      )}
        <h4 className='rightbarTitle'>User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship</span>
            <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link to={"/profile/" + friend.username} style={{textDecoration: "none"}}>
              <div className="rightbarFollowing">
                <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "/person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
                <div className="rightbarFollowingName">{friend.username}</div>
              </div>
            </Link>
          ))}
        </div>
      </>
    )
  }
  return (
    <div className='rightbar'>
      <div className="rightbarWrapper">
        {user ? <ProfileRightBar /> : <HomeRightBar />}
      </div>
    </div>
  )
}

