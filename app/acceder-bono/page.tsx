import type { Metadata } from "next";
import { Suspense } from "react";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";
import AccederBonoClient from "@/components/bonos/AccederBonoClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acceder al bono — FarmaFácil",
  description:
    "Accede al bono Amazon asociado a tu participación en el estudio FarmaFácil.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccederBonoPage() {
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
          <AccederBonoClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
