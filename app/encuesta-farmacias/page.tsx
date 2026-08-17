import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";
import SurveyWizard from "@/components/encuesta/SurveyWizard";
import {
  areBonosDisponibles,
  isEncuestaEnabled,
} from "@/lib/encuesta/config";

export const metadata: Metadata = {
  title: "Encuesta farmacias - FarmaFácil",
  description:
    "Ayúdanos a conocer mejor la realidad de las farmacias. Participa y recibe un bono Amazon de 10 € tras validar tu participación.",
  openGraph: {
    title: "Encuesta farmacias — FarmaFácil",
    description:
      "Ayúdanos a conocer mejor la realidad de las farmacias. Participa y recibe un bono Amazon de 10 € tras validar tu participación.",
    url: "https://www.farmafacil.solutions/encuesta-farmacias",
    siteName: "FarmaFácil",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://www.farmafacil.solutions/images/og/encuesta-farmacias.jpeg",
        width: 1200,
        height: 630,
        alt: "Encuesta FarmaFácil para titulares de farmacia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Encuesta farmacias - FarmaFácil",
    description:
      "Ayúdanos a conocer mejor la realidad de las farmacias. Participa y recibe un bono Amazon de 10 € tras validar tu participación.",
    images: [
      "https://www.farmafacil.solutions/images/og/encuesta-farmacias.jpeg",
    ],
  },
};


export default function EncuestaFarmaciasPage() {
  const enabled = isEncuestaEnabled();
  const bonosDisponibles = areBonosDisponibles();

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <LandingNav />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <SurveyWizard enabled={enabled} bonosDisponibles={bonosDisponibles} />
      </main>
      <Footer />
    </div>
  );
}
