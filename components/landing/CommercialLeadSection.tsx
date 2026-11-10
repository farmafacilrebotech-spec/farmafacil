import Image from "next/image";
import CommercialLeadForm from "./CommercialLeadForm";
import type { CommercialPreset } from "@/lib/contacto/comercial";

type CommercialLeadSectionProps = {
  id?: string;
  heading?: "h1" | "h2";
  source: "landing" | "solicitar";
  preset?: CommercialPreset;
};

export default function CommercialLeadSection({
  id = "solicitar-demo",
  heading = "h2",
  source,
  preset,
}: CommercialLeadSectionProps) {
  const TitleTag = heading;

  return (
    <section
      id={id}
      className="scroll-mt-20 relative bg-[#07090B] py-10 text-white sm:py-16"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-[#1ABBB3]/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#4ED3C2]/10 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-14 lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Image
            src="/images/logo/farmafacil-emblema-circular.png"
            alt="FarmaFácil"
            width={96}
            height={96}
            className="h-[4.5rem] w-[4.5rem] rounded-full object-contain sm:h-24 sm:w-24"
            priority={heading === "h1"}
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#4ED3C2]">
            FarmaFácil para farmacias
          </p>
          <TitleTag className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cuéntanos qué necesita tu farmacia
          </TitleTag>
          <p className="mt-4 text-base leading-relaxed text-[#C5CCD3] sm:text-lg">
            Elige el motivo de tu solicitud. Te respondemos para valorar el siguiente paso.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-[#C5CCD3] sm:text-base">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1ABBB3]" aria-hidden />
              Piloto, implantación, demostración o información de planes.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1ABBB3]" aria-hidden />
              Sin permanencia en esta primera conversación.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1ABBB3]" aria-hidden />
              Las comunicaciones promocionales solo se envían si las pides.
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-[#F7F9FA] p-4 text-[#1A1A1A] shadow-[0_24px_80px_-32px_rgba(26,187,179,0.45)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0F766E]">
            Solicitud
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            Déjanos tus datos y nos pondremos en contacto contigo.
          </p>
          <CommercialLeadForm source={source} preset={preset} className="mt-4" />
        </div>
      </div>
    </section>
  );
}
