'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import { fetchOriginHost } from "@/libs/utils";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState(""); 

    const router = useRouter();

    const signIn = async (e : React.SyntheticEvent) => {
        e.preventDefault();

        try {

            const response = await fetch (`${fetchOriginHost()}/api/signIn`, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({email, name})
            });

            const data = await response.json();

            if (data.message === "User Found") {
                router.push(`${fetchOriginHost()}/dashboard`)
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="flex flex-col items-center justify-center h-screen bg-blue-500">
            <h1> Sign In</h1>
            <form className="flex flex-col items-center" onSubmit={signIn}>
                    <label htmlFor="email">Email : </label>
                    <input className="rounded-md" type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="name">Name : </label>
                    <input className="rounded-md"  type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                <input className="bg-cyan-300 mt-2 w-20 rounded-md" type="submit" />
            </form>
        </main>
    )
}