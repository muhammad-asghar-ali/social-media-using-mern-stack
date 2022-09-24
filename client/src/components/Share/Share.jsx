import React, { useState, useContext, useRef } from 'react'
import './share.css'
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@material-ui/icons"
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

export default function Share() {
    const { user } = useContext(AuthContext)
    const desc = useRef()
    const [file, setFile] = useState(null)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const submitHandler = async (e) => {
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }
        if(file) {
            const data = new FormData()
            const fileName = Date.now() + file.name 
            data.append("file", file)
            data.append("name", fileName)
            newPost.img = fileName
            try{
                axios.post("http://localhost:4000/api/upload", data)
                window.location.reload()
            } catch(err) {
                console.log(err)
            }
        }
        try {
            await axios.post("http://localhost:4000/api/posts", newPost)
        } catch(err){}
    }
    return (
        <div className='share'>
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? user.profilePicture : `${PF}/person/noAvatar.png`} alt="" className="shareProfileImg" />
                    <input placeholder={"what's in your mind " + user.username + "?"} className='shareInput' ref={desc} />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                        <Cancel className='shareCancelImg' onClick={() => setFile(null)} />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor='tomato' className='shareIcon' />
                            <span className="shareOptionText">Photo or Video</span>
                            <input style={{ display: "none" }} type="file" name= "file" id="file" accept='.png, .jpeg, .jpg' onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor='blue' className='shareIcon' />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor='green' className='shareIcon' />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor='goldenrod' className='shareIcon' />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type='submit'>Share</button>
                </form>
            </div>
        </div>
    )
}
