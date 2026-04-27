'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/MainAccount';
import "./home.css"

export default function Page() {
    const { account, setAccount, accLoading } = useAuth();
    const [ loading, setLoading ] = useState();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        avatar: null
    });

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }));
    };

    //HUMAN LABOR... 1/10
    // const handleSubmit = (e) => {
    //     // e.preventDefault();

    //     console.log(form);

    //     fetch("/api/account/"+account.id+"", {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": account.token
    //         },
    //         body: JSON.stringify({
    //             name: form.name,
    //             email: form.email,
    //             password: form.password,
    //             avatar: form.avatar
    //         })
    //     });
    // };

    //EVIL AI LABOR 10/10
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        
        if (form.avatar) {
            formData.append("avatar", form.avatar);
        }

        try {
            const res = await fetch("/api/account/" + account.id, {
                method: "PUT",
                headers: {
                    "Authorization": account.token 
                },
                body: formData 
            });

            const updatedUser = await res.json();

            if (res.ok) {
                setAccount(updatedUser); 
                alert("User updated");
                window.location.reload();
            } else {
                alert(updatedUser.message || "failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    if (accLoading) return <div>Loading...</div>;

    useEffect(() => {
        const loadForm = async () => {
            if (account) {
                setLoading(true)
                let avatarFile=null;
                if(account.avatar){
                    const urlToFile = async (url,filename,type) => { //CONVERT STRING URL TO FILE
                        const res=await fetch(url);

                        const blob=await res.blob();

                        return new File([blob],filename,{type});
                    }

                    avatarFile=await urlToFile(
                        account.avatar, //URL
                        "avatar.png", //NAME
                        "image/png" //FILE TYPE
                    );
                }

                setForm({
                    name: account.name,
                    email: account.email,
                    password: account.password,
                    avatar: avatarFile
                })
                setLoading(false)
            }
        }
        loadForm()
    },[account])

    if (accLoading) return <h1>Loading...</h1>;
    
    return (
        <div>
            <Navbar />

            <div className='pad'>
                <div className='box'>
                    <h1>HOME</h1>
                
                    {(account) ? (
                        (!loading) ? (<>
                            <div className='profile'>
                                <img src={account.avatar} alt="profile" />
                                <h3>{account.name}</h3>
                                <h2>@{account.username}</h2>
                            </div>

                            <div className='slide'>
                                <h2>Profile</h2>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className='infoBox'>
                                    <h3>Name:</h3>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={form.name ?? ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='infoBox'>
                                    <h3>Email:</h3>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={form.email ?? ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='infoBox'>
                                    <h3>Password:</h3>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={form.password ?? ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='infoBox'>
                                    <h3>Avatar:</h3>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                </div>

                                <button type='submit'>Apply</button>

                            </form>
                        </>) : <h4>LOADING PROFILE...</h4>
                    ) : (
                        <p>
                            <a href="/login">Login</a> to see your homepage.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}