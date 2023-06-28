import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"

export async function POST(request : Request) {
    try {

        const { groupChatName, addedUsersId } = await request.json();

        // New group chat conversation
        const conversation = await prisma.conversation.create({
            data : {
                groupChatName : groupChatName,
                usersId : {
                    set : [ ...addedUsersId ]
                }
            }
        });

        return NextResponse.json({message : "Group Chat Created",
            conversation : conversation,
            flag : "success"
        })

    } catch (err) {
        return NextResponse.json({messaage : err})
    }
}