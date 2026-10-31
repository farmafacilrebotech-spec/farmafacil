import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { areBonosDisponibles } from "@/lib/encuesta/config";

export default function SurveyCtaSection() {
  const bonosDisponibles = areBonosDisponibles();

  return (
    <section
      id="estudio-farmacias"
      className="scroll-mt-20 border-y border-gray-100 bg-white py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 rounded-3xl bg-gradient-to-br from-[#F7F9FA] to-white p-6 ring-1 ring-gray-100 sm:gap-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_9.5rem_auto] lg:items-center lg:gap-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1ABBB3]">
              Estudio para titulares
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Ayúdanos a entender los retos reales de la farmacia
            </h2>
            <p className="mt-2 text-gray-600">
              {bonosDisponibles
                ? "Encuesta breve para titulares y cotitulares. Las participaciones válidas y verificadas pueden recibir un bono Amazon de 10 € tras revisión."
                : "Encuesta breve para titulares y cotitulares. Tu experiencia nos ayuda a conocer mejor las necesidades reales de las farmacias."}
            </p>
          </div>

          <div className="order-3 flex justify-center lg:order-none lg:col-start-2 lg:row-start-1 lg:justify-self-center">
            <Image
              src="/images/ilustraciones/encuesta-farmacias-card.png"
              alt="Ilustración conceptual del estudio FarmaFácil para farmacias."
              width={480}
              height={393}
              sizes="(min-width: 1024px) 9.5rem, 10rem"
              className="h-auto max-h-28 w-40 object-contain sm:max-h-32 sm:w-44 lg:max-h-[7.5rem] lg:w-[9.5rem]"
            />
          </div>

          <Button
            asChild
            className="order-2 h-12 w-full shrink-0 justify-self-start rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94] sm:w-auto lg:order-none lg:col-start-3 lg:row-start-1 lg:justify-self-end"
          >
            <Link href="/encuesta-farmacias">Participar en el estudio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
