'use client'

import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchOriginHost } from "@/libs/utils";

export default function AddFriendPage() {
    const [sessionUserName, setSessionUserName] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([])
    const [isStartingConversation, setIsStartingConversation] = useState(false);


    useEffect(() => {
        async function fetchSessionUser() {
            try {
                const response = await fetch (`https://chat-app-iota-silk.vercel.app/api/fetchSessionUser`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"},
                    cache : "no-store"
                });

                const data = await response.json();
                setSessionUserName(data.sessionUser.name);
            } catch (err) {
                console.error(err);
            }
        }

        fetchSessionUser();

        async function fetchConversations() {
            try {
                const response = await fetch (`https://chat-app-iota-silk.vercel.app/api/fetchConversations`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"},
                    cache : "no-store"
                });

                const data = await response.json();
                setConversations(data.conversations);
            } catch (err) {
                console.error(err);
            }
        }

        fetchConversations();

        async function fetchUsers() {
            try {
                const response = await fetch (`https://chat-app-iota-silk.vercel.app/api/fetchUsers`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"},
                    cache : "no-store"
                });

                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                console.error(err);
            }
        }

        fetchUsers();

    }, []);

    const startConversation = () => {
        setIsStartingConversation(true);
    }

    const router = useRouter();
    async function checkExistingConversation(clientTwoId : string) {
        try {
            const response = await fetch (`https://chat-app-iota-silk.vercel.app/api/checkExistingConversation`, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({clientTwoId})
            });

            const data = await response.json();
            const conversationId = data.conversation.id
            if (data.flag === "success") {
                router.push(`/message/${conversationId}`)
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="bg-blue-500 h-screen flex flex-col items-center justify-center">
            <h1>hi</h1>
        {/* {conversations.length === 0 ? (
            <button className="bg-cyan-500 rounded-md p-2" onClick={startConversation}>Start New Conversation</button>
        ) : (
            conversations.map((conversation) => (
                <div key={conversation.id}>
                    {conversation.users.length > 2 ? (
                        <div>
                            <p>Name : {conversation.groupChatName} </p>
                            <p>Type : Group Chat</p>
                            <Link href={`message/${conversation.id}`}>Open Group Chat</Link>``
                        </div>
                    ) : (
                        <div>
                            {sessionUserName === conversation.users[0].name ? (
                                <div>
                                    <p> Name : {conversation.users[1].name} </p>
                                    <p> Email : {conversation.users[1].email} </p>
                                    <button onClick={() => checkExistingConversation(conversation.users[1].id)}>Message</button>
                                </div>
                            ) : (
                                <div>
                                    <p> Name : {conversation.users[0].name} </p>
                                    <p> Email : {conversation.users[0].email} </p>
                                    <button onClick={() => checkExistingConversation(conversation.users[0].id)}>Message</button>
                                </div>
                            )}
                            ================================
                        </div>
                    )}
                </div>
            ))
        )}
        {isStartingConversation && (
            <div>
                <h1 className="text-center"> Available Users </h1>
                {users.map((user) => (
                    <div key={user.id}>
                        <p> Name : {user.name} </p>
                        <p> Email : {user.email} </p>
                        <button className="bg-cyan-400 rounded-md p-1" onClick={() => checkExistingConversation(user.id)}>Message</button>
                        <div> ================================ </div>
                    </div>
                ))}
            </div>
        )} */}
        </main>
      );
}