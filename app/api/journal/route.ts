import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import type { JournalEntry, JournalTag } from "@prisma/client";

type JournalEntryWithTags = JournalEntry & {
  tags: JournalTag[];
};

// GET - Fetch journal entries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tags: true,
        trades: {
          select: {
            id: true,
            pair: true,
            side: true,
            orderStatus: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Always return entries array, even if empty (0 entries is not an error)
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 },
    );
  }
}

// POST - Create journal entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      date,
      tagNames,
      tradeIds,
      mood,
      confidence,
      winRate,
    } = body;

    // Create or find tags
    const tags = await Promise.all(
      (tagNames || []).map(async (name: string) => {
        return await prisma.journalTag.upsert({
          where: { name },
          create: { name },
          update: {},
        });
      }),
    );

    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        title,
        content,
        date: date ? new Date(date) : new Date(),
        mood,
        confidence,
        winRate,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
        trades: {
          connect: (tradeIds || []).map((id: string) => ({ id })),
        },
      },
      include: {
        tags: true,
        trades: true,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update journal entry
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, date, tagNames, mood, confidence, winRate } =
      body;

    // Verify ownership
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Handle tags if provided
    let tagOperations = {};
    if (tagNames) {
      const tags = await Promise.all(
        tagNames.map(async (name: string) => {
          return await prisma.journalTag.upsert({
            where: { name },
            create: { name },
            update: {},
          });
        }),
      );

      tagOperations = {
        tags: {
          set: tags.map((tag) => ({ id: tag.id })),
        },
      };
    }

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: {
        title,
        content,
        date: date ? new Date(date) : undefined,
        mood,
        confidence,
        winRate,
        ...tagOperations,
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete journal entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
    }

    // Verify ownership
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.journalEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export type { JournalEntryWithTags };
