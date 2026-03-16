import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return NextResponse.json(
      { status: "ok", message: "MongoDB connected" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mongo health error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "MongoDB connection failed",
      },
      { status: 500 }
    );
  }
}