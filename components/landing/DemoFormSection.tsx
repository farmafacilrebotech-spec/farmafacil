import ContactForm from "./ContactForm";

export default function DemoFormSection() {
  return (
    <section
      id="solicitar-demo"
      className="scroll-mt-20 border-t border-gray-100 bg-[#F7F9FA] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
              Solicita tu demo gratuita
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cuéntanos quién eres y en qué farmacia trabajas. Te llamamos o escribimos con una
              fecha para enseñarte FarmaFácil en vivo.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-[#1ABBB3]">·</span>
                Sin tarjeta ni permanencia en la primera toma de contacto.
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#1ABBB3]">·</span>
                Enfoque en tu día a día, no en slides interminables.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
            <ContactForm source="landing" />
          </div>
        </div>
      </div>
    </section>
  );
}
