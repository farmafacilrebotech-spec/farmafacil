import { BellOff, Sparkles, Heart, Building2, Receipt } from "lucide-react";

const benefits = [
  {
    icon: BellOff,
    title: "Menos interrupciones",
    text: "El teléfono y las mismas preguntas dejan de comerse la mitad de la mañana.",
  },
  {
    icon: Sparkles,
    title: "Más ventas impulsivas",
    text: "Ofertas y recomendaciones visibles mientras el cliente espera su turno.",
  },
  {
    icon: Receipt,
    title: "Más tickets por cliente",
    text: "Mientras espera, el cliente ve productos que no venía a comprar.",
  },
  {
    icon: Heart,
    title: "Mejor experiencia",
    text: "Quien entiende y no hace cola, vuelve y recomienda tu farmacia.",
  },
  {
    icon: Building2,
    title: "Imagen moderna",
    text: "Transmites orden, tecnología útil y una farmacia al día — sin postureo.",
  },
] as const;

export default function BenefitsGrid() {
  return (
    <section id="beneficios" className="scroll-mt-20 bg-[#F7F9FA] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          Beneficios que notas en la caja
        </h2>
        <p className="mt-3 max-w-2xl text-gray-600">
          Hablamos de tu negocio, no de “integraciones” ni “arquitecturas”.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1ABBB3]/10">
                <Icon className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1A1A1A]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
