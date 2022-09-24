import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './profile.css'
import axios from 'axios'
import Feed from '../../components/Feed/Feed'
import Rightbar from '../../components/Rightbar/Rightbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Topbar from '../../components/Topbar/Topbar'


export default function Profile() {
    const [user, setUser] = useState({})
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const username = useParams().username
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`http://localhost:4000/api/users?username=${username}`)
            console.log(res)
            setUser(res.data)
        }
        fetchUsers();
    }, [username])

    return (
        <>
            <Topbar />
            <div className='profile'>
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={user.coverPicture ? PF + user.coverPicture : PF + "/person/noCover.jpeg"} alt="" className="profileCoverImg" />
                            <img src={user.profilePicture ? PF + user.profilePicture : PF+"/person/noAvatar.png"} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h1 className="profileInfoName">{user.username}</h1>
                            <span className="profileInfoDesc">{user.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </>
    )
}
