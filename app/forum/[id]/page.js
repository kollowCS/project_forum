'use client'
import React, { useState, useEffect, use} from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/MainAccount'
import UserDisplay from '@/components/UserDisplay'
import TopicCard from '@/components/TopicCard'
import CommentCard from '@/components/CommentCard'
import "@/app/forum/topic.css"

import { useParams } from 'next/navigation'

export default function page() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [topic, setTopic] = useState({});
    const {account, _, accLoading} = useAuth();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const handleCommentSubmit = async (e) => {
        if (!account) return alert("Please login to comment");

        try {
            const res = await fetch(`/api/forum/${id}/comment`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": account.token
                },
                body: JSON.stringify({ 
                    user_id: account.id, 
                    message: comment 
                })
            });

            if (res.ok) {
                console.log("COMMENT SUBMITTED");
                window.location.reload();
            }
        } catch (err) {
            console.error("Comment failed:", err);
        }
    }
    
    const loadComments = async () => {
        const res = await fetch(`/api/forum/${id}/comment`);

        if (res.ok) {
            const data = await res.json();
            setComments(data);
        }
    };

    useEffect(() => {

        const loadTopic = async () => {
            const res = await fetch("/api/forum/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "accountId": account?.id || 0
                }
            });

            if (res.ok) {
                const data = await res.json();
                setTopic(data);
                console.log(account?.id, topic.owner_id)
            }

            setLoading(false);
        };

        loadTopic();
        loadComments();

    }, [account]);

    if (loading) { return <div> <Navbar /> <h2>Loading...</h2> </div> }
    

    return (
        <div>
            <Navbar />
            <TopicCard user={{
                username: topic.username, 
                name: topic.name,
                avatar: topic.avatar
            }} id={topic.id} title={topic.title} desc={topic.description} 
                likes={topic.likes} comments={topic.comments} liked={topic.liked}
                editable={account?.id === topic.owner_id}
            />
            {account &&
            <div className='pad'>
                <div className='semibox'>
                    <textarea placeholder='write a comment here.' value={comment} 
                    onChange={(e)=>{
                        setComment(e.target.value)
                    }}></textarea>
                    <button type="button" onClick={handleCommentSubmit}>Submit</button>
                </div>
            </div>}
            
            {/*  */}

            {comments.map((c) => (
                <CommentCard
                    user={{
                        username: c.username, 
                        name: c.name,
                        avatar: c.avatar
                    }}
                    key={c.id}
                    commentId={c.id}
                    msg={c.message}
                    editable={account?.id === c.user_id}
                />
            ))}
        </div>
    )
}
