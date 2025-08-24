import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch user's trades
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { createdAt: 'desc' },
        { pair: 'asc' }
      ],
      select: {
        id: true,
        pair: true,
        orderStatus: true,
        side: true,
        entryPrice: true,
        exitPrice: true,
        pnl: true,
        winLoss: true,
        createdAt: true,
      },
    });

    return NextResponse.json(trades, { status: 200 });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}