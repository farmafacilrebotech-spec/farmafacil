import { Footprints, UserX, Rocket } from "lucide-react";

const cases = [
  {
    icon: Footprints,
    title: "Mucho tráfico",
    text: "Horas punta con la puerta sin parar: el QR y el kiosko reparten la carga antes de que llegue al mostrador.",
  },
  {
    icon: UserX,
    title: "Poco personal",
    text: "Cuando sois pocos, cada minuto cuenta. Menos preguntas repetidas = más tiempo para vender y asesorar.",
  },
  {
    icon: Rocket,
    title: "Quieres diferenciarte",
    text: "Clientes que comparan farmacias notan la experiencia. Dar pedido y claridad sin fricción es tu ventaja.",
  },
] as const;

export default function UseCasesSection() {
  return (
    <section id="casos-uso" className="scroll-mt-20 bg-[#F7F9FA] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          ¿Encaja contigo?
        </h2>
        <p className="mt-3 max-w-2xl text-gray-600">
          Farmacias como la tuya ya están pidiendo demos por situaciones muy concretas.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <Icon className="h-8 w-8 text-[#1ABBB3]" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-[#1A1A1A]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
