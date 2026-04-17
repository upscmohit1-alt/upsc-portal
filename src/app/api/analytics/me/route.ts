import { NextResponse } from "next/server";
import { getStudentAnalytics } from "@/lib/analytics";

export async function GET(request: Request) {
  const userIdFromHeader = request.headers.get("x-user-id");
  const userId = userIdFromHeader || "demo-user";
  const analytics = getStudentAnalytics(userId);

  return NextResponse.json(analytics);
}
