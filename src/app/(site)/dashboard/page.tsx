'use client'

import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConversationContainerComponent from "@/app/components/conversationContainer/page";

export default function Dashboard() {
    return (
        <main className="flex bg-white w-screen h-screen m-0 p-0">
            <ConversationContainerComponent />
        </main>
      );
}