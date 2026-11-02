import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FARMAFACIL_CONTACTO_HREF, FARMAFACIL_PRUEBA_HREF } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="scroll-mt-20 bg-[#F7F9FA] pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1ABBB3] shadow-sm ring-1 ring-[#1ABBB3]/15">
              Producto para farmacias
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              La forma más fácil de digitalizar tu farmacia
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Menos colas, menos interrupciones y más tiempo para atender — desde el primer día.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
              >
                <a href={FARMAFACIL_PRUEBA_HREF}>Solicitar una prueba</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-2 border-[#1ABBB3] bg-white px-8 text-base font-semibold text-[#1ABBB3] hover:bg-[#1ABBB3]/10"
              >
                <a href={FARMAFACIL_CONTACTO_HREF}>Hablar con FarmaFácil</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-2 border-gray-200 bg-white px-8 text-base font-semibold text-[#1A1A1A] hover:border-[#1ABBB3]/40 hover:bg-[#F7F9FA]"
              >
                <a href="#como-funciona">Ver cómo funciona</a>
              </Button>
            </div>
            <ul className="mt-8 space-y-2.5 text-sm text-gray-700">
              {[
                "Sin instalaciones raras",
                "Funciona con QR",
                "En marcha en días, no meses",
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1ABBB3]/15">
                    <Check className="h-3 w-3 text-[#1ABBB3]" strokeWidth={3} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <Image
              src="/images/hero/hero-farmafacil.png"
              alt="Ecosistema FarmaFácil: catálogo móvil, kiosko y panel de farmacia"
              width={1366}
              height={768}
              sizes="(min-width: 1024px) 36rem, (min-width: 640px) 36rem, calc(100vw - 2rem)"
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
