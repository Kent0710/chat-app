'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const [sessionUserName, setSessionUserName] = useState(""); 

    const router = useRouter();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch (`api/fetchUsers`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"}
                });
                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                console.error(err);
            }
        }

        fetchUsers();

        async function fetchSessionUserName() {
            try {
                const response = await fetch (`/api/fetchSessionUser`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"},
                });

                const data = await response.json();
                setSessionUserName(data.sessionUser.name)
            } catch (err) {
                console.error(err)
            }
        }

        fetchSessionUserName();

        async function fetchConversations() {
            try {
                const response = await fetch (`/api/fetchConversations`, {
                    method : "GET",
                    headers : {"Content-Type" : "application/json"}
                });
                const data = await response.json();
                setConversations(data.conversations)
            } catch (err) { 
                console.error(err);
            }
        }

        fetchConversations();
    }, [])

    const [isSearching, setIsSearching] = useState(false);
    const handleSearchFocus = () => {
        if (!isSearching) setIsSearching(true);
        else setIsSearching(false)
    }
    const handleSearchBlur = () => {
        setIsSearching(false);
    }

    const [didOpenAConv, setDidOpenAConv] = useState(false);
    async function checkExistingConversation(clientTwoId : string) {
        setDidOpenAConv(true);

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

    const openConvClick = () => {
        setDidOpenAConv(true);
    }

    return (
        <>
        {!didOpenAConv ? (
            <div className="flex h-full w-full">
                <div className="flex flex-col flex-2 h-full w-full border-0 gap-4 p-4 sm:w-1/6 sm:h-full sm:border-2">
                    <div className="flex items-center justify-between">
                        <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                        <svg className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                            <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                        </svg>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isSearching ? (
                            <div className="flex flex-col w-full gap-3 overflow-auto">
                                <input type="text"
                                    className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0" 
                                    onFocus={handleSearchFocus}
                                    placeholder="Search"
                                    />

                                    <div className="overflow-x-hidden flex flex-col gap-3">
                                        {conversations.length === 0 ? (
                                            <div className="flex flex-col justify-center items-center w-full h-full gap-3">
                                                <h2 className="text-sm text-center font-bold text-gray-400 mt-56"> Click the search or start a conversation button to meet new people </h2>
                                                <h1 className="block sm:hidden text-lg font-bold tracking-tight text-blue-500 rounded-lg bg-slate-100 py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer" onClick={handleSearchFocus}> Start a conversation </h1>
                                            </div>
                                        ) : (
                                            conversations.map((conversation) => (
                                                <div key={conversation.id} className="hover:bg-slate-100">
                                                    {conversation.users.length > 2 ? (
                                                        <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.groupChatName} </h2>
                                                    ) : (
                                                        conversation.users[0].name === sessionUserName ? (
                                                            <div>
                                                                <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.users[1].name} </h2>
                                                                <h3 className="text-sm font-bold mx-2 text-gray-400"> {conversation.users[1].email} </h3>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.users[1].name} </h2>
                                                                <h3 className="text-sm font-bold mx-2 text-gray-400"> {conversation.users[1].email} </h3>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ))                                            
                                        )}
                                    </div>
                            </div>

                        ) : (
                            <div className="flex flex-col w-full gap-3 overflow-auto">
                                <div className="flex gap-2 items-center w-full overflow-x-hidden mb-3">
                                    <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg shrink-0" onClick={handleSearchFocus} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                                    </svg>
                                    <input type="text"
                                        className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0" 
                                        placeholder="Search"
                                        />
                                </div>

                                <div className="overflow-auto flex flex-col gap-3">
                                    {users.map((user) => (
                                        <div key={user.id} className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs" onClick={() => checkExistingConversation(user.id)}>
                                            <h2 className="text-base font-bold mx-2 text-gray-900"> {user.name} </h2>
                                            <h3 className="text-sm font-bold mx-2 text-gray-400"> {user.email} </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-0 h-0 sm:w-full sm:h-full">
                    <h1 className="hidden sm:block text-2xl font-bold tracking-tight text-blue-500 rounded-lg bg-slate-100 py-1.5 px-3"> Start a conversation </h1>
                </div>
            </div>
        ) : (
            <div className="flex w-full h-full items-center justify-center cursor-wait">
                <div className="flex items-center justify-center h-full w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )}
        </>
      );
}