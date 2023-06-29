import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { pusherServer } from "@/libs/pusher";
import { cookies } from "next/dist/client/components/headers";

export async function POST(request : Request,
    { params } : { params : { conversationId : string } }    
) {
    try {
        // URL origin of the request for CORS
        const origin = request.headers.get("origin");
        const conversationId = params.conversationId;

        const { title } = await request.json();

        const cookieStore = cookies();
        // Always the session user
        const senderId = cookieStore.get("sessionUserId");

        if (senderId) {
            const newMessage = await prisma.message.create({
                data : {
                    title : title,
                    senderId : senderId.value,
                    parentConversationId : conversationId
                },
                include : {
                    sender : true,
                    parentConversation : true
                }
            });

            if (newMessage) {
                const conversation = await prisma.conversation.findUnique({
                    where : {
                        id : conversationId
                    },
                    include : {
                        users : true
                    }
                });

                let listeners = conversation?.users.map(user => user.name);
                listeners?.map( async (listener) => {
                    await pusherServer.trigger(`new-message-${listener}`, 'new-message', {
                        newMessage : newMessage
                    })
                });

                const responseBody = { message : "New Message Sent" }
                return new NextResponse(JSON.stringify(responseBody), {
                    headers : {
                        'Access-Control-Allow-Origin' : origin || "*",
                        "Content-Type" : "application/json"
                    }
                })
            }
        }

    } catch (err) {
        const origin = request.headers.get("origin");
        return new NextResponse(JSON.stringify(err), {
            headers : {
                "Access-Control-Allow-Origin" : origin || "*",
                "Content-Type" : "application/json"
            }
        })
    }
}