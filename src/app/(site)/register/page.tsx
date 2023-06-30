'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { fetchOriginHost } from "@/libs/utils";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [userType, setUserType] = useState("");
    const router = useRouter();

    const registerUser = async (e : React.SyntheticEvent) => {
        e.preventDefault();

        try {
            const response = await fetch (`/api/register`, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({email, name, userType})
            });

            const data = await response.json();
            if (data.message === "register user") {
                router.push(`/dashboard`)
            } 
        } catch (err) {
            console.error(err);
        }
    } 

    return (
        <main className="flex flex-col items-center justify-center bg-blue-500 h-screen">
             <h1> Register </h1>
             <div>
                 <form className="flex flex-col items-center" onSubmit={registerUser}>
                         <label htmlFor="email">Email : </label>
                         <input type="text"
                             name="email"
                             id="email"
                             value={email}
                             onChange={(e)=>setEmail(e.target.value)}
                             className=" rounded-md" />
                         <label htmlFor="name">Name : </label>
                         <input type="text"
                             name="name"
                             id="name"
                             value={name}
                             onChange={(e)=>setName(e.target.value)} />
                         <label htmlFor="userType">User Type : </label>
                         <input type="text"
                             name="userType"
                             id="userType"
                             value={userType}
                             onChange={(e)=>setUserType(e.target.value)} />
                     <input className="bg-cyan-400 rounded-md p-1" type="submit" />
                 </form>
                 <h1>ONE CLICK FOR THE BRIGHT FUTURE MWHEHEHEHE</h1>
             </div>
        </main>
    )
}