import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-6">
            Política de Privacidad
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: 10 de noviembre de 2026
          </p>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                1. Introducción
              </h2>
              <p className="mb-4 leading-relaxed">
                En FarmaFácil, nos comprometemos a proteger su privacidad y datos personales. 
                Esta política de privacidad explica cómo recopilamos, utilizamos, compartimos 
                y protegemos su información personal cuando utiliza nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                2. Información que Recopilamos
              </h2>
              <p className="mb-4 leading-relaxed">
                Recopilamos diferentes tipos de información según cómo utilice nuestros servicios:
              </p>
              
              <h3 className="text-xl font-semibold text-[#1A1A1A] mt-4 mb-3">
                2.1 Información que nos proporciona directamente
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Información de registro (nombre, email, contraseña)</li>
                <li>Información de la farmacia (nombre, dirección, teléfono, CIF)</li>
                <li>Información de productos y catálogo</li>
                <li>Información de pedidos y transacciones</li>
                <li>Mensajes enviados a través del asistente virtual</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1A1A1A] mt-4 mb-3">
                2.2 Información recopilada automáticamente
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Dirección IP y ubicación geográfica aproximada</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                3. Cómo Utilizamos su Información
              </h2>
              <p className="mb-4 leading-relaxed">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Procesar pedidos y transacciones</li>
                <li>Mejorar y personalizar su experiencia</li>
                <li>Atender las solicitudes que nos envíe y prestar los servicios que haya pedido</li>
                <li>
                  Enviar comunicaciones promocionales solo cuando exista un consentimiento
                  separado, libre y revocable (véase el apartado 12)
                </li>
                <li>Proporcionar soporte técnico</li>
                <li>Analizar el uso de la plataforma y mejorar nuestros servicios</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                4. Compartir su Información
              </h2>
              <p className="mb-4 leading-relaxed">
                No vendemos su información personal a terceros. Podemos compartir su información con:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar 
                  nuestra plataforma (hosting, análisis, procesamiento de pagos)
                </li>
                <li>
                  <strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o para 
                  proteger nuestros derechos
                </li>
                <li>
                  <strong>Con su consentimiento:</strong> En otros casos, solo con su 
                  autorización explícita
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                5. Seguridad de los Datos
              </h2>
              <p className="mb-4 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
                proteger su información personal contra acceso no autorizado, alteración, 
                divulgación o destrucción. Estas medidas incluyen:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Controles de acceso estrictos</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Copias de seguridad periódicas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                6. Sus Derechos
              </h2>
              <p className="mb-4 leading-relaxed">
                En cumplimiento con la normativa de protección de datos (RGPD, LOPD), 
                usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Limitación:</strong> Solicitar la limitación del procesamiento</li>
              </ul>
              <p className="mb-4 leading-relaxed">
                Para ejercer estos derechos, contacte con nosotros en 
                <a href="mailto:privacidad@farmafacil.solutions" className="text-[#1ABBB3] hover:underline ml-1">
                  privacidad@farmafacil.solutions
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                7. Cookies
              </h2>
              <p className="mb-4 leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra 
                plataforma. Las cookies son pequeños archivos de texto almacenados en su dispositivo. 
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar 
                algunas funcionalidades del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                8. Retención de Datos
              </h2>
              <p className="mb-4 leading-relaxed">
                Conservamos su información personal durante el tiempo necesario para cumplir con 
                los fines descritos en esta política, a menos que la ley requiera o permita un 
                período de retención más largo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                9. Transferencias Internacionales
              </h2>
              <p className="mb-4 leading-relaxed">
                Sus datos pueden ser transferidos y procesados en países fuera del Espacio Económico 
                Europeo. En estos casos, garantizamos que se implementen las salvaguardas apropiadas 
                conforme a la normativa aplicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                10. Cambios en esta Política
              </h2>
              <p className="mb-4 leading-relaxed">
                Podemos actualizar esta política de privacidad periódicamente. Le notificaremos 
                sobre cambios significativos publicando la nueva política en esta página y 
                actualizando la fecha de &quot;última actualización&quot;.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                11. Contacto
              </h2>
              <p className="mb-4 leading-relaxed">
                Si tiene preguntas sobre esta política de privacidad o sobre cómo manejamos 
                sus datos personales, puede contactarnos:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>
                  <strong>Email:</strong> 
                  <a href="mailto:privacidad@farmafacil.solutions" className="text-[#1ABBB3] hover:underline ml-1">
                    privacidad@farmafacil.solutions
                  </a>
                </li>
                <li>
                  <strong>Formulario de contacto:</strong> 
                  <a href="/contacto" className="text-[#1ABBB3] hover:underline ml-1">
                    Página de contacto
                  </a>
                </li>
              </ul>
            </section>

            <section id="solicitudes-comerciales">
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                12. Solicitudes comerciales de farmacias
              </h2>
              <p className="mb-4 leading-relaxed">
                Cuando una farmacia envía el formulario de solicitud, FarmaFácil trata el nombre,
                la farmacia, el email, el teléfono, el interés principal, el mensaje y la
                procedencia técnica del enlace (origen, medio, campaña o pieza).
                Esos últimos datos son códigos del botón o del QR, no datos personales.
              </p>
              <p className="mb-4 leading-relaxed">
                La finalidad es atender la solicitud y, si procede, preparar una conversación
                comercial, una demostración o una prueba. La base es la aplicación de medidas
                precontractuales a petición de la persona interesada. Enviar el formulario no
                supone aceptar comunicaciones promocionales.
              </p>
              <p className="mb-4 leading-relaxed">
                Las comunicaciones sobre planes, novedades y promociones solo se envían si se marca
                la casilla opcional, que no está preseleccionada. La base de esas comunicaciones es
                el consentimiento, que puede retirarse en cualquier momento escribiendo a{" "}
                <a href="mailto:privacidad@farmafacil.solutions" className="text-[#1ABBB3] hover:underline">
                  privacidad@farmafacil.solutions
                </a>
                , sin que ello afecte a la atención de la solicitud ya enviada.
              </p>
              <p className="mb-4 leading-relaxed">
                No incluimos el nombre, el email, el teléfono ni el mensaje en la dirección web.
                La herramienta de analítica, cuando está activa, recibe la ruta de la página sin
                los parámetros de la dirección. El registro operativo de la solicitud y el envío
                del correo usan encargados (hoja de cálculo de Google y Resend). No vendemos estos
                datos.
              </p>
              <p className="mb-4 leading-relaxed">
                Conservamos la solicitud el tiempo necesario para gestionarla y, en su caso, durante
                la relación comercial que pueda iniciarse y los plazos que exija la normativa.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

