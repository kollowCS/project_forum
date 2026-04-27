import React from 'react'
import { useAuth,logout } from '@/components/MainAccount';

export default function Navbar() {
  const { account, setAccount, accLoading } = useAuth();
  const handleLogout = (e) => {
    setAccount(null);
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  }
  return (
    <div>
      <nav className="navbar">
        <div className="left">
          <li><a href="/home">Home</a></li>
          <li><a href="/forum">Forum</a></li>
          {/* <li><a href="/about">About</a></li> */}
        </div>
        <div className="right">
          {(!accLoading) &&
            ((account) ? (
              <>
                <li><a onClick={handleLogout}>Logout</a></li>
              </>) : (<>
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Sign up</a></li>
            </>))
          }
        </div>
      </nav>
    </div>
  )
}
