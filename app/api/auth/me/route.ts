import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    console.log("Session structure:", JSON.stringify(session, null, 2));

    return NextResponse.json({ 
      session,
      hasUserId: !!session.user?.id,
      userId: session.user?.id 
    });
  } catch (error) {
    console.error("Session test error:", error);
    return NextResponse.json({ error: "Session test failed" }, { status: 500 });
  }
}