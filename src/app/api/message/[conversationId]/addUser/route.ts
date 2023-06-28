import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"

export async function POST(request : Request,
    { params } : { params : { conversationId : string } }
) {
    try {

        const conversationId = params.conversationId;
        // The id of the new user to be added
        const { userId } = await request.json();

        if (userId && conversationId) {
            const user =await prisma.user.findUnique({
                where : {
                    id : userId
                }
            });

            const conversation = await prisma.conversation.update({
                where : {
                    id : conversationId
                },
                data : {
                    users : {
                        connect : {
                            id : user?.id
                        }
                    }
                }
            });

            return NextResponse.json({message : "User added"})
        }

    } catch (err) {
        return NextResponse.json({message : err})
    }
}