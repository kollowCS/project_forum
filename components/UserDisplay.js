import React from 'react'

export default function UserDisplay({username,name,avatar}) {
  return (
    <div className='userdisplay'>
        <img src={avatar ? `/${avatar}` : "/fox.png"}></img>
        <h3>{name}</h3>
        <h3>@{username}</h3>
    </div>
  )
}
