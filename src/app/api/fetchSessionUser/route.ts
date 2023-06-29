import { NextResponse } from "next/server";
import { cookies } from "next/dist/client/components/headers";
import prisma from "@/libs/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request : Request) {
    try {
        const cookieStore = cookies();
        const sessionUserId = cookieStore.get("sessionUserId");

        if (sessionUserId) {
            const sessionUser = await prisma.user.findUnique({
                where : {
                    id : sessionUserId.value
                }
            });

            if (sessionUser) {
                return NextResponse.json({mesasge : "Session User Retrieved",
                    sessionUser : sessionUser
                })
            }
        }

        return NextResponse.json({message : "Session User Retrieval Failed"});
    } catch (err) {
        return NextResponse.json({message : err});
    }
}