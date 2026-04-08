import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle2, Check } from "lucide-react";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[min(100%,200px)]">
      <div className="aspect-[9/19] rounded-[2rem] border-[3px] border-gray-800 bg-gray-900 p-1.5 shadow-xl">
        <div className="h-full overflow-hidden rounded-[1.65rem] bg-[#F7F9FA]">
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
            <span className="text-[10px] font-semibold text-[#1ABBB3]">Catálogo</span>
            <span className="h-1.5 w-8 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-100">
                <div className="h-10 w-10 shrink-0 rounded-md bg-gradient-to-br from-[#4ED3C2]/40 to-[#1ABBB3]/30" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="h-2 w-3/4 rounded bg-gray-200" />
                  <div className="h-2 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-[#1ABBB3]/40 bg-[#1ABBB3]/5 p-2 text-center">
              <QrCode className="mx-auto h-6 w-6 text-[#1ABBB3]" />
              <p className="mt-1 text-[9px] font-medium text-[#1A1A1A]">Escanea y pide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KioskMockup() {
  return (
    <div className="relative mx-auto w-[min(100%,220px)]">
      <div className="rounded-b-2xl bg-gray-700 px-3 pb-2 pt-1 shadow-xl">
        <div className="mx-auto h-2 w-16 rounded-full bg-gray-600" />
      </div>
      <div className="aspect-[3/4] rounded-t-2xl border-x-4 border-t-4 border-gray-700 bg-gray-800 p-2 shadow-xl">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
          <div className="bg-[#1ABBB3] px-4 py-3 text-center text-sm font-bold text-white">
            Pedido en tienda
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3">
            <div className="rounded-lg bg-[#F7F9FA] p-3 text-center text-xs text-gray-600">
              Toca para elegir
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square rounded-lg bg-[#4ED3C2]/20 ring-1 ring-[#1ABBB3]/20" />
              <div className="aspect-square rounded-lg bg-gray-100" />
              <div className="aspect-square rounded-lg bg-gray-100" />
              <div className="aspect-square rounded-lg bg-gray-100" />
            </div>
            <div className="mt-auto rounded-xl bg-[#1ABBB3] py-2 text-center text-xs font-semibold text-white">
              Confirmar pedido
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderReadyMockup() {
  return (
    <div className="relative mx-auto w-[min(100%,180px)]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg ring-1 ring-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4ED3C2]/25">
            <CheckCircle2 className="h-7 w-7 text-[#1ABBB3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A]">Pedido listo</p>
            <p className="text-xs text-gray-500">Mostrador · sin cola</p>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Recogida</span>
            <span className="font-medium text-[#1ABBB3]">En 2 min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
              >
                <a href="#solicitar-demo">Solicitar demo</a>
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

          <div className="relative">
            <div className="absolute -left-6 top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full bg-[#4ED3C2]/20 blur-3xl lg:block" />
            <div className="absolute -right-4 top-0 h-40 w-40 rounded-full bg-[#1ABBB3]/15 blur-3xl" />
            <div className="relative grid grid-cols-3 items-end gap-3 sm:gap-4">
              <div className="pb-6">
                <PhoneMockup />
              </div>
              <div className="-mb-2">
                <KioskMockup />
              </div>
              <div className="pb-10">
                <OrderReadyMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
