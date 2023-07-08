import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"

export async function POST(request : Request,
    { params } : { params : { conversationId : string } }    
) {
    try {
        const conversationId = params.conversationId;

        // contains the ids of the removed users
        const { removeUserArr } = await request.json();
        for (let i = 0; i < removeUserArr.length; i++) {
            const tempConversation = await prisma.conversation.findUnique({
                where : {
                    id : conversationId
                }
            });

            const conversation = await prisma.conversation.update({
                where  :{
                    id : conversationId
                },
                data : {
                    usersId : {
                        set : tempConversation?.usersId.filter(userId => userId !== removeUserArr[i])
                    }
                }
            })
        }

        return NextResponse.json({message : "users successfullly removed", success : true})

    } catch (err) {
        return NextResponse.json({message : err})
    }
}