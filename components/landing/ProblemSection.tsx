import { Users, Phone, MessageCircle, Clock } from "lucide-react";

const problems = [
  {
    icon: Users,
    text: "Colas en horas punta",
  },
  {
    icon: Phone,
    text: "Teléfono interrumpiendo constantemente",
  },
  {
    icon: MessageCircle,
    text: "Clientes que preguntan lo mismo una y otra vez",
  },
  {
    icon: Clock,
    text: "Falta de tiempo para atender mejor",
  },
] as const;

export default function ProblemSection() {
  return (
    <section id="problema" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          Tu farmacia ya va bien. El ritmo del mostrador, no tanto.
        </h2>
        <p className="mt-3 max-w-xl text-gray-600">
          Si esto te suena, no estás solo: son retos del día a día en casi todas las oficinas de
          farmacia.
        </p>
        <div className="mt-6 max-w-2xl space-y-1 text-base font-medium leading-relaxed text-[#1A1A1A] sm:space-y-0 sm:text-lg">
          <p>Cada interrupción rompe el flujo.</p>
          <p>Cada cola es una oportunidad perdida.</p>
          <p>Y cada pregunta repetida te quita tiempo de valor.</p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {problems.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#F7F9FA] p-5 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                <Icon className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
              </span>
              <span className="pt-2 text-base font-medium leading-snug text-[#1A1A1A]">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
