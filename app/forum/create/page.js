'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/MainAccount'
import "@/app/forum/topic.css"
export default function page() {
    const { account, setAccount, accLoading } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    
    if (accLoading) return <div>Loading...</div>;

    const [form, setForm] = useState({
        title: '',
        description: '',
    });

    const [submitting, setSubmit] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(()=>{
        setForm(prev => ({ //SET OWNER_ID TO ACCOUNT.ID 
            ...prev,
            owner_id: account?.id
        }));
    },[account])

    const handleSubmit = async (e) => {
        if (submitting) {return}
        e.preventDefault();
        setSubmit(true)
        try {
             const response = await fetch('/api/forum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form), // Sending the 'form' object
            });
            const data = await response.json();
            console.log("NEW FORUM");
            console.log(data);
            if (response.ok) {
                router.push("/forum/"+data.id);
            }
        } catch (error) {
            console.error("Submission failed:", error);
        }
        setSubmit(false)
    }
    const handleCancel = (e) => {
        const yes = confirm("Cancel this topic?");
        if (yes) {
            router.push("/forum");
        }
    }

    return (
        <div>
            <Navbar/>
            <div className='pad'>
                <div className='box'>
                    <h1>NEW TOPIC</h1>
                    <form onSubmit={handleSubmit}>
                        <input 
                            name="title" className='title' type="text"  placeholder='Title' value={form.title} // Updated to form.title
                            onChange={handleChange}
                            required
                        />
                        <textarea 
                            name="description"  className='desc' placeholder='Description' value={form.description} // Updated to form.description
                            onChange={handleChange}
                        />
                        <div className='line'>
                            <button disabled={submitting} type='submit'>{!submitting ? "Submit" : "Submitting"}</button>
                            <button disabled={submitting} onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}