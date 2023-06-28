import { NextResponse } from "next/server";
import { cookies } from "next/dist/client/components/headers";
import prisma from "@/libs/prisma"

export async function POST(request : Request) {
    try {
        const origin = request.headers.get("origin");

        const { email, name, userType } = await request.json();
        
        const registerUser = await prisma.user.create({
            data : {
                email,
                name,
                userType
            }
        });
 
        if (registerUser) {
            cookies().set({
                name : `sessionUserId`,
                value : registerUser.id,
                path : "/"
            });

            const registerUserObj = { registerUser : registerUser, message : "register user" };
            return new NextResponse(JSON.stringify(registerUserObj), {
                headers : {
                    "Access-Control-Allow-Origin" : origin || "*",
                    "Content-Type" : "application/json"
                }
            })
            
        } else {
            return NextResponse.json({message : "register user failed"})
        }
    } catch (err) {
        return NextResponse.json({message : err})
    }
}