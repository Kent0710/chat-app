'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);

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
    }, [])

    const [isSearching, setIsSearching] = useState(false);
    const handleSearchFocus = () => {
        setIsSearching(true);
    }
    const handleSearchBlur = () => {
        setIsSearching(false);
    }

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
        <>
            <div className="flex h-full w-full">
                <div className="flex flex-col flex-2 h-full w-full border-0 gap-4 p-4 sm:w-1/6 sm:h-full sm:border-2">
                    <div className="flex items-center justify-between">
                        <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                        <svg className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                            <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                        </svg>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSearching && (
                            <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                            </svg>
                        )}
                        <input type="text" 
                            className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur} 
                            placeholder="Search" />
                    </div>
                    <div className="overflow-auto flex flex-col gap-2">
                        {users.map((user) => (
                            <div key={user.id} className="overflow-x-hidden flex flex-col hover:bg-slate-100 hover:cursor-pointer hover:rounded-xs" onClick={() => checkExistingConversation(user.id)}>
                                <h2 className="text-base font-bold mx-2 text-gray-900"> {user.name} </h2>
                                <h3 className="text-sm font-bold mx-2 text-gray-400"> {user.email} </h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-0 h-0 sm:w-full sm:h-full">
                    <h1 className="hidden sm:block text-2xl font-bold tracking-tight text-blue-500 rounded-lg bg-slate-100 py-1.5 px-3"> Start a conversation </h1>
                </div>
            </div>
        </>
      );
}