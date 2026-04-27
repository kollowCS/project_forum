'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from "next/navigation";
import "@/app/style.css"

export default function page() {
     const router = useRouter()
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [ form, setForm ] = useState({
        username:"",
        name:"",
        email:"",
        password:"",
        cfrmPassword:"",
        avatar:""
    });

    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true); setError("");
        try {
            if (form.password != form.cfrmPassword) {
                throw Error("Password & Confirm password must match each other")
            }
            const res = await fetch("/api/account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                ...form
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Sign up failed");
            alert("Successfully signed up!")
            router.push(`/login`);
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
                    <h1>SIGN UP</h1>
                    <p>Already have an account? <a href="/login">login</a> here!</p>
                    <form onSubmit={onSubmit}>
                        <input type="text" name="username" placeholder='Username' 
                            value={form.username} onChange={handleChange} required />
                        <input type="text" name="name" placeholder='Name' 
                            value={form.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder='Email' 
                            value={form.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder='Password' 
                            value={form.password} onChange={handleChange} required />
                        <input type="password" name="cfrmPassword" placeholder='Confirm password' 
                            value={form.cfrmPassword} onChange={handleChange} required />
                        <button disabled={saving}>{saving ? "Signing..." : "Sign up"}</button>
                        {error && <div style={{ color: "crimson" }}>{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    )
}
