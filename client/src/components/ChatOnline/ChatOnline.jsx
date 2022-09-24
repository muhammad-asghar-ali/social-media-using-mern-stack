import axios from 'axios'
import React, {useState, useEffect} from 'react'
import './chatOnline.css'

export default function ChatOnline({onlineUsers, currentId, setCurrentChat}) {
    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("http://localhost:4000/users/friends/"+currentId)
            setFriends(res.data)
        }
        getFriends() 
    }, [currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter(f => onlineUsers.inculdes(f?._id)))
    }, [friends, onlineUsers])

    const handleClick = async (user) => {
        try{
            const res = await axios.get(`http://loaclhost:4000/conversations/find/${currentId}/${user?._id}`)
            setCurrentChat(res.data)
        } catch(err){
            console.log(err)
        }
    }

    return (
        <div className='chatOnline'>
        {onlineFriends.map(o => (
            <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
                <div className="chatOnlineImgConainner">
                    <img src={o?.profilePicture ? PF + o?.profilePicture : PF+'person/noAvatar.png'} alt="" className="chatImg" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{o.username}</span>
            </div>
        ))}
        </div>
    )
}
