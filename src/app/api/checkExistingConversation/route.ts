import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { cookies } from "next/dist/client/components/headers";

export async function POST(request : Request) {
    try {

        const cookieStore = cookies();
        // Client One as the Session User
        const sessionUserId = cookieStore.get("sessionUserId");

        // Client Two as the Receiver
        const { clientTwoId } = await request.json();

        if (sessionUserId && clientTwoId) {
            const conversation = await prisma.conversation.findFirst({
                where : {
                    usersId : {
                        hasEvery : [ sessionUserId.value, clientTwoId ]
                    }
                }
            });

            if (conversation) {
                return NextResponse.json({message : "Conversation Found",
                    conversation : conversation,
                    flag : "success"
                })
            } else {
                const conversation = await prisma.conversation.create({
                    data : {
                        usersId : [ sessionUserId.value, clientTwoId ]
                    }
                });

                return NextResponse.json({message : "New Conversation Created",
                    conversation : conversation,
                    flag : "success"
                })
            }
        }

    } catch (err) {
        return NextResponse.json({message : err})
    }
}