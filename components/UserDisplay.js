import React, { useState } from 'react'

export default function UserDisplay({username, name, avatar}) {
  const [isLoaded, setIsLoaded] = useState(false); 
  //Apparently this is a trick to making your image load faster??
  return (
    <div className='userdisplay'>
        <div>
          <img 
            src={avatar || "/fox.png"} 
            decoding='async'
            loading='eager'
            onLoad={() => setIsLoaded(true)}
            style={{ display: isLoaded }}
          />
        </div>
        <h3>{name}</h3>
        <h3>@{username}</h3>
    </div>
  )
}