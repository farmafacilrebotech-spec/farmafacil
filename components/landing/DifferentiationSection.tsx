import { XCircle, CheckCircle2 } from "lucide-react";

export default function DifferentiationSection() {
  return (
    <section id="diferencia" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#F7F9FA] to-white p-8 shadow-sm sm:p-12 lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#1A1A1A] sm:text-3xl">
              FarmaFácil no sustituye al farmacéutico.
              <span className="text-[#1ABBB3]"> Lo potencia.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              La tecnología está para quitar lo repetitivo, no el consejo ni la confianza que solo da
              una persona en el mostrador.
            </p>
          </div>
          <ul className="mt-10 space-y-4 lg:mt-0 lg:w-1/2">
            <li className="flex gap-3 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 sm:p-4">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] sm:text-base">No es un CRM</p>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  No vas a “gestionar relaciones” abstractas: vas a atender mejor al que ya está en
                  tu puerta.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-gray-100 sm:p-4">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] sm:text-base">No es e-commerce</p>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  No montamos una tienda online genérica: es tu farmacia, tu catálogo y tu forma de
                  pedir en tienda.
                </p>
              </div>
            </li>
            <li className="relative flex gap-4 overflow-hidden rounded-2xl border-2 border-[#1ABBB3] bg-gradient-to-br from-[#1ABBB3] to-[#159a94] p-6 shadow-xl ring-4 ring-[#4ED3C2]/25 sm:p-7">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
                aria-hidden
              />
              <CheckCircle2 className="relative mt-1 h-7 w-7 shrink-0 text-white" aria-hidden />
              <div className="relative">
                <p className="text-lg font-bold text-white sm:text-xl">Es una capa de experiencia</p>
                <p className="mt-2 text-sm leading-relaxed text-white/95 sm:text-base">
                  Lo que el cliente ve, toca y entiende antes y durante la visita — conectado con lo
                  que tú gestionas detrás.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
