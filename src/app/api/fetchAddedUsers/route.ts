import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { skip } from "node:test";

export async function POST(request : Request) {
    try {
        const usernames = [];
        const { addedUsersId, addedNewUsersId } = await request.json();
        for (let i = 0; i < addedUsersId.length; i++) {
            const user = await prisma.user.findUnique({
                where : {
                    id : addedUsersId[i]
                }
            });

            if (user) usernames.push(user.name);
        }

        const newUsernames = [];
        for (let i = 0; i < addedNewUsersId.length; i++) {
            const user = await prisma.user.findUnique({
                where : {
                    id : addedNewUsersId[i]
                }
            });

            if (user) newUsernames.push(user.name)
        }

        return NextResponse.json({
            usernames : usernames,
            newUsernames : newUsernames
        });

    } catch (err) {
        return NextResponse.json({message : err});
    }
}