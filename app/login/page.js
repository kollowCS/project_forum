"use client"
import React from 'react'
import Navbar from '@/components/Navbar'
import { useAuth,login,getLogin } from '@/components/MainAccount'
import "@/app/style.css"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";

export default function page() {
    const {account, setAccount} = useAuth();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(null);
    const [ form, setForm ] = useState({
        username:"",
        password:""
    })

    useEffect(() => {
        if (account) {
            router.push(`/home`);
        }
    },[account])
    
    const onSubmit = async (e) => {
        console.log("Submitting form...");
        e.preventDefault(); // stop form reload

        // const res = await fetch("/api/login", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     // your form data
        //   }),
        // });
        setSaving(true);
        try {
            const [res, data] = await login(form.username,form.password);
            console.log(data)
            if (!res.ok) throw new Error(data?.error || "Login failed");
            setAccount(await getLogin());
            router.push(`/home`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    return (
        <div>
            <Navbar />
            <div className='wrapper'>
                <div className='centerbox'>
                    <h1>LOGIN</h1>
                    <p>Don't have an account? <a href="/signup">sign up</a> here!</p>
                    <form onSubmit={onSubmit}>
                        <input type="text" name="username" placeholder='Username' 
                            value={form.username} onChange={handleChange} required />
                        <input type="password" name="password" placeholder='Password' 
                            value={form.password} onChange={handleChange} required />
                        <button disabled={saving}>{saving ? "Logging..." : "Login"}</button>
                        {error && <div style={{ color: "crimson" }}>{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    )
}
