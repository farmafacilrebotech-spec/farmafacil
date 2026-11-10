import Image from "next/image";
import { Smartphone, Monitor, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { farmafacilSolicitudHref } from "@/lib/constants";

function MobileClientMock() {
  return (
    <div className="mx-auto flex w-full max-w-[300px] flex-col items-center sm:max-w-[260px] md:max-w-[250px]">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#1ABBB3]">
        Cliente (móvil)
      </p>
      <Image
        src="/images/mocks/catalogo-cliente-farmafacil.png"
        alt="Catálogo móvil de FarmaFácil con productos, categorías y acceso al Asistente IA."
        width={1414}
        height={2000}
        sizes="(min-width: 768px) 15.625rem, (min-width: 640px) 16.25rem, 18.75rem"
        className="h-auto w-full rounded-2xl object-contain shadow-lg ring-1 ring-black/5"
      />
      <p className="mt-3 text-center text-xs text-gray-500">Catálogo y pedidos desde el bolsillo</p>
    </div>
  );
}

function KioskTouchMock() {
  return (
    <div className="mx-auto flex w-full max-w-[210px] flex-col items-center sm:max-w-[190px] md:max-w-[168px]">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#1ABBB3]">
        Kiosko
      </p>
      <Image
        src="/images/kiosko/kiosko-farmafacil-sin-fondo.png"
        alt="Kiosko de autoservicio FarmaFácil con pantalla táctil, impresora y terminal de pago."
        width={570}
        height={1474}
        sizes="(min-width: 768px) 10.5rem, (min-width: 640px) 11.875rem, 13.125rem"
        className="h-auto w-full object-contain drop-shadow-md"
      />
      <p className="mt-3 text-center text-xs text-gray-500">En sala de espera o entrada</p>
    </div>
  );
}

function PharmacyPanelMock() {
  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col items-center sm:max-w-[340px] md:max-w-[340px]">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#1ABBB3]">
        Tu control (panel)
      </p>
      <Image
        src="/images/mocks/panel-pedidos-farmafacil.png"
        alt="Panel de pedidos de farmacia FarmaFácil con listado de estados y totales."
        width={1366}
        height={768}
        sizes="(min-width: 768px) 21.25rem, (min-width: 640px) 21.25rem, 23.75rem"
        className="h-auto w-full rounded-xl object-contain shadow-lg ring-1 ring-black/5"
      />
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

        <div className="mt-14 grid items-start justify-items-center gap-12 md:grid-cols-3 md:gap-8">
          <MobileClientMock />
          <KioskTouchMock />
          <PharmacyPanelMock />
        </div>

        <div className="mt-14 flex flex-col items-center text-center">
          <p className="max-w-2xl text-gray-600">
            Si quieres verlo aplicado a tu farmacia, podemos valorar contigo una prueba piloto con
            el recorrido del cliente, el kiosco y los paneles de gestión.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 h-12 rounded-full bg-[#1ABBB3] px-8 text-base font-semibold text-white hover:bg-[#159a94]"
          >
            <a href={farmafacilSolicitudHref("demo-visual")}>Solicitar una prueba</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
