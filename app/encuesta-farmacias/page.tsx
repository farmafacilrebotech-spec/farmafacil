import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";
import SurveyWizard from "@/components/encuesta/SurveyWizard";
import {
  areBonosDisponibles,
  isEncuestaEnabled,
} from "@/lib/encuesta/config";

export const metadata: Metadata = {
  title: "Encuesta farmacias — FarmaFácil",
  description:
    "Estudio sobre los retos actuales de la farmacia comunitaria. Participación para titulares y cotitulares.",
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
