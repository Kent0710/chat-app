import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function DELETE(request: Request, { params }: { params: { conversationId: string, removeUserId: string } }) {
  try {
    const conversationId = params.conversationId;
    const removeUserId = params.removeUserId;

    // Find the conversation by ID
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
    });

    if (!conversation) {
      // Return an error response if the conversation does not exist
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    // Remove the user from the conversation's usersId array
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        usersId: {
          set: conversation.usersId.filter(userId => userId !== removeUserId)
        }
      }
    });

    return NextResponse.json({ message: 'User removed from conversation', conversation: updatedConversation });
  } catch (err) {
    return NextResponse.json({ message: err });
  }
}
