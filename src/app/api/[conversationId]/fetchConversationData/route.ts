import prisma from "@/libs/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/dist/client/components/headers"

export const dynamic = 'force-dynamic'

export async function GET(request : Request,
    { params } : { params : { conversationId : string } }
) {
    try {

        const conversationId = params.conversationId;

        if (conversationId) {
            const conversation = await prisma.conversation.findUnique({
                where : {
                    id : conversationId
                },
                include : {
                    users : true,
                    messages : {
                        include : {
                            sender : true
                        }
                    }
                }
            });

            if (conversation) {
                const conversationUsers = conversation.users;
                const conversatonMessages = conversation.messages;

                const cookieStore = cookies();
                const sessionUserId = cookieStore.get("sessionUserId");

                let sender;
                let receivers = [];
                for (let i = 0; i < conversationUsers.length; i++) {
                    if (conversationUsers[i].id === sessionUserId?.value) {
                        sender = conversationUsers[i];
                    } else {
                        receivers.push(conversationUsers[i])
                    }
                }

                let isGroupChat = false;
                let receiver;
                if (receivers.length > 2) {
                    isGroupChat = true;
                } else {

                    if (sender?.name === receivers[0].name) {
                        receiver = receivers[1].name
                    } else {
                        receiver = receivers[0].name
                    }
                }

                return NextResponse.json({message : "Conversation Data Retrieved",
                    members : conversationUsers,
                    messages : conversatonMessages,
                    sender : sender,
                    receiver : receiver,
                    isGroupChat : isGroupChat
                })
            }
        }

    } catch (err) {
        return NextResponse.json({message : err})
    }
}