import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { cookies } from "next/dist/client/components/headers";

export async function POST(request : Request) {
    try {
        const cookieStore = cookies();

        // client one as the session user
        const sessionUserId = cookieStore.get("sessionUserId")?.value

        // client two as the receiver
        const { clientTwoId } = await request.json();

        let conversation : any;
        let allConversations : any;
        if (sessionUserId && clientTwoId) {
            if (sessionUserId === clientTwoId) {
                allConversations = await prisma.conversation.findMany();

                for (let i = 0; i < allConversations.length; i++) {
                    if (allConversations[i].usersId.length === 2) {
                        if (
                            allConversations[i].usersId[0] === sessionUserId &&
                            allConversations[i].usersId[1] === clientTwoId
                        ) {
                            conversation = allConversations[i];
                        }
                    }
                }
            } else {
                conversation = await prisma.conversation.findFirst({
                    where : {
                        usersId : {
                            hasEvery : [ sessionUserId, clientTwoId ]
                        }
                    }
                });
            }

            if (conversation) {
                return NextResponse.json({
                    message : "Conversation found",
                    conversation : conversation,
                    flag : "success"
                })
            } else {
                conversation = await prisma.conversation.create({
                    data : {
                        usersId : [ sessionUserId, clientTwoId ]
                    }
                });

                return NextResponse.json({
                    message : "New conversation created",
                    conversation : conversation,
                    flag : "success"
                })
            }
        }

    } catch (err) {
        return NextResponse.json({message : err})
    }
}