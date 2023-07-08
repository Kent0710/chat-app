import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"

export async function POST(request : Request,
    { params } : { params : { conversationId : string } }   
) {
    try {
        const conversationId = params.conversationId;

        const { addedNewUsersId } = await request.json();
        for (let i = 0; i < addedNewUsersId.length; i++) {
            const conversation = await prisma.conversation.update({
                where : {
                    id : conversationId
                },
                data : {
                    usersId : {
                        push : addedNewUsersId[i]
                    }
                }
            });
        };

        return NextResponse.json({
            message : "Users successfully added",
            success : true
        })

    } catch (err) {
        return NextResponse.json({message : err})
    }
}