'use client'

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const [sessionUserName, setSessionUserName] = useState(""); 
    const [sessionUserEmail, setSessionUserEmail] = useState("");

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
                setSessionUserEmail(data.sessionUser.email)
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
                console.log(data);
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

    const openConversation = (conversationId : string) => {
        router.push(`/message/${conversationId}`)
      }

    const [isViewingAcc, setIsViewingAcc] = useState(false);
    const handleViewAccClick = () => {
        if (!isViewingAcc) setIsViewingAcc(true);
        else setIsViewingAcc(false);
    }

    const [isEditingAcc, setIsEditingAcc] = useState(false);
    const handleEditAccClick = () => {
        if (!isEditingAcc) setIsEditingAcc(true);
        else setIsEditingAcc(false)
    }

    const [newEmailAdd, setNewEmailAdd] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const updateProfile = async (e : React.SyntheticEvent) => {
        if (newEmailAdd === "" && newUsername === "") {
          alert("Changes not saved")
          setIsEditingAcc(false);
          return;
        }

        e.preventDefault();

        try {
          const response = await fetch (`/api/updateProfile`, {
            method : "PATCH",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({newEmailAdd, newUsername})
          });
          const data = await response.json();
          if (data.success) location.reload();
        } catch (err) {
          console.error(err);
        }
    }

    const [isDeletingAcc, setIsDeletingAcc] = useState(false);
    const handleDeleteAccClick = () => {
        if (!isDeletingAcc) setIsDeletingAcc(true);
        else setIsDeletingAcc(false);
    }

    const [isDeletingAccInvoked, setIsDeletingAccInvoked] = useState(false);
    const deleteAccount = async (e : React.SyntheticEvent) => {
        setIsDeletingAccInvoked(true);
        e.preventDefault();

        try {
          const response = await fetch (`/api/deleteAccount`, {
            method : "DELETE",
            headers : {"Content-Type" : "application/json"}
          });
          const data = await response.json();
          setIsDeletingAccInvoked(false);
          if (data.success) router.push("/")
        } catch (err) {
          console.error(err);
        }
    }

    return (
        <>
        {!didOpenAConv ? (
            <div className="flex h-full w-full">
                {isViewingAcc && (
                    <div className="absolute z-10 w-full h-full flex flex-col sm:static sm:w-1/6 gap-4 p-4 bg-white">
                        <div className="flex justify-between w-full">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900"> Settings </h1>
                            <svg onClick={handleViewAccClick} className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                              <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
                            </svg>
                        </div>
                    <div className="flex flex-col items-center gap-1">
              <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
              </svg>
              <h1 className="text-2xl font-bold text-gray-900"> {sessionUserName} </h1>
              <h1 className="text-lg font-bold text-gray-400"> {sessionUserEmail} </h1>
            </div>

            <div className="flex flex-col w-full my-4 gap-3">
              <h1 className="text-base font-bold tracking-tight text-gray-900"> Actions </h1>

              <div onClick={handleEditAccClick} className="flex gap-3 mx-4 hover:bg-slate-300 hover:cursor-pointer open:bg-blue-200">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z"/>
                </svg>
                <h1> Edit profile </h1>
              </div>

              <div onClick={handleDeleteAccClick} className="flex gap-3 mx-4 hover:bg-slate-300 hover:cursor-pointer open:bg-blue-200">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                </svg>
                <h1> Delete account </h1>
              </div>

            </div>
          </div>
        )}

        {isEditingAcc && (
          <div className="flex items-center justify-center h-full flex-col w-full absolute bg-white/5 backdrop-blur-lg z-20">

            <div className="flex flex-col h-full w-full sm:w-4/5 md:w-4/5 lg:w-1/3 sm:h-fit bg-white sm:bg-slate-300 rounded-3xl p-5 border-1 border-blue-500">

              <div className="flex w-full justify-between">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z"/>
                </svg>
                <h1 className="text-2xl font-bold text-gray-900"> Edit profile </h1>
                <svg onClick={handleEditAccClick} className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </div>

              <div className="flex flex-col items-center gap-1 my-5">
                <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                <h1 className=" text-xl font-bold text-gray-900"> {sessionUserName} </h1>
                <h1 className="text-lg font-bold text-gray-400"> {sessionUserEmail} </h1>
              </div>

              <form onSubmit={updateProfile} className="flex flex-col gap-4 px-20">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      New Email address
                  </label>
                  <div className="mt-2">
                      <input type="email"
                          id="newEmailAdd"
                          name="newEmailAdd"
                          value={newEmailAdd}
                          onChange={(e) => setNewEmailAdd(e.target.value)}
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 px-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 " />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      New Username
                  </label>
                  <div className="mt-2">
                      <input type="name"
                          name="newUsername"
                          value={newUsername}
                          id="newUsername"
                          onChange={(e) => setNewUsername(e.target.value)}
                          autoComplete="name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 px-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 " />
                  </div>
                </div>
                <button type="submit"
                  className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Update profile
                </button>
              </form>

            </div>

          </div>
        )}

        {isDeletingAcc && (
          <div className="flex items-center justify-center h-full flex-col w-full absolute bg-white/5 backdrop-blur-lg z-20">
            
            <div className="flex flex-col h-full w-full sm:w-4/5 md:w-4/5 lg:w-1/3 sm:h-fit bg-white sm:bg-slate-300 rounded-3xl p-5 border-1 border-blue-500">

              <div className="flex w-full justify-between">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z"/>
                </svg>
                <h1 className="text-2xl font-bold text-red-500"> Delete account </h1>
                <svg onClick={handleDeleteAccClick} className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </div>

              <div className="flex flex-col items-center gap-1 my-5">
                <svg className="w-14 h-14 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                <h1 className=" text-xl font-bold text-gray-900"> {sessionUserName} </h1>
                <h1 className="text-lg font-bold text-gray-400"> {sessionUserEmail} </h1>
                <h2 className="text-sm"> Are you sure you want to delete your account? </h2>

                <div className="flex flex-col gap-3 w-full justify-center items-center">
                  <button onClick={deleteAccount}
                    className="flex mt-6 w-2/4 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Confirm
                  </button>
                  <h3 className="text-sm font-bold text-red-600">Your account would be gone forever!</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDeletingAccInvoked && (
            <div className="absolute z-50 flex items-center justify-center w-full h-full cursor-wait bg-white/5 backdrop-blur-lg">
              <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
              Deleting Account...
            </button>
          </div>
        )}

                <div className="flex flex-col flex-2 h-full w-full border-0 gap-4 p-4 sm:w-1/6 sm:h-full sm:border-2">
                    <div className="flex items-center justify-between">
                        <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                        <svg onClick={handleViewAccClick} className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
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
                                                <div key={conversation.id} className="hover:bg-slate-100 hover:cursor-pointer" onClick={() => openConversation(conversation.id)}>
                                                    {conversation.users.length > 2 ? (
                                                        <div>
                                                            <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.groupChatName} </h2>
                                                            <h3 className="text-sm font-bold mx-2 text-gray-400 w-full"> group chat </h3>
                                                        </div>
                                                    ) : (
                                                        conversation.users[0].name === sessionUserName ? (
                                                            <div>
                                                                <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.users[1].name} </h2>
                                                                <h3 className="text-sm font-bold mx-2 text-gray-400"> {conversation.users[1].email} </h3>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.users[0].name} </h2>
                                                                <h3 className="text-sm font-bold mx-2 text-gray-400"> {conversation.users[0].email} </h3>
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