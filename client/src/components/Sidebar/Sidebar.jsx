import React from 'react'
import './sidebar.css'
import {RssFeed , Chat, SlowMotionVideo, Group, Bookmark, HelpOutline, Work,Event, Subject } from "@material-ui/icons"
import {Users} from '../../dummyData'
import CloseFriend from '../CloseFriend/CloseFriend'

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <RssFeed className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Feed</span>
                    </li>
                    <li className="sidebarListItem">
                        <Chat className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Chat</span>
                    </li>
                    <li className="sidebarListItem">
                        <SlowMotionVideo className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                        <Group className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Groups</span>
                    </li>
                    <li className="sidebarListItem">
                        <Bookmark className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Bookmarks</span>
                    </li>
                    <li className="sidebarListItem">
                        <HelpOutline className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Questions</span>
                    </li>
                    <li className="sidebarListItem">
                        <Work className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Jobs</span>
                    </li>
                    <li className="sidebarListItem">
                        <Event className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Events</span>
                    </li>
                    <li className="sidebarListItem">
                        <Subject className='sidebarIcon'/>
                        <span className="sidebarListItenTest">Courses</span>
                    </li>
                </ul>
                <button className='sidebarButton'>Show More</button>
                <hr className="sidebarHr" />
                <ul className="sidebarFriendList">
                   {Users.map(u => (
                    <CloseFriend key={u.id} user={u} />
                   ))}       
                </ul>
            </div>  
        </div>
    )
}