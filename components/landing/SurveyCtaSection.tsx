import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SurveyCtaSection() {
  return (
    <section
      id="estudio-farmacias"
      className="scroll-mt-20 border-y border-gray-100 bg-white py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-[#F7F9FA] to-white p-6 ring-1 ring-gray-100 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1ABBB3]">
              Estudio para titulares
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Ayúdanos a entender los retos reales de la farmacia
            </h2>
            <p className="mt-2 text-gray-600">
              Encuesta breve para titulares y cotitulares. Las participaciones válidas y
              verificadas pueden recibir un bono Amazon de 10 € tras revisión.
            </p>
          </div>
          <Button
            asChild
            className="h-12 shrink-0 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
          >
            <Link href="/encuesta-farmacias">Participar en el estudio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
