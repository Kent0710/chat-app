'use client'

import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { fetchOriginHost } from "@/libs/utils";

export default function CreateGroupChatPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isSessionUserAdded, setIsSessionUserAdded] = useState(false);
    const [addedUsersId, setAddedUsersId] = useState<any[]>([]);

    const pathname = usePathname();
    const router = useRouter()

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch (`/api/fetchUsers`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"},
                    cache : "no-store"
                });

                const data = await response.json();
                setUsers(data.users);

                if (!isSessionUserAdded) {
                    setAddedUsersId((prevAddedUsersId) => [...prevAddedUsersId, data.sessionUserId]);
                    setIsSessionUserAdded(true);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchUsers();

        console.log(addedUsersId);

    }, [isSessionUserAdded, addedUsersId, pathname])

    const addUserToConversation = (addedUserId : string) => {
        setAddedUsersId((prevAddedUsersId) => [...prevAddedUsersId, addedUserId]);
    }

    const [groupChatName, setGroupChatName] = useState("");
    async function createGroupChat() {
        try {
            const response = await fetch (`/api/${pathname}`, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({groupChatName, addedUsersId})
            });

            const data = await response.json();
            if (data.flag === "success") {
                router.push(`/dashboard`)
            }
        } catch (err) {
            console.error(err);
        }
    } 

    return (
        <main className="flex flex-col bg-blue-500 h-screen">
            <h1>Create Group Chat With : </h1>
            {users.map((user) => (
                <div key={user.id}>
                    <p>Name : {user.name} </p>
                    <p> Email : {user.email} </p>
                    <button onClick={() => addUserToConversation(user.id)}> Add to Conversation </button>
                    <div>====================</div>
                </div>
            ))}
            {/* <button onClick={() => createGroupChat()}>Confirm</button> */}
            <form onSubmit={() => createGroupChat()}>
                <div>
                    <label htmlFor="groupChatName">Group Chat Name : </label>
                    <input type="text"
                        id="groupChatName"
                        name="groupChatName"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)} />
                </div>
                <input type="submit" />
            </form>
        </main>
    )
}