'use client'
import React from 'react'
import UserDisplay from './UserDisplay'
import { useAuth } from '@/components/MainAccount'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function topicCard({id,user,title,desc,likes,comments,liked=false,editable=false}) {
    const { account } = useAuth();
    const [editing, setEditing] = useState(false);
    const router = useRouter();
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likes);
    //console.log("EDITABLE TOPIC:")
    //console.log(editable)

    //console.log(liked,isLiked)

    const handleEdit = () => {
        setEditing(true);
    };
    const handleDel = async (e) => {
        setSaving(true)
        e.preventDefault();
        const yes = confirm("Do you want to delete this topic?");
        if (yes) {
            try {
                const res = await fetch("/api/forum/"+id, {
                    method: "DELETE",
                    headers: {}
                });
                if (!res.ok) {data = await res.json(); throw new Error(data?.error || "Delete failed");}
                alert("Topic deleted.");
                router.push(`/home`);
            } catch (err) {
                setError(err.message);
            } finally {
                console.log("DONE")
                setSaving(false);
            }
        }
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSubmit = async (e) => {
        setSaving(true);
        setError(null);

        const formData = new FormData(e.target);
        const updatedData = {
            title: formData.get('title'),
            description: formData.get('description')
        };

        try {
            const res = await fetch(`/api/forum/${id}`, {
                method: "PUT", // Swapped to PUT
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error || "Update failed");
            }

            setEditing(false);
            router.refresh(); 
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLike = async () => {
        if (!account) return alert("Please login to like!");

        const previousLiked = isLiked;
        const previousCount = likeCount;
        
        setIsLiked(!previousLiked);
        setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            const res = await fetch(`/api/forum/${id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: account.id })
            });

            if (!res.ok) {
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
            }
        } catch (err) {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            console.error("Like error:", err);
        }
    };

    useEffect(()=>{
        setIsLiked(liked)
    },[liked])

    return (
        <div className='pad'>
            <div className='box'>
                <UserDisplay 
                    username={user.username} 
                    name={user.name} 
                    avatar={user.avatar} 
                    />
                {!editing ? (
                <>
                    <h1>{title}</h1>
                    <p>{desc}</p>
                    <div className='line'><h4>Likes: {likeCount}</h4> <h4> Comments: {comments}</h4> </div>
                    <div className="line">
                        {editable ? (
                        <>
                            <button type='button' onClick={handleEdit}>Edit</button>
                            <button type='button' onClick={handleDel}>Delete</button>
                        </>) : (<></>)}
                        <button type='button' onClick={handleLike}>{isLiked ? "Unlike" : "Like"}</button>        
                    </div>
                </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input 
                            name="title"
                            className='title' 
                            type="text" 
                            placeholder='title'
                            defaultValue={title} 
                            required
                        />
                        <textarea 
                            name="description"
                            className='desc' 
                            placeholder='description'
                            defaultValue={desc}
                        />
                        <button type='submit' disabled={saving}>
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                        <button type='button' onClick={handleCancel}>Cancel</button>
                        {error && <div style={{ color: "crimson" }}>{error}</div>}
                    </form>
                )}
            </div>
        </div>
    )
}
