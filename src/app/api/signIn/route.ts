import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { cookies } from "next/dist/client/components/headers";

export async function POST(request : Request) {
    try {

        const { email, name } = await request.json();

        const user = await prisma.user.findFirst({
            where : {
                email : email,
                name : name
            }
        });

        if (user) {
            cookies().set({
                name : "sessionUserId",
                value : user.id,
                path : "/"
            });

            return NextResponse.json({message : "User Found",
                user : user
            })
        } else {
            return NextResponse.json({message : "User not found"})
        }

    } catch (err) {
        return NextResponse.json({message : err})
    }
}