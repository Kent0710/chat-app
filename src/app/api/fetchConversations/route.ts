import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { cookies } from "next/dist/client/components/headers";

export async function GET(request : Request) {
    try {
        const cookieStore = cookies();
        const sessionUserId = cookieStore.get("sessionUserId");

        if (sessionUserId) {
            const conversations = await prisma.conversation.findMany({
                where : {
                    usersId : {
                        has : sessionUserId.value
                    }
                },
                include : {
                    users : true
                }
            });

            if (conversations) {
                return NextResponse.json({message : "Conersations Retrieved", 
                    conversations : conversations
                })
            }
        }

        return NextResponse.json({message : "conversation errior"})
        
    } catch (err) {
        return NextResponse.json({message : err})
    }
}