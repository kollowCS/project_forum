'use client'
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export default function MainAccount({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  //Auto-login on refresh
  useEffect(() => {
    const loadAcc = async () => {
      setLoading(true);
      
      const data = await getLogin();
      //console.log(data);
      setAccount(data);
      setLoading(false);
      console.log("LOADED");
    }
    loadAcc()
  }, []);

  useEffect(() => {
    console.log("Current account state:", account);
  }, [account]);

  return (
    <AuthContext.Provider value={{ account, setAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export async function getLogin() {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  if (!token) return null;

  console.log(token);
  console.log(id);
  const res = await fetch("/api/login", {
    method: "GET",
    headers: {
      "Authorization": token,
      "AccountId": id 
    }
  });

  if (res.ok) {
    return res.json(); // This is your 'account' object
  }
  
  return null;
}

export const useAuth = () => useContext(AuthContext);

export async function login(user, pass) {
  const res = await fetch("/api/login", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        username: user,
        password: pass
      })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token",data.token)
    localStorage.setItem("id",data.id)
    //setAccount(data)
  }
  return [res,data]
}