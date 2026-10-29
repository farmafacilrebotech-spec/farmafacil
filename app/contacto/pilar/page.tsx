import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DigitalBusinessCard from "@/components/contact-card/DigitalBusinessCard";
import { resolveContactCard } from "@/lib/contact-card";

const PROFILE_ID = "pilar";

/** Teléfono desde env de servidor: no cachear HTML estático sin teléfono. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pilar Reyes Bononat · FarmaFácil",
  description:
    "Tarjeta de visita digital de Pilar Reyes Bononat, fundadora y directora de FarmaFácil.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Pilar Reyes Bononat · FarmaFácil",
    description: "Fundadora y Directora · FarmaFácil",
    url: "https://www.farmafacil.solutions/contacto/pilar",
    type: "profile",
  },
};

export default function PilarContactCardPage() {
  const contact = resolveContactCard(PROFILE_ID);
  if (!contact) notFound();

  return (
    <DigitalBusinessCard
      contact={contact}
      vcardHref={`/api/contacto/${PROFILE_ID}/vcard`}
    />
  );
}
