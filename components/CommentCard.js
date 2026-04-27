import React from 'react'
import UserDisplay from './UserDisplay'
import { useState, useEffect } from 'react'

export default function CommentCard({user,commentId,msg,editable=false}) {
    const [editing, setEditing] = useState(false);

    const handleEdit = () => {
        setEditing(true);
    };

    // The onCancel handler (to switch back)
    const handleCancel = () => {
        setEditing(false);
    };

    const handleDelete = async () => {
        const yes = confirm(
            "Delete this comment?"
        );
        if (!yes) return;
        try {
            const res = await fetch(`/api/forum/${commentId}/comment`,
                {method: "DELETE"}
            );
            if (res.ok) {
                //something.tfbthdsneb
                window.location.reload();
            }
        } catch (err) {
            console.error(
                "Delete failed:",
                err
            );
        }
    };

    const handleSubmit = async (e) => {
        //e.preventDefault();
        const newMsg = e.target.elements[0].value; 
        
        try {
            const res = await fetch(`/api/forum/${commentId}/comment`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ msg: newMsg })
            });
            console.log("Edited")
            if (res.ok) {
                setEditing(false);
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <div className='pad'>
            <div className='semibox'>
                <UserDisplay username={user.username} name={user.name} avatar={user.avatar}/>
                {!editing ? (
                <>
                    <p>{msg}</p>
                    {editable ? (
                    <>
                        <button type='button' onClick={handleEdit}>Edit</button>
                        <button type='button' onClick={handleDelete}>Delete</button>
                    </>
                    ) : (<></>)}
                </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <textarea className='desc' placeholder='Comment' defaultValue={msg}/>
                        <button type='submit'>Save changes</button>
                        <button type='button' onClick={handleCancel}>Cancel</button>
                    </form>
                )}
            </div>
        </div>
    )
}
