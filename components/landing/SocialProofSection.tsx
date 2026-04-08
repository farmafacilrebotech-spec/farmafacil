import { Quote } from "lucide-react";

const quotes = [
  {
    text: "Ahora atendemos sin interrupciones constantes",
    attribution: "Farmacia (ejemplo)",
  },
  {
    text: "Las colas ya no son un problema",
    attribution: "Farmacia (ejemplo)",
  },
] as const;

export default function SocialProofSection() {
  return (
    <section
      id="prueba-social"
      className="scroll-mt-20 border-y border-gray-100 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
          Farmacias que ya están usando FarmaFácil
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
          Ejemplos de cómo describe el día a día quien ya lo tiene en marcha.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {quotes.map(({ text, attribution }) => (
            <figure
              key={text}
              className="rounded-2xl border border-gray-100 bg-[#F7F9FA] p-6 shadow-sm"
            >
              <Quote className="h-8 w-8 text-[#1ABBB3]/40" aria-hidden />
              <blockquote className="mt-3 text-lg font-medium leading-snug text-[#1A1A1A]">
                “{text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-[#1ABBB3]">
                — {attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
