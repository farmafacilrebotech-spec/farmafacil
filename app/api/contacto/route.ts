export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { processContactSubmission } from "@/lib/contacto/process";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const result = await processContactSubmission(raw);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    console.error("Error en /api/contacto");
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
