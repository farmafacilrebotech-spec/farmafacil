import { ScanLine, ShoppingBag, HandMetal } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: ScanLine,
    title: "El cliente escanea un QR",
    desc: "Desde el escaparate, mostrador o folleto: entra al catálogo de tu farmacia.",
  },
  {
    step: 2,
    icon: ShoppingBag,
    title: "Consulta o hace pedido",
    desc: "Ve productos y ofertas, pregunta al asistente o deja el pedido hecho en el kiosko.",
  },
  {
    step: 3,
    icon: HandMetal,
    title: "Recoge en mostrador",
    desc: "Tú preparas con calma; el cliente sabe cuándo pasar. Menos interrupciones.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          Cómo funciona
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">
          Tres pasos, sin manual de 40 páginas.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-center text-base font-semibold text-[#1ABBB3] sm:text-lg">
          Empieza a funcionar el mismo día.
        </p>

        <ol className="relative mt-12 flex flex-col space-y-8 sm:mt-14 lg:flex-row lg:items-start lg:justify-between lg:gap-4 lg:space-y-0">
          <div
            className="absolute left-[12%] right-[12%] top-[2.25rem] hidden h-0.5 bg-gradient-to-r from-[#4ED3C2] via-[#1ABBB3] to-[#4ED3C2] lg:block"
            aria-hidden
          />
          {steps.map(({ step, icon: Icon, title, desc }) => (
            <li
              key={step}
              className="relative z-10 flex gap-4 lg:w-[30%] lg:flex-col lg:items-center lg:gap-0 lg:text-center"
            >
              <div className="flex shrink-0 flex-col items-center lg:contents">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ABBB3] text-white shadow-md lg:h-[4.5rem] lg:w-[4.5rem] lg:border-4 lg:border-white lg:shadow-lg lg:ring-2 lg:ring-[#4ED3C2]/40">
                  <Icon className="h-6 w-6 lg:h-8 lg:w-8" aria-hidden />
                </div>
                {step < 3 && (
                  <div
                    className="mt-2 h-full min-h-[2rem] w-0.5 flex-1 bg-gradient-to-b from-[#1ABBB3] to-[#4ED3C2]/50 lg:hidden"
                    aria-hidden
                  />
                )}
              </div>
              <div className="pb-2 pt-1 lg:contents">
                <span className="text-xs font-bold uppercase text-[#1ABBB3] lg:mt-4 lg:tracking-wider">
                  Paso {step}
                </span>
                <h3 className="text-lg font-bold text-[#1A1A1A] lg:mt-2">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 lg:mt-2">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
