
import React from 'react'
import "./welcome.css"

export default function page() {
  return (
    <div className="box">
      <h1>Welcome to the my Forum website!</h1>
      <p>If you don't have an account, you can <a href="/signup">sign up</a> here!</p>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/forum">Forum</a></li>
        {/* <li><a href="/about">About</a></li> */}
      </ul>
    </div>
  )
}
