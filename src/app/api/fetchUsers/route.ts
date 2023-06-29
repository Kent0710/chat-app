import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { cookies } from "next/dist/client/components/headers";

export const dynamic = 'force-dynamic'

export async function GET(request : Request) {
    try {
        const users = await prisma.user.findMany({
            where : {
                userType : "user"
            }
        });

        const cookieStore = cookies();
        const sessionUserId = cookieStore.get("sessionUserId")

        return NextResponse.json({message : "Users Retrieved",
            users : users,
            sessionUserId : sessionUserId?.value
        })

    } catch (err) {
        return NextResponse.json({message : err})
    }
}