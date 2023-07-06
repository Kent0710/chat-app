'use client'

import { use, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import React from "react";
import { pusherClient } from "@/libs/pusher";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConversationContainerComponent from "@/app/components/conversationContainer/page";
import MessageContainerComponent from "@/app/components/messageContainer/page";

export const dynamic = 'force-dynamic'

export default function MessagePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [isViewingMembers, setIsViewingMembers] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false)
  const [users, setUsers] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState("");

  const [conversations, setConversations] = useState<any[]>([]);

  const pathname = usePathname();

  const [addedUsersId, setAddedUsersId] = useState<any[]>([]);
  const [addedUsersName, setAddedUsersName] = useState<any[]>([]);

  const [isSessionUserIdAdded, setIsSessionUserIdAdded] = useState(false);

  useEffect(() => {
    const conversationId = pathname.replace(/.*\/([^/]+)$/, "$1");

    async function fetchConversationData() {
      try {
        const response = await fetch (`/api/${conversationId}/fetchConversationData`, {
          method : "GET",
          headers : {"Content-Type" : "application/json"},
          cache : "no-store",
        });
        
        const data = await response.json();
        console.log(data)
        setConversationId(data.conversationId)
        setSenderName(data.sender.name);
        setMembers(data.members);
        setMessages(data.messages);
        setReceiver(data.receiver);
        setIsGroupChat(data.isGroupChat);
      } catch (err) {
        console.error(err);
      }
    }

    fetchConversationData();

    async function fetchUsers() {
      try {
        const response = await fetch (`/api/fetchUsers`, {
          method : "GET",
          headers : {"Content-Type" : "application/json"}
        });

        const data = await response.json();
        setUsers(data.users);
        if (!isSessionUserIdAdded) {
          setAddedUsersId((prevAddedUsersId => [...prevAddedUsersId, data.sessionUserId]))
          setIsSessionUserIdAdded(true);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchUsers();

    // fetch all added users to converasation when creating group chat
    async function fetchAddedUsers() {
      try {
        const response = await fetch (`/api/fetchAddedUsers`, {
          method : "POST",
          headers : {"Content-Type" : "application/json"},
          body : JSON.stringify({addedUsersId})
        });
        const data = await response.json();
        setAddedUsersName(data.usernames)
      } catch (err) {
        console.error(err);
      }
    } 

    if (addedUsersId.length !== 0) fetchAddedUsers();

    async function fetchConversations() {
      try {
        const response = await fetch ('/api/fetchConversations', {
          method : "GET",
          headers : {"Content-Type" : "application/json"},
        })
        const data = await response.json();
        setConversations(data.conversations)
      } catch (err) {
        console.error(err);
      }
    }

    fetchConversations();

    // const channel = pusherClient.subscribe(`new-message-${senderName}`);

    // channel.bind('new-message', (data : any) => {
    //   // append the new message here
    //   setMessages((prevMessages) => [...prevMessages, data.newMessage])

    //   console.log(data.newMessage);
    //   console.log(`New message sent by ${data.newMessage.sender.name}`)
    // })

  }, [pathname, senderName, addedUsersId, isSessionUserIdAdded]);

  const [isSending, setIsSending] = useState(false);
  const sendMessage = async (e : React.SyntheticEvent) => {
    setTitle("");
    e.preventDefault();

    try {
        const response = await fetch (`/api${pathname}/sendMessage`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({title})
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
  }

  const viewMembers =  () => {
    if (!isViewingMembers) {
      setIsViewingMembers(true)
    } else {
      setIsViewingMembers(false)
    }
  }

 async function addUserClicked() {
  if (!isAdding) {
    setIsAdding(true)
  } else {
    setIsAdding(false)
  }
}

  async function addUser(userId : string) {
    for (let i = 0; i < members.length; i++) {
      if (members[i].id === userId) {
        alert("Member already added")
        return;
      }
    }

    try {
      const response = await fetch (`/api/${pathname}/addUser`, {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({userId})
      })

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeUser(userId : string) {
    try {
      const response = await fetch (`/api/${pathname}/removeUser/${userId}`, {
        method : "DELETE",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({userId})
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  const ReceiverNameComponent = () => {
    return (
        <div className="bg-slate-600 w-full h-10 flex items-center justify-center">
            Receiver : {receiver}
        </div>
    )
  }

  const MessageContainer = (props : any) => {
    let msgStyle = "flex flex-col w-full items-center bg-red-400 p-4"

    return (
      <>
        {messages.map((message) => (
          <div key={message.id} className={msgStyle}>
            <p className=" text-lg"> Title : {message.title} </p>
            <p> Sent by : {message.sender.name} </p>
          </div>
        ))}
      </>
    )
  }

  const MessageComponent = () => {
    return (
      <div className="bg-slate-200 w-full h-full overflow-auto flex flex-col gap-1">
        <MessageContainer />
      </div>
    )
  }

  const inputRef = React.useCallback((node : any) => {
    if (node !== null) {
      node.focus();
    }
  }, []);
  const SendMessageComponent = () => {

    return (
      <div className='bg-slate-600 w-full h-24 flex flex-row-reverse items-center'>
        <form onSubmit={sendMessage}>
          <input type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            ref={inputRef} /> 
          <input className="bg-cyan-500 rounded-md p-1 ml-2" type="submit" />
        </form>
      </div>
    )
  }
 
  const MessagePanel = () => {
    return(
      <main className="bg-slate-400 w-full h-full flex flex-col">
        <ReceiverNameComponent />
        <MessageComponent />
        <SendMessageComponent />
      </main>
    )
  }

  

  const [isSearching, setIsSearching] = useState(false);

    const handleSearchFocus = () => {
        if (!isSearching) setIsSearching(true);
        else setIsSearching(false)
    }

    const handleSearchBlur = () => {
        setIsSearching(false);
    }

    const [isAddingGCName, setIsAddingGCName] = useState(false);
    const handleAddGCNameFocus = () => {
      setIsAddingGCName(true);
    }

    const handleAddGcNameClose = () => {
      setIsAddingGCName(false);
    }

    const handleAddGCNameBlur = () => {
      setIsAddingGCName(false);
    }
 
    const [isChatting, setIsChatting] = useState(false);
    const handleChatClick = () => {
        setIsChatting(true);
    }

    const [isViewConvo, setIsViewConvo] = useState(false);
    const handleViewConvoClick = () => {
        if(!isViewConvo) setIsViewConvo(true)
        else setIsViewConvo(false)
    }

    const [isCreatingGC, setIsCreatingGC] = useState(false);
    const handleCreateGCClick = () => {
      if (!isCreatingGC) {
        setIsCreatingGC(true);
      } else {
        setIsCreatingGC(false);
    }
  }

    const [isViewSettings, setIsViewSettings] = useState(false);
    const handleSettingsClick = () => {
      if (!isViewSettings) {
        setIsViewSettings(true);
      } else {
        setIsViewSettings(false);
        setIsCreatingGC(false);
      }
    }

    // Add a user to conversation
    const addUserToGC = (addedUserId : string) => {
      let isValid = addedUsersId.includes(addedUserId)

      if (!isValid) setAddedUsersId((prevAddedUsersId) => [...prevAddedUsersId, addedUserId]);
      else alert ("user already added")
    }
    //not working
    const removeUserToGC = (addedUserName : string, addedUserId : string) => {
      setAddedUsersId((prevAddedUsersId) =>
        prevAddedUsersId.filter((id) => id !== addedUserId)
      )

      setAddedUsersName((prevAddedUsersName) => 
        prevAddedUsersName.filter((name) => name !== addedUserName)
      )
    };

    const [groupChatName, setGroupChatName] = useState("");
    const [didCreateGC, setDidCreateGC] = useState(false);
    const createGroupChat = async (e : React.SyntheticEvent) => {
      e.preventDefault();
      setDidCreateGC(true);

      try {
        const response = await fetch (`/api/createGroupChat`, {
          method : "POST",
          headers : {"Content-Type" : "application/json"},
          body : JSON.stringify({groupChatName, addedUsersId})
        });
        const data = await response.json();
        if (data.flag === "success") router.push(`/message/${data.conversation.id}`)
      } catch (err) {
        console.error(err);
      }
    }

  async function deleteConversation(conversationId : string) {
    try {
      const response = await fetch (`/api/${conversationId}/deleteConversation`, {
        method : "DELETE",
        headers : {"Content-Type" : "application/json"}
      })
      const data = await response.json();
      console.log(data);
      if (data.flag) router.push(`/dashboard`)
    } catch (err) { 
      console.error(err);
    }
  }

  async function checkExistingConversation(clientTwoId : string) {
    try {
        const response = await fetch (`/api/checkExistingConversation`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({clientTwoId})
        });
        const data = await response.json();
        console.log(data);
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

  return (
    <>
      <div className="flex h-full w-full ">
        <div className="hidden sm:flex sm:flex-col sm:flex-2 h-0 w-0 border-0 gap-4 p-4 sm:w-1/6 sm:h-full sm:border-2">
          <div className="flex items-center justify-between">
            <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
            <svg className="w-[34px] shrink-0 h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
            </svg>  
          </div> 

          <div className="flex items-center gap-2">
            {!isSearching ? (
              <div className=" flex flex-col w-full gap-3 overflow-auto">
                <input type="text" 
                  className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                  onFocus={handleSearchFocus}
                  placeholder="Search" />

                  <div className="overflow-x-hidden flex flex-col gap-3">
                    {conversations.map((conversation) => (
                      <div key={conversation.id} className="hover:bg-slate-100 hover:cursor-pointer active:cursor-progress" onClick={() => openConversation(conversation.id)}>
                        {conversation.users.length > 2 ? (
                          <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.groupChatName} </h2>
                        ) : (
                          conversation.users[0].name === senderName ? (
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
                    ))}
                  </div>
              </div>
              
            ) : (
              <div className="flex flex-col w-full gap-3 overflow-auto">
                <div className="flex gap-2 items-center w-full overflow-x-hidden mb-3">
                  <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg shrink-0" onClick={handleSearchFocus} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                  </svg>
                  <input type="text" 
                    className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                    placeholder="Search" />
                </div>

                <div className="overflow-auto flex flex-col gap-3 ">
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

        <div className="flex flex-col w-full h-full">
          <div className="flex border-y-2 w-full items-center justify-between">
            <div className="flex items-center mx-3">
                <svg onClick={handleViewConvoClick} className="w-[34px] h-[34px] text-gray-800 dark:text-white sm:hidden rounded-lg p-2 bg-slate-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                </svg>
                <h1 className=" text-lg font-bold text-gray-900 m-3"> {receiver} </h1>
            </div>
            <svg className="sm:block w-[34px] h-[34px] text-gray-800 dark:text-white rounded-lg p-2 bg-slate-200 mx-3" onClick={handleSettingsClick} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
            </svg>
          </div>

          <div className="w-full h-full overflow-auto flex flex-col">
            <div className="w-full flex flex-col">
              {messages.map((message) => 
                message.sender.name === senderName ? (
                  <div key={message.id} className="flex flex-row-reverse items-center text-white gap-2 p-3">
                    <svg className="w-[32px] h-[32px] shrink-0 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <p className="bg-blue-500 rounded-lg px-4 py-2 whitespace-pre-wrap">
                      {message.title}
                    </p>
                  </div>
                ) : (
                  <div key={message.id} className="flex items-center text-white gap-2 p-3">
                    <svg className="w-[32px] h-[32px] shrink-0 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <p className="bg-blue-500 rounded-lg px-4 py-2 whitespace-pre-wrap">
                      {message.title}
                    </p>
                  </div> 
                )
              )}
            </div>
          </div>

            <form onSubmit={sendMessage} className="flex flex-row-reverse border-y-2 h-16 p-2">
              {!isSending ? (
                <button type="submit">
                  <svg className="block w-[38px] h-[38px] text-gray-800 dark:text-white rounded-lg p-2 bg-blue-200 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="blue" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                  </svg>
                </button>
              ) : (
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 m-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    <span className="sr-only">Loading...</span>
                </div>
              )}
              <input type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 "  />
            </form>
        </div>

        {isViewConvo && (
          <div className="absolute h-full sm:hidden">
            <div className="flex flex-col flex-2 h-full w-full border-2 gap-4 p-4 md:w-1/6 md:h-full md:border-2 bg-white">
              <div className="flex items-center justify-between">
                <h1 className="md:block text-2xl font-bold tracking-tight text-gray-900"> Chats </h1>
                <div className="flex items-center gap-1">
                    <svg className="w-[34px] h-[34px] text-gray-800 rounded-lg bg-slate-200 p-2 md:block dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                        <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                    </svg>
                    <svg onClick={handleViewConvoClick} className="w-[34px] h-[34px] bg-slate-200 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                        <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
                    </svg>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isSearching ? (
                  <div className="flex flex-col w-full gap-3 overflow-auto">
                    <input type="text"
                      className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0" 
                      onFocus={handleSearchFocus} 
                      placeholder="Search" />

                    <div className="overflow-x-hidden flex flex-col gap-3">
                      {conversations.map((conversation) => (
                        <div key={conversation.id} className="hover:bg-slate-100">
                          {conversation.users.length > 2 ? (
                            <h2 className="text-base font-bold mx-2 text-gray-900"> {conversation.groupChatName} </h2>
                          ) : (
                            conversation.users[0].name === senderName ? (
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
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col w-full gap-3 overflow-auto">
                    <div className="flex gap-2 items-center w-full overflow-x-hidden mb-3">
                      <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-200 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg shrink-0" onClick={handleSearchFocus} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                      </svg>
                      <input type="text" 
                        className="rounded-lg text-gray-900 border-none bg-gray-200 w-full block focus:ring-0 " 
                        placeholder="Search" />
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
          </div>
        )}

        {isViewSettings && (
          <div className="h-full w-full absolute bg-white sm:static sm:w-1/2 flex flex-col border-x-2 p-3">
            <div className="flex justify-between items-center ">
              <svg onClick={handleSettingsClick} className="w-[34px] h-[34px] bg-slate-200 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
              </svg>
              <h1 className="text-lg font-bold tracking-tight text-gray-900"> Conversation </h1>
              <svg className="w-[34px] h-[34px] text-gray-800 dark:text-white rounded-lg p-2 bg-slate-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 14">
                <path d="M16 2H1a1 1 0 0 1 0-2h15a1 1 0 1 1 0 2Zm0 6H1a1 1 0 0 1 0-2h15a1 1 0 1 1 0 2Zm0 6H1a1 1 0 0 1 0-2h15a1 1 0 0 1 0 2Z"/>
              </svg>
            </div>

            <div className="flex flex-col items-center w-full bg-slate-200 my-4 p-4 rounded-lg ">
              <h1 className=" text-lg font-bold text-gray-900"> {receiver} </h1>
              <h2 className="text-base font-bold text-gray-400"> shin@gmail.com </h2>

              <div className="flex flex-col w-full my-4 gap-2">
                <h1 className="text-base font-bold tracking-tight text-gray-900"> People </h1>
                {members.map((member) => (
                  <div key={member.id} className="mx-4">
                    <h2 className="text-base font-bold mx-2 text-gray-900"> {member.name} </h2>
                    <h3 className="text-sm font-bold mx-2 text-gray-400"> {member.email} </h3>
                  </div>
                ))}
              </div>

              <div className="flex flex-col w-full my-4 gap-4">
                <h1 className="text-base font-bold tracking-tight text-gray-900"> Actions </h1>

                <div className="flex gap-3 mx-4 hover:bg-slate-300 hover:cursor-pointer open:bg-blue-200" onClick={handleCreateGCClick}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                      <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                      <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
                    </svg>
                    <h1>Create group chat</h1>
                </div>

                <div className="flex gap-3 mx-4 hover:bg-slate-300 hover:cursor-pointer open:bg-blue-200" onClick={() => deleteConversation(conversationId)}>
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                  </svg>
                  <h1> Delete conversation </h1>
                </div>
              </div>

            </div>
          </div>
        )}

        {isCreatingGC && (
          <div className="absolute w-full sm:static sm:w-1/6 h-full p-3 flex flex-col bg-white">
            <div className="flex items-center gap-3">
              <svg onClick={handleCreateGCClick} className="w-[34px] h-[34px] bg-slate-200 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-slate-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
              </svg>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 shrink-0 place-self-center"> Create Group Chat </h1>
            </div>

            <div className="flex flex-col bg-slate-200 my-4 p-4 rounded-lg gap-2">
              <h1 className="text-base font-bold text-gray-900 shrink-0"> Already added users </h1>

              <div className="flex overflow-x-auto gap-3">
                {addedUsersName.map((usernames) => (
                  <div key={usernames} className="bg-slate-300 p-2 rounded-lg flex flex-col justify-center items-center w-14">
                    <svg className="w-[32px] h-[32px] shrink-0 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <h2 className="text-base font-bold text-gray-900 w-full truncate"> {usernames} </h2>
                  </div>
                ))}
              </div>

              <form className="flex items-center gap-2 mt-3" onSubmit={createGroupChat}>
                <input type="text"
                className="rounded-lg text-gray-900 border-none bg-gray-300 w-full block focus:ring-0"
                placeholder="Group chat name"
                required
                value={groupChatName}
                id="groupChatName"
                name="groupChatName"
                onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button type="submit">
                  <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white hover:bg-slate-300 hover:w-[36px] hover:h-[36px] hover:p-2 rounded-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                    <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
                  </svg>
                </button>
              </form>

              <div className="flex flex-col my-3 gap-2">
                <h1 className="text-base font-bold tracking-tight text-gray-900"> Add more users </h1>
                {users.map((user) => (
                  addedUsersName.includes(user.name) ? (
                    <div key={user.id} className=" hover:bg-slate-300 hover:cursor-pointer rounded-lg flex items-center px-2 bg-blue-300" onClick={() => removeUserToGC(user.name, user.id)}>
                      <svg className="w-4 h-4 text-gray-800 dark:text-white shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z"/>
                      </svg>
                      <div className="flex flex-col w-full ">
                        <h2 className="text-base font-bold mx-2 text-gray-900 w-full truncate  pr-5"> {user.name} </h2>
                        <h3 className="text-sm font-bold mx-2 text-gray-400 w-full truncate  pr-5"> {user.email} </h3>
                      </div>
                    </div>
                  ) : (
                    <div key={user.id} className=" hover:bg-slate-300  hover:cursor-pointer rounded-lg flex items-center px-2" onClick={() => addUserToGC(user.id)}>
                      <svg className="w-4 h-4 text-gray-800 dark:text-white shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                      </svg>
                      <div className="flex flex-col w-full">
                        <h2 className="text-base font-bold mx-2 text-gray-900 w-full truncate  pr-2"> {user.name} </h2>
                        <h3 className="text-sm font-bold mx-2 text-gray-400 w-full truncate  pr-2"> {user.email} </h3>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

          </div>
        )}

        {didCreateGC && (
          <div className="absolute flex items-center justify-center h-full w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 cursor-wait">
          <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
              <span className="sr-only">Loading...</span>
          </div>
      </div>
        )}
      </div>
    </>
  );
}
