import { Button } from "@/components/ui/button";
import { FARMAFACIL_PRUEBA_HREF } from "@/lib/constants";

export default function CTASection() {
  return (
    <section id="cta" className="scroll-mt-20 bg-gradient-to-br from-[#1ABBB3] to-[#159a94] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Empieza a digitalizar tu farmacia hoy
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Valoramos contigo una prueba piloto en tu oficina, sin compromiso. Tú decides si encaja
          con tu ritmo.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 rounded-full bg-white px-10 text-base font-bold text-[#1ABBB3] shadow-lg hover:bg-[#F7F9FA]"
        >
          <a href={FARMAFACIL_PRUEBA_HREF}>Solicitar una prueba</a>
        </Button>
      </div>
    </section>
  );
}
