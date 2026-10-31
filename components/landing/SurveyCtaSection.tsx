import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { areBonosDisponibles } from "@/lib/encuesta/config";

type SurveyCtaSectionProps = {
  /** Ilustración discreta (p. ej. en /soluciones). La home no la usa. */
  showIllustration?: boolean;
};

export default function SurveyCtaSection({
  showIllustration = false,
}: SurveyCtaSectionProps) {
  const bonosDisponibles = areBonosDisponibles();

  return (
    <section
      id="estudio-farmacias"
      className="scroll-mt-20 border-y border-gray-100 bg-white py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            showIllustration
              ? "flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-[#F7F9FA] to-white p-6 ring-1 ring-gray-100 sm:gap-6 sm:p-8 lg:flex-row lg:items-center lg:gap-8"
              : "flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-[#F7F9FA] to-white p-6 ring-1 ring-gray-100 sm:flex-row sm:items-center sm:p-8"
          }
        >
          <div className={showIllustration ? "min-w-0 flex-1 lg:max-w-xl" : "max-w-xl"}>
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

          {showIllustration ? (
            <div className="order-3 flex justify-center lg:order-none lg:mx-2 lg:w-36 lg:shrink-0 xl:w-40">
              <Image
                src="/images/ilustraciones/encuesta-farmacias-card.png"
                alt="Ilustración conceptual del estudio FarmaFácil para farmacias."
                width={480}
                height={393}
                sizes="(min-width: 1024px) 10rem, 9rem"
                className="h-auto w-36 object-contain opacity-95 sm:w-40 lg:w-full"
              />
            </div>
          ) : null}

          <Button
            asChild
            className={
              showIllustration
                ? "order-2 h-12 w-full shrink-0 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94] sm:w-auto lg:order-none"
                : "h-12 shrink-0 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
            }
          >
            <Link href="/encuesta-farmacias">Participar en el estudio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
