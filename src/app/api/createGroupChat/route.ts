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
                    set : [...addedUsersId]
                }
            }
        });

        if (conversation) {
            return NextResponse.json({message : "Group Chat Created", 
                conversation : conversation,
                flag : "success"
            })
        }

        return NextResponse.json({message : "failed", flag : "unsuccessfull"})
    } catch (err) {
        return NextResponse.json({mesage : err});
    }
}