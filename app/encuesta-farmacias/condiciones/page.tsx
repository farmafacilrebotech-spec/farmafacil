import type { Metadata } from "next";
import Link from "next/link";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Condiciones del estudio — FarmaFácil",
  description:
    "Condiciones de participación e incentivo del estudio sobre retos de la farmacia comunitaria.",
};

export default function CondicionesEstudioPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <LandingNav />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Documento provisional. Debe ser revisado jurídicamente antes del lanzamiento público.
          </p>
          <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
            Condiciones de participación e incentivo
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Estudio sobre los retos actuales de la farmacia comunitaria
          </p>

          <div className="prose prose-sm mt-8 max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">1. Organizador</h2>
              <p>
                La iniciativa es impulsada por FarmaFácil / ReBoTech Solutions (datos de contacto
                públicos en la web: contacto@farmafacil.solutions). Los datos fiscales y jurídicos
                definitivos del responsable del tratamiento y de la promoción deberán completarse
                tras revisión legal.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">2. Participantes admitidos</h2>
              <p>
                Pueden participar titulares y cotitulares de farmacias comunitarias en España. Las
                respuestas marcadas como «Otro» en el cargo podrán registrarse, pero no se
                considerarán automáticamente aptas para el incentivo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                3. Una participación incentivada por farmacia
              </h2>
              <p>
                Solo se admitirá una participación incentivada por farmacia. FarmaFácil podrá
                rechazar duplicados detectados por email, teléfono, nombre de farmacia u otros
                indicios razonables.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">4. Requisitos de validez</h2>
              <p>
                Para ser válida, la participación debe estar completa, ser coherente, veraz y
                corresponder a una farmacia real. FarmaFácil podrá contactar telefónicamente para
                verificar la vinculación del participante con la farmacia indicada.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">5. Incentivo</h2>
              <p>
                Como agradecimiento, las participaciones válidas y verificadas podrán recibir un
                bono regalo de Amazon de 10 €, enviado al email facilitado en el formulario. El bono
                no se entrega automáticamente.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">6. Procedimiento de revisión</h2>
              <p>
                Todas las respuestas se revisan manualmente. El plazo orientativo de revisión es de
                hasta 15 días laborables desde la recepción, sin perjuicio de ampliaciones por
                volumen o necesidad de verificación adicional.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">7. Motivos de exclusión</h2>
              <p>
                Quedarán excluidas, entre otras, las participaciones incompletas, duplicadas,
                incoherentes, fraudulentas, de prueba, o que no acrediten de forma razonable la
                condición de titular o cotitular.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">8. Entrega del bono</h2>
              <p>
                Tras la aprobación, el bono se enviará por email. FarmaFácil registrará
                internamente la referencia del bono y la fecha de envío. No existe derecho
                automático al incentivo por el solo hecho de enviar el formulario.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">9. Disponibilidad limitada</h2>
              <p>
                La campaña tiene disponibilidad limitada y podrá finalizarse por agotamiento del
                presupuesto de incentivos o por decisión del organizador, sin perjuicio del
                tratamiento de las participaciones ya recibidas según estas condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">10. Tratamiento de datos</h2>
              <p>
                Los datos se tratarán conforme a la{" "}
                <Link href="/privacidad" className="text-[#1ABBB3] underline">
                  política de privacidad
                </Link>
                . La aceptación de comunicaciones comerciales o de la comunidad es voluntaria y no
                condiciona el acceso al incentivo.
              </p>
            </section>
          </div>

          <p className="mt-8">
            <Link href="/encuesta-farmacias" className="font-medium text-[#1ABBB3] hover:underline">
              ← Volver a la encuesta
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
