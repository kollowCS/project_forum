'use client'
import React from 'react'
import UserDisplay from '@/components/UserDisplay'
import { useState, useEffect } from 'react';

export default function ForumList({filter=''}) {
    const fakeForums = [
        {
            id: 1,
            username: "user123",
            title: "How to bite a dog?",
            description: "I want to bite a dog but I don't know how. Can someone help me?",
            comments: 0,
            likes: 0
        },
        {
            id: 2,
            username: "user253",
            title: "How do I make my own forum?",
            description: "I tried asking a ChatGPT to help me make a forum but it just gave me a blank page. Can someone help me?",
            comments: 0,
            likes: 0
        },
        {
            id: 3,
            username: "user498",
            title: "Check out my new forum!",
            description: "I just made a new forum and I want to share it with you all! Check it out at www.ipgrabber.com!",
            comments: 0,
            likes: 0
        },
    ]
    const [forums, setForums] = useState(fakeForums);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    
    const loadForum = async () => {
        setLoading(true)
        const res = await fetch("/api/forum?page=" + page + "&search=" + filter, {
            method: "GET",
            headers: {}
        });
        if (res.ok) {
            const data = await res.json();
            //console.log("FORUM HERE: ")
            //console.log(data);
            setForums(data);
        }
        setLoading(false)
    }
    useEffect(() => {
        loadForum()
    },[page]);
    //if (filter) {
    useEffect(() => {
        loadForum()
    },[filter]);
    //}
    

    if (loading) { return <h3> LOADING... </h3>}
    return (
    <div className="forumFrame">
        {forums.map((forum) => (
            <div className="forumCard" key={forum.id} 
                onClick={()=>{
                    window.location.href = "/forum/" + forum.id;
                }}>
                <div className='line'><h2>{forum.title}</h2> <UserDisplay username={forum.username} name={forum.name} avatar={forum.avatar} /> </div>
                <p>{forum.description}</p>
                <div className='line'><h4>Likes: {forum.likes}</h4> <h4> Comments: {forum.comments}</h4> </div>
            </div>
        ))}
        <div className='forummenu'>
            <div className='left'>
                <button disabled={page<=1} onClick = {()=>{setPage(page-1)}}>Previous</button>
                <h3>{page}</h3>
                <button disabled={page>=100} onClick = {()=>{setPage(page+1)}}>Next</button>
            </div>
        </div>
    </div>
    );
}
