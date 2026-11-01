import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FARMAFACIL_APP_CUENTA_URL,
  FARMAFACIL_APP_LOGIN_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Acceder | FarmaFácil",
  description:
    "Selecciona cómo quieres acceder a FarmaFácil: panel de farmacia o cuenta de cliente.",
  robots: {
    index: true,
    follow: true,
  },
};

const cardBase =
  "flex h-full flex-col rounded-2xl border border-[#C5CCD3]/20 bg-[#121212] p-6 sm:p-8";

const ctaBase =
  "mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]";

export default function AccederPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B0B] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(26,187,179,0.28), transparent 55%), radial-gradient(ellipse 50% 35% at 90% 100%, rgba(197,204,211,0.1), transparent 50%)",
        }}
      />

      <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <Link
            href="/"
            className="mb-6 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]"
            aria-label="Ir al inicio de FarmaFácil"
          >
            <Image
              src="/images/logo/farmafacil-emblema-circular.png"
              alt="FarmaFácil"
              width={96}
              height={96}
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              priority
            />
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Bienvenido a FarmaFácil
          </h1>
          <p className="mt-3 max-w-md text-base text-[#C5CCD3] sm:text-lg">
            Selecciona cómo quieres acceder.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <section className={cardBase} aria-labelledby="acceder-farmacia-title">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1ABBB3]">
              Farmacias
            </p>
            <h2
              id="acceder-farmacia-title"
              className="mt-3 text-2xl font-semibold tracking-tight text-white"
            >
              Soy una farmacia
            </h2>
            <p className="mt-3 mb-8 text-sm leading-relaxed text-[#C5CCD3] sm:text-base">
              Accede al panel de gestión de tu farmacia.
            </p>
            <a
              href={FARMAFACIL_APP_LOGIN_URL}
              className={`${ctaBase} bg-[#1ABBB3] text-[#0B0B0B] hover:bg-[#159a94]`}
            >
              Acceder como farmacia
            </a>
          </section>

          <section className={cardBase} aria-labelledby="acceder-cliente-title">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5CCD3]">
              Clientes
            </p>
            <h2
              id="acceder-cliente-title"
              className="mt-3 text-2xl font-semibold tracking-tight text-white"
            >
              Soy cliente de farmacia
            </h2>
            <p className="mt-3 mb-8 text-sm leading-relaxed text-[#C5CCD3] sm:text-base">
              Consulta tu cuenta, pedidos y farmacias guardadas.
            </p>
            <a
              href={FARMAFACIL_APP_CUENTA_URL}
              className={`${ctaBase} border border-[#1ABBB3] bg-transparent text-[#1ABBB3] hover:bg-[#1ABBB3]/10`}
            >
              Acceder como cliente
            </a>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-[#C5CCD3]/80">
          <Link
            href="/"
            className="underline-offset-4 transition-colors hover:text-[#1ABBB3] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]"
          >
            Volver al inicio
          </Link>
        </p>
      </main>
    </div>
  );
}
