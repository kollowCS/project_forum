'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ForumList from '@/components/ForumList'
import "./forum.css"

export default function page() {
    const [nextSearch,setNextSearch] = useState("");
    const [search,setSearch] = useState("");
    const handleSearch = (e) => {
        //niope,opepo,esho,trjomismyler
        setSearch(nextSearch);
    }
    return (
        <div>
            <Navbar />
            <div className='pad'>
                <div className='box'>
                    <h1>FORUM</h1>
                    <div className='forummenu'>
                        <div className='left'>
                            <div>    
                                <input type="text" placeholder='Search' onChange={(e)=>{setNextSearch(e.target.value)}}></input>
                                <button name="search" value={search} onClick={handleSearch}>Search</button>
                            </div>
                            <button onClick={
                                ()=>{window.location.href = "/forum/create"}
                            }>New topic</button>
                        </div>
                        <div className='right'>
                        </div>
                    </div>
                    <ForumList filter={search} />
                </div>
            </div>
        </div>
    )
}
