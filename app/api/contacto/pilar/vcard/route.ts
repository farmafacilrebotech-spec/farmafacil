import { NextResponse } from "next/server";
import {
  buildVCard,
  loadContactCardPhoto,
  resolveContactCard,
} from "@/lib/contact-card";

const PROFILE_ID = "pilar";

export const dynamic = "force-dynamic";

export async function GET() {
  const contact = resolveContactCard(PROFILE_ID);

  if (!contact) {
    return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 });
  }

  const photo = loadContactCardPhoto();
  const body = buildVCard(contact, { photo });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${contact.vcfFilename}"`,
      "Cache-Control": "no-store",
    },
  });
}
