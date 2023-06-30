'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConversationContainerComponent(props : any) {
    const [sessionUserName, setSessionUserName] = useState("");
    const [conversations, setConversations] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchSessionUser() {
            try {
                const response = await fetch (`/api/fetchSessionUser`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"},
                    cache : "no-store"
                });

                const data = await response.json();
                console.log(data);
                setSessionUserName(data.sessionUser.name);
            } catch (err) {
                console.error(err);
            }
        }

        fetchSessionUser();

        async function fetchConversations() {
            try {
                const response = await fetch (`/api/fetchConversations`, {
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
                const response = await fetch (`/api/fetchUsers`, {
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
    }, [])

    const [isStartingConversation, setIsStartingConversation] = useState(false);
    const startConversation = () => {
        if (!isStartingConversation) setIsStartingConversation(true);
        else setIsStartingConversation(false)
    }

    const router = useRouter();
    async function checkExistingConversation(clientTwoId : string) {
        try {
            const response = await fetch (`/api/checkExistingConversation`, {
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
        <main className="bg-indigo-600 h-full border-2 w-1/3">
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
                {users.map((user) => (
                    <div key={user.id}>
                        <p> Name : {user.name} </p>
                        <p> Email : {user.email} </p>
                        <button className="bg-cyan-400 rounded-md p-1" onClick={() => checkExistingConversation(user.id)}>Message</button>
                    </div>
                ))}
            </div>
        )} */}

        <button className="bg-cyan-500 rounded-md p-2" onClick={startConversation}>Start New Conversation</button>
        {isStartingConversation && (
            <div>
                {users.map(( user ) => (
                    <div key={user.id}>
                        <p> Name : {user.name} </p>
                        <p> Email : {user.email} </p>
                        <button className="bg-cyan-400 rounded-md p-1" onClick={() => checkExistingConversation(user.id)}>Message</button>
                    </div>
                ))}
            </div>
        )}
        {conversations.map((conversation) => (
            <div key={conversation.id}>
                {conversation.users.length > 2 ? (
                    <div>
                        <p> Name : { conversation.groupChatName } </p>
                        <p> Type : Group Chat </p>
                        <Link href={`message/${conversation.id}`}>Open Group Chat</Link>
                    </div>
                ) : (
                    <div>
                        {sessionUserName === conversation.users[0].name ? (
                            <div>
                                <p> Name : { conversation.users[1].name } </p>
                                <p> Email : { conversation.users[1].email } </p>
                                <button onClick={() => checkExistingConversation(conversation.users[1].id)}>Message</button>
                            </div>
                        ) : (
                            <div>
                                <p> Name : {conversation.users[0].name} </p>
                                <p> Email : {conversation.users[0].email} </p>
                                <button onClick={() => checkExistingConversation(conversation.users[0].id)}>Message</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ))}
        </main>
    )
}