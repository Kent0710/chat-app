import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"
import { cookies } from "next/dist/client/components/headers";

export async function PATCH(request : Request) {
    try {
        const cookieStore = cookies();
        const sessionUserId = cookieStore.get("sessionUserId");

        const { newEmailAdd, newUsername } = await request.json()

        // new email add is present
        if (newEmailAdd !== "" && newUsername === "") {
            const user = await prisma.user.update({
                where : {
                    id : sessionUserId?.value
                },
                data : {
                    email : newEmailAdd
                }
            })
        } else if (newUsername !== "" && newEmailAdd === "") { // new username is present
            const user = await prisma.user.update({
                where : {
                    id : sessionUserId?.value
                },
                data : {
                    name : newUsername
                }
            })
        } else { // both is present
            const user = await prisma.user.update({
                where : {
                    id : sessionUserId?.value
                },
                data : {
                    email : newEmailAdd,
                    name : newUsername
                }
            })
        }
    
        return NextResponse.json({message : "User updated", success : true})

    } catch (err) {
        return NextResponse.json({message : err})
    }
}