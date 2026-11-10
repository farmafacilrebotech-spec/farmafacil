import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import CommercialLeadSection from "@/components/landing/CommercialLeadSection";
import Footer from "@/components/common/Footer";
import { presetFromQuery } from "@/lib/contacto/comercial";

/** La query del QR tiene que leerse en cada visita, no en un HTML estático. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solicitar para tu farmacia | FarmaFácil",
  description:
    "Cuéntanos si quieres participar en el piloto, implantar FarmaFácil, ver una demostración o conocer los planes.",
  alternates: {
    canonical: "https://www.farmafacil.solutions/solicitar",
  },
};

type SolicitarPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function SolicitarPage({ searchParams }: SolicitarPageProps) {
  const preset = presetFromQuery(searchParams);

  return (
    <div className="min-h-screen bg-[#07090B]">
      <LandingNav />
      <main className="pt-14 sm:pt-16">
        <CommercialLeadSection
          id="solicitar"
          heading="h1"
          source="solicitar"
          preset={preset}
        />
      </main>
      <Footer />
    </div>
  );
}
