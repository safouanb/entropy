import { NextResponse } from "next/server";
import { checkHealth } from "@/lib/backend-client";

export async function GET() {
  try {
    const health = await checkHealth();
    return NextResponse.json(health);
  } catch {
    return NextResponse.json(
      { status: "unhealthy", error: "Backend unreachable" },
      { status: 503 }
    );
  }
}
