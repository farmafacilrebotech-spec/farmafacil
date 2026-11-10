import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";
import {
  FARMAFACIL_CONTACTO_HREF,
  FARMAFACIL_DEMO_URL,
  farmafacilSolicitudHref,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Demo — FarmaFácil",
  description: "Solicita una prueba piloto o habla con FarmaFácil.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <LandingNav />
      <main className="px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl">
            Prueba FarmaFácil en tu farmacia
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Priorizamos el contacto directo con farmacias y las pruebas piloto. Déjanos tus datos y
            te acompañamos en el siguiente paso.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="h-12 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
            >
              <Link href={farmafacilSolicitudHref("demo")}>Solicitar una prueba</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-2 border-gray-200 bg-white px-8"
            >
              <Link href={FARMAFACIL_CONTACTO_HREF}>Hablar con FarmaFácil</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Acceso técnico al entorno de demostración:{" "}
            <a
              href={FARMAFACIL_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1ABBB3] hover:underline"
            >
              demo.farmafacil.solutions
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
