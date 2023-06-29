'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { pusherClient } from "@/libs/pusher";
import Link from "next/link";
import { fetchOriginHost } from "@/libs/utils";

export const dynamic = 'force-dynamic'

export default function MessagePage() {
  const [title, setTitle] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [isViewingMembers, setIsViewingMembers] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false)
  const [users, setUsers] = useState<any[]>([]);

  const pathname = usePathname();

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
        console.log(data);
        setSenderName(data.sender.name);
        setMembers(data.members);
        setMessages(data.messages);
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
      } catch (err) {
        console.error(err);
      }
    }

    fetchUsers();

    async function initPusherClient() {
      const channel = await pusherClient.subscribe(`new-message-${senderName}`);

      await channel.bind('new-message', (data : any) => {
        // append the new message here
        setMessages((prevMessages) => [...prevMessages, data.newMessage])
  
        console.log(data.newMessage);
        console.log(`New message sent by ${data.newMessage.sender.name}`)
      })
    }
    
    initPusherClient();

  }, [pathname, senderName]);

  const sendMessage = async (e : React.SyntheticEvent) => {
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
 
  return (
    <main className="flex flex-col bg-blue-500 h-screen">
      <div>
        <h1 className="text-center"> Sender : {senderName} (your username) </h1>
      </div>
      <form onSubmit={sendMessage}>
        <label htmlFor="title">Title : </label>
        <input type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} />
          <input className="bg-cyan-500 rounded-md p-1 ml-2" type="submit" />
      </form>
      <div className=" bg-indigo-900">
        <h3 className="text-center">Messages</h3>
        {messages.map((message) => (
          <div key={message.id}>
            <p> Title : {message.title} </p>
            <p> Sent by : {message.sender.name} </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <h1>Other Actions</h1>
          <button className="bg-cyan-400 rounded-md p-1" onClick={viewMembers}>View Members </button>
          {isViewingMembers && (
            <div>
              {members.map((member) => (
                <div key={member.id}>
                  <p> Member Name : {member.name} </p>
                  <p> Member Email : {member.email} </p>
                  <button className="bg-cyan-400 rounded-md p-1" onClick={() => removeUser(member.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        {isGroupChat && (
          <div>
          <button  className="bg-cyan-400 rounded-md w-20" onClick={addUserClicked}>Add</button>
        {isAdding && (
          <div>
            {users.map((user) => (
              <div key={user.id}>
                <p> User Add Name : {user.name} </p>
                <p> User Add Email : {user.email}  </p>
                <button onClick={() => addUser(user.id)}>Add User</button>
              </div>
            ))}
          </div>
        )}
          </div>
        )}
      {!isGroupChat && (
        <div>
        <Link className="bg-cyan-400 rounded-md w-20 p-1" href={`${pathname}/createGroupChat`}>Create Group Chat</Link>
      </div>
      )}
      </div>
    </main>
  );
}
