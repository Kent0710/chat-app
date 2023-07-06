import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"

export async function DELETE(request : Request, 
    { params } : { params : { conversationId : string } }    
) {
    try {
        const conversationId = params.conversationId;

        const conversation = await prisma.conversation.delete({
            where : {
                id : conversationId
            }
        });

        let flag = false;
        if (conversation) {
            flag = true;
            return NextResponse.json({messsage : "Conversation deleted", 
                conversation : conversation,
                flag : flag,
            })
        } else {
            return NextResponse.json({message : "Conversation can't be deleted", 
                flag : flag
            })
        }
    } catch (err) {
        console.error(err);
    }
}