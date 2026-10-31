import Link from "next/link";
import Image from "next/image";
import {
  QrCode,
  LayoutGrid,
  ShoppingBag,
  UserRound,
  Monitor,
  Bot,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SurveyCtaSection from "@/components/landing/SurveyCtaSection";
import { FARMAFACIL_DEMO_URL } from "@/lib/constants";

const plans = [
  {
    id: "general",
    name: "Plan General",
    description:
      "Empieza a digitalizar tu farmacia con una solución sencilla para acercar tus productos y servicios a tus clientes.",
    features: [
      "Acceso mediante QR de farmacia",
      "Catálogo genérico de productos",
      "Solicitudes y pedidos",
      "Identificación básica del cliente mediante nombre y teléfono",
    ],
    contactHref: "/contacto?plan=general",
    accent: "from-[#1ABBB3]/10 to-[#4ED3C2]/10",
  },
  {
    id: "personalizado",
    name: "Plan Personalizado",
    description:
      "Ofrece a tus clientes una experiencia digital adaptada a tu farmacia.",
    features: [
      "Funcionalidades del plan General",
      "Catálogo propio de la farmacia",
      "Cuenta de cliente",
      "Historial de pedidos",
    ],
    contactHref: "/contacto?plan=personalizado",
    accent: "from-[#4ED3C2]/15 to-[#1ABBB3]/10",
  },
  {
    id: "asistente-ia",
    name: "Plan con Asistente IA",
    description:
      "Incorpora inteligencia artificial a la atención digital de tu farmacia.",
    features: [
      "Funcionalidades del plan Personalizado",
      "Asistente IA personalizado",
      "Asistente conectado al catálogo propio de la farmacia",
    ],
    contactHref: "/contacto?plan=asistente-ia",
    accent: "from-[#1ABBB3]/10 to-white",
    note: "El asistente orienta al cliente sobre el catálogo y la farmacia. No realiza diagnósticos ni asesoramiento clínico autónomo.",
  },
] as const;

const platformFeatures = [
  {
    icon: LayoutGrid,
    title: "Catálogo digital",
    description:
      "Consulta de productos y ofertas según la modalidad contratada.",
  },
  {
    icon: ShoppingBag,
    title: "Pedidos",
    description: "Solicitudes y pedidos desde el canal digital de la farmacia.",
  },
  {
    icon: QrCode,
    title: "Acceso mediante QR",
    description: "Entrada pública a la farmacia con un código QR propio.",
  },
  {
    icon: UserRound,
    title: "Gestión de clientes",
    description:
      "Cuenta e historial disponibles en modalidades que los incluyen.",
  },
  {
    icon: Monitor,
    title: "Kiosko de autoservicio",
    description:
      "Dispositivo físico opcional; se contrata de forma independiente.",
  },
  {
    icon: Bot,
    title: "Asistente IA",
    description:
      "Incluido en la modalidad con Asistente IA, ligado al catálogo propio.",
  },
] as const;

/**
 * Contenido comercial de /soluciones.
 * Enlaces a /contacto?plan=… preparados; el formulario aún no consume el parámetro.
 */
export default function SolucionesContent() {
  return (
    <>
      {/* Hero de página (no es el hero de la home) */}
      <section className="border-b border-gray-100 bg-white pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#1ABBB3]">
                Soluciones y planes
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl">
                Una solución para cada farmacia
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Descubre las soluciones de FarmaFácil y elige la modalidad que
                mejor se adapta a tu farmacia.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-[#1ABBB3] px-6 text-white hover:bg-[#159a94]"
                >
                  <Link href="/contacto">Solicitar información</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#1ABBB3] bg-white px-6 text-[#1ABBB3] hover:bg-[#1ABBB3]/10"
                >
                  <a
                    href={FARMAFACIL_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver demostración
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-2 w-full max-w-lg justify-self-center sm:mt-4 lg:mt-0 lg:max-w-xl lg:justify-self-end">
              <Image
                src="/images/ilustraciones/ecosistema-farmafacil-sin-logo.png"
                alt="Ilustración conceptual del ecosistema FarmaFácil: móvil, kiosko y panel de gestión conectados."
                width={1366}
                height={768}
                sizes="(min-width: 1024px) 36rem, calc(100vw - 2rem)"
                className="mx-auto h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Planes + franja promocional compacta */}
      <section className="bg-[#F7F9FA] py-16 sm:py-20" aria-labelledby="planes-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2
            id="planes-title"
            className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl"
          >
            Nuestros planes
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Elige el plan que mejor se adapta a tu farmacia.
          </p>

          {/*
            Prueba temporal: el mismo banner horizontal en escritorio y en móvil.
            La versión móvil sigue en public/images/promociones/promo-lanzamiento-mobile.png.
          */}
          <Image
            src="/images/promociones/promo-lanzamiento-desktop.png"
            alt="Promoción de lanzamiento 2027: 60 % de descuento exclusivo para las primeras 20 farmacias que contraten FarmaFácil en 2027. Consulta las condiciones de la promoción."
            width={2240}
            height={1260}
            sizes="(min-width: 1024px) 1088px, calc(100vw - 2rem)"
            className="mt-8 h-auto w-full rounded-2xl"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const featured = plan.id === "asistente-ia";

              return (
                <Card
                  key={plan.id}
                  className={
                    featured
                      ? `relative flex flex-col border-2 border-[#1ABBB3] bg-gradient-to-br ${plan.accent} shadow-[0_12px_32px_-18px_rgba(26,187,179,0.55)] ring-1 ring-[#1ABBB3]/25`
                      : `flex flex-col overflow-hidden border-gray-100 bg-gradient-to-br ${plan.accent} shadow-sm ring-1 ring-white/80`
                  }
                >
                  {featured ? (
                    <p className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1ABBB3] px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                      Plan más completo
                    </p>
                  ) : null}
                  <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
                    {featured ? (
                      <Image
                        src="/images/ilustraciones/asistente-ia.png"
                        alt="Ilustración conceptual del Asistente IA de FarmaFácil."
                        width={1181}
                        height={1181}
                        sizes="(min-width: 640px) 13rem, 11rem"
                        className="mx-auto mb-6 h-auto w-44 object-contain sm:w-52"
                      />
                    ) : null}
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      {plan.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                      {plan.description}
                    </p>
                    <ul className="mt-6 flex flex-1 flex-col gap-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-2 text-sm leading-relaxed text-gray-700 sm:text-base"
                        >
                          <Check
                            className="mt-0.5 h-5 w-5 shrink-0 text-[#1ABBB3]"
                            aria-hidden
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {"note" in plan && plan.note ? (
                      <p className="mt-4 text-xs leading-relaxed text-gray-500">
                        {plan.note}
                      </p>
                    ) : null}
                    <Button
                      asChild
                      className="mt-8 w-full rounded-full bg-[#1ABBB3] text-white hover:bg-[#159a94]"
                    >
                      <Link href={plan.contactHref}>Solicitar información</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kiosko */}
      <section
        className="bg-white py-16 sm:py-20"
        aria-labelledby="kiosko-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2
                id="kiosko-title"
                className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl"
              >
                Tu farmacia, también en autoservicio
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                FarmaFácil puede incorporar un kiosko físico para facilitar la
                consulta del catálogo y la experiencia digital dentro de la
                farmacia.
              </p>
              <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex gap-2 text-sm sm:text-base">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1ABBB3]"
                    aria-hidden
                  />
                  <span>
                    Servicio opcional de contratación independiente: no está
                    incluido en las cuotas de los tres planes.
                  </span>
                </li>
                <li className="flex gap-2 text-sm sm:text-base">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1ABBB3]"
                    aria-hidden
                  />
                  <span>
                    Compatible con las modalidades de pago para complementar la
                    atención en sala.
                  </span>
                </li>
              </ul>
              <Button
                asChild
                className="mt-8 hidden rounded-full bg-[#1ABBB3] px-6 text-white hover:bg-[#159a94] lg:inline-flex"
              >
                <Link href="/contacto?plan=kiosko">Solicitar información</Link>
              </Button>
            </div>

            <Image
              src="/images/kiosko/kiosko-farmafacil-premium.png"
              alt="Kiosko de autoservicio FarmaFácil con pantalla táctil, impresora y terminal de pago."
              width={1366}
              height={768}
              sizes="(min-width: 1024px) 32rem, calc(100vw - 2rem)"
              className="h-auto w-full rounded-2xl object-contain"
            />

            <Button
              asChild
              className="justify-self-start rounded-full bg-[#1ABBB3] px-6 text-white hover:bg-[#159a94] lg:hidden"
            >
              <Link href="/contacto?plan=kiosko">Solicitar información</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Funcionalidades de plataforma */}
      <section
        className="bg-[#F7F9FA] py-16 sm:py-20"
        aria-labelledby="plataforma-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2
            id="plataforma-title"
            className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl"
          >
            Funcionalidades de la plataforma
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gray-600">
            Todo lo que necesitas para ofrecer una experiencia más ágil,
            moderna y personalizada en tu farmacia.
          </p>
          <figure className="mx-auto mt-8 max-w-md sm:mt-10 sm:max-w-lg">
            <Image
              src="/images/ilustraciones/catalogo-pedidos-qr.png"
              alt="Ilustración conceptual: catálogo digital, acceso por QR y pedidos en FarmaFácil."
              width={1264}
              height={1264}
              sizes="(min-width: 640px) 32rem, calc(100vw - 2rem)"
              className="mx-auto h-auto w-full object-contain"
            />
            <figcaption className="mt-3 text-center text-xs text-gray-500 sm:text-sm">
              Ilustración conceptual (no es una captura de la aplicación).
            </figcaption>
          </figure>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {platformFeatures.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-gray-100/90 bg-white p-6 shadow-[0_4px_20px_-12px_rgba(26,27,30,0.18)] transition-shadow duration-200 hover:shadow-[0_10px_28px_-14px_rgba(26,187,179,0.35)] sm:p-7"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1ABBB3]/12 ring-1 ring-[#1ABBB3]/15">
                  <Icon className="h-7 w-7 text-[#1ABBB3]" aria-hidden />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[#1A1A1A] sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-center text-sm leading-relaxed text-gray-500 sm:mx-auto sm:text-[15px]">
            Las funcionalidades disponibles dependen del plan contratado. El
            kiosko es un servicio opcional de contratación independiente.
          </p>
        </div>
      </section>

      <SurveyCtaSection showIllustration />

      {/* CTA final */}
      <section
        className="relative overflow-hidden bg-[#0A0C10] py-16 sm:py-20"
        aria-labelledby="cta-final-title"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,187,179,0.18),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[min(100%,40rem)] -translate-x-1/2 rounded-full bg-[#1ABBB3]/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-6 flex justify-center">
            <Image
              src="/images/branding/farmafacil-emblema-3d-transparente.png"
              alt="FarmaFácil"
              width={110}
              height={110}
              className="h-[72px] w-[72px] object-contain sm:h-[100px] sm:w-[100px]"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ED3C2] sm:text-sm">
            Descubre FarmaFácil
          </p>
          <h2
            id="cta-final-title"
            className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Tu farmacia puede dar el siguiente paso.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#A8B0B8] sm:text-lg">
            Descubre cómo FarmaFácil conecta el catálogo digital, los pedidos,
            el autoservicio y la inteligencia artificial para mejorar la
            experiencia de tus clientes.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              className="h-12 rounded-full bg-[#1ABBB3] px-7 text-base font-semibold text-white hover:bg-[#159a94]"
            >
              <a
                href={FARMAFACIL_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Probar demo interactiva
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#4ED3C2]/50 bg-transparent px-7 text-base font-semibold text-[#4ED3C2] hover:bg-[#1ABBB3]/10 hover:text-white"
            >
              <Link href="/#solicitar-demo">Solicitar una demostración</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
