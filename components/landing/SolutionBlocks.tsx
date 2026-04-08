import { LayoutGrid, Monitor, Bot } from "lucide-react";

const blocks = [
  {
    icon: LayoutGrid,
    title: "Catálogo digital",
    micro: "Tus clientes consultan antes de preguntar",
    bullets: ["Productos, ofertas y stock", "Tus clientes entran con un QR"],
    accent: "from-[#1ABBB3]/10 to-[#4ED3C2]/10",
  },
  {
    icon: Monitor,
    title: "Kiosko en tienda",
    micro: "Piden sin pasar por el mostrador",
    bullets: ["Pedidos sin colas", "Flujo claro, tipo McDonald’s"],
    accent: "from-[#4ED3C2]/15 to-[#1ABBB3]/10",
  },
  {
    icon: Bot,
    title: "Asistente con IA",
    micro: "Responde lo repetitivo por ti",
    bullets: ["Responde dudas frecuentes", "Te devuelve minutos en el mostrador"],
    accent: "from-[#1ABBB3]/10 to-white",
  },
] as const;

export default function SolutionBlocks() {
  return (
    <section id="solucion" className="scroll-mt-20 bg-[#F7F9FA] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
            FarmaFácil: lo que ves en sala de esperas, llevado a tu farmacia
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Tres piezas que trabajan juntas para que el cliente se sirva solo cuando pueda — y
            acuda al farmacéutico cuando haga falta.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blocks.map(({ icon: Icon, title, micro, bullets, accent }) => (
            <article
              key={title}
              className={`flex flex-col rounded-2xl border border-gray-100 bg-gradient-to-br ${accent} p-6 shadow-sm ring-1 ring-white/80`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                <Icon className="h-6 w-6 text-[#1ABBB3]" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">{title}</h3>
              <p className="mt-2 text-sm font-semibold leading-snug text-[#1ABBB3]">{micro}</p>
              <ul className="mt-4 flex flex-1 flex-col gap-2 text-gray-600">
                {bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm leading-relaxed sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1ABBB3]" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
