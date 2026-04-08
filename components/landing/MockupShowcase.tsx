import { Smartphone, Monitor, LayoutDashboard } from "lucide-react";

function MobileClientMock() {
  return (
    <div className="mx-auto w-full max-w-[200px]">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#1ABBB3]">
        Cliente (móvil)
      </p>
      <div className="rounded-[1.75rem] border-[3px] border-gray-800 bg-gray-900 p-1 shadow-xl">
        <div className="overflow-hidden rounded-[1.4rem] bg-white">
          <div className="bg-[#1ABBB3] px-3 py-2.5 text-center text-xs font-bold text-white">
            Tu farmacia
          </div>
          <div className="space-y-2 p-2">
            <div className="rounded-lg bg-[#F7F9FA] px-2 py-1.5 text-[10px] text-gray-500">Buscar…</div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2 rounded-lg border border-gray-100 p-2">
                <div className="h-9 w-9 rounded-md bg-gradient-to-br from-[#4ED3C2]/30 to-[#1ABBB3]/20" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-2 w-full max-w-[80%] rounded bg-gray-200" />
                  <div className="h-2 w-12 rounded bg-[#1ABBB3]/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">Catálogo y pedidos desde el bolsillo</p>
    </div>
  );
}

function KioskTouchMock() {
  return (
    <div className="mx-auto w-full max-w-[240px]">
      <div className="rounded-b-xl bg-gray-600 px-4 pb-2 pt-1">
        <div className="mx-auto h-1.5 w-20 rounded-full bg-gray-500" />
      </div>
      <div className="aspect-[4/5] rounded-t-xl border-x-[6px] border-t-[6px] border-gray-600 bg-gray-700 p-2 shadow-xl">
        <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white">
          <div className="grid grid-cols-2 gap-2 p-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl ${i === 1 ? "bg-[#1ABBB3]/20 ring-2 ring-[#1ABBB3]" : "bg-gray-100"}`}
              />
            ))}
          </div>
          <div className="mt-auto border-t border-gray-100 p-3">
            <div className="h-9 w-full rounded-lg bg-[#1ABBB3] text-center text-xs font-bold leading-9 text-white">
              Pedir en mostrador
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">En sala de espera o entrada</p>
    </div>
  );
}

function PharmacyPanelMock() {
  return (
    <div className="mx-auto w-full max-w-[280px]">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#1ABBB3]">
        Tu control (panel)
      </p>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-xl ring-1 ring-gray-200">
        <div className="flex h-8 items-center gap-1.5 border-b border-gray-200 bg-white px-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="bg-[#1A1A1A] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-white/90">Panel farmacia</span>
            <span className="rounded bg-[#1ABBB3] px-1.5 py-0.5 text-[9px] font-bold text-white">3 nuevos</span>
          </div>
          <div className="space-y-2">
            {["Pedido #104", "Pedido #103", "Consulta IA"].map((label, i) => (
              <div
                key={label}
                className={`rounded-lg px-2 py-2 text-[10px] ${i === 0 ? "bg-[#1ABBB3]/25 text-white" : "bg-white/10 text-white/80"}`}
              >
                {label}
                <span className="float-right opacity-70">{i === 2 ? "FAQ" : "Listo"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">Pedidos y avisos en un solo sitio</p>
    </div>
  );
}

export default function MockupShowcase() {
  return (
    <section id="demo-visual" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
              Así se ve en la práctica
            </h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Mismo producto, tres pantallas: cliente en el móvil, cola en el kiosko y tú con el
              control en el panel.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#F7F9FA] px-4 py-2 text-sm text-gray-600 sm:flex">
            <Smartphone className="h-4 w-4 text-[#1ABBB3]" />
            <Monitor className="h-4 w-4 text-[#1ABBB3]" />
            <LayoutDashboard className="h-4 w-4 text-[#1ABBB3]" />
            <span className="font-medium text-[#1A1A1A]">Todo incluido</span>
          </div>
        </div>

        <div className="mt-14 grid items-start gap-12 md:grid-cols-3 md:gap-8">
          <MobileClientMock />
          <KioskTouchMock />
          <PharmacyPanelMock />
        </div>
      </div>
    </section>
  );
}
