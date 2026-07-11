import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwrcjRjIi9RK4Aq5qUJli8ieACtQ1J1XP_xZWW27S7MKSkrA7IU3oxFvm7YiEyYxLYj/exec";

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        origen: body.origen || "asistente"
      })
    });

    const data = await response.json();

    return NextResponse.json({ ok: true, data });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
