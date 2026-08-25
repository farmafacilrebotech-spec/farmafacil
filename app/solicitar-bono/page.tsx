import type { Metadata } from "next";
import { Suspense } from "react";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";
import SolicitarBonoClient from "@/components/bonos/SolicitarBonoClient";

export const metadata: Metadata = {
  title: "Solicitar bono — FarmaFácil",
  description:
    "Confirma tus datos para recibir el bono Amazon de 10 € tras la validación de tu participación en el estudio FarmaFácil.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SolicitarBonoPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <LandingNav />
      <main className="mx-auto max-w-xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
              <p className="text-sm text-gray-600">Cargando…</p>
            </div>
          }
        >
          <SolicitarBonoClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
