import { NextResponse } from "next/server";
import prisma from '@/libs/prisma'
import { cookies } from "next/dist/client/components/headers";

export async function DELETE(request : Request) {
    try {
        const cookieStore = cookies();
        const sessionUserId = cookieStore.get("sessionUserId")?.value;

        const user = await prisma.user.delete({
            where : {
                id : sessionUserId
            }
        });

        if (user) {
            cookieStore.delete("sessionUserId")
            return NextResponse.json({message : "Account deleted", success : true})
        }

    } catch (err) {
        return NextResponse.json({message : err})
    }
}