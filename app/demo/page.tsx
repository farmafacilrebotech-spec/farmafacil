import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Demo — FarmaFácil",
  description: "Reserva una demo gratuita y ve FarmaFácil en acción.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <LandingNav />
      <main className="px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl">
            Demo FarmaFácil
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Aquí podrás enlazar un vídeo o calendly dedicado. De momento, deja tus datos en el
            formulario y te contactamos para una sesión en vivo.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="h-12 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
            >
              <Link href="/#solicitar-demo">Solicitar demo gratuita</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-2 border-gray-200 bg-white px-8"
            >
              <Link href="/contacto">Ir a contacto</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
