"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, CalendarDays, Send } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useToast } from "@/hooks/use-toast";
import ContactDirectSection from "@/components/contact-card/ContactDirectSection";
import type { ResolvedContactCard } from "@/lib/contact-card";
import {
  FARMAFACIL_CALENDLY_URL,
  FARMAFACIL_CONTACT_EMAIL,
  FARMAFACIL_PHONE_DISPLAY,
  FARMAFACIL_WHATSAPP_URL,
} from "@/lib/constants";

const fieldClassName =
  "h-12 rounded-xl border-[#C5CCD3]/80 bg-[#F7F9FA] px-4 text-[#1A1A1A] shadow-none transition-colors placeholder:text-gray-400 hover:border-[#1ABBB3]/40 focus-visible:bg-white focus-visible:ring-[#1ABBB3]/30 focus-visible:ring-offset-0";

const labelClassName = "mb-2 block text-sm font-medium text-[#1A1A1A]";

export default function ContactoPageClient({
  contact,
}: {
  contact: ResolvedContactCard | null;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    farmacia: "",
    email: "",
    telefono: "",
    tipoUsuario: "",
    mensaje: "",
    infoFarmacia: "",
    aceptarRGPD: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.aceptarRGPD) {
      toast({
        title: "Debes aceptar la política de datos",
        description: "Por favor, marca la casilla antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: formData.nombre,
        farmacia: formData.farmacia || "",
        email: formData.email,
        telefono: formData.telefono || "",
        tipoUsuario: formData.tipoUsuario || "",
        mensaje: formData.mensaje,
        infoFarmacia:
          formData.tipoUsuario === "farmacia" ? formData.infoFarmacia.trim() : "",
        interes: "contacto_general",
        source: "contacto" as const,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error desconocido");
      }

      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      setFormData({
        nombre: "",
        farmacia: "",
        email: "",
        telefono: "",
        tipoUsuario: "",
        mensaje: "",
        infoFarmacia: "",
        aceptarRGPD: false,
      });
    } catch (error: unknown) {
      console.error("Error al enviar:", error);

      toast({
        title: "Error al enviar",
        description: "Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1A1A1A]">
              Contáctanos
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Estamos aquí para ayudarte. Escríbenos o reserva una cita si eres farmacia.
            </p>
          </div>

          <ContactDirectSection contact={contact} className="mb-12" />

          <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10">
            {/* Formulario */}
            <section
              id="formulario-contacto"
              className="scroll-mt-24 rounded-2xl border border-[#C5CCD3]/35 bg-white p-6 sm:p-8 lg:col-span-3 lg:p-10"
            >
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1ABBB3]">
                  Formulario
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A1A]">
                  Envíanos un mensaje
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Cuéntanos quién eres y cómo podemos ayudarte. Te responderemos lo antes posible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contacto-nombre" className={labelClassName}>
                      Nombre
                    </label>
                    <Input
                      id="contacto-nombre"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      required
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <label htmlFor="contacto-farmacia" className={labelClassName}>
                      Farmacia <span className="font-normal text-gray-500">(si aplica)</span>
                    </label>
                    <Input
                      id="contacto-farmacia"
                      placeholder="Nombre de la oficina"
                      value={formData.farmacia}
                      onChange={(e) =>
                        setFormData({ ...formData, farmacia: e.target.value })
                      }
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contacto-email" className={labelClassName}>
                      Email
                    </label>
                    <Input
                      id="contacto-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <label htmlFor="contacto-telefono" className={labelClassName}>
                      Teléfono
                    </label>
                    <Input
                      id="contacto-telefono"
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contacto-tipo" className={labelClassName}>
                    Soy...
                  </label>
                  <select
                    id="contacto-tipo"
                    value={formData.tipoUsuario}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoUsuario: e.target.value })
                    }
                    required
                    className={`${fieldClassName} w-full appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236B7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="cliente">Cliente de farmacia</option>
                    <option value="farmacia">Farmacia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contacto-mensaje" className={labelClassName}>
                    Mensaje
                  </label>
                  <Textarea
                    id="contacto-mensaje"
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    required
                    className={`${fieldClassName} min-h-[8.5rem] py-3`}
                  />
                </div>

                {formData.tipoUsuario === "farmacia" && (
                  <div>
                    <label htmlFor="contacto-info-farmacia" className={labelClassName}>
                      Cuéntanos algo de tu farmacia{" "}
                      <span className="font-normal text-gray-500">(opcional)</span>
                    </label>
                    <Textarea
                      id="contacto-info-farmacia"
                      placeholder="Por ejemplo, dónde está tu farmacia, qué te gustaría mejorar o qué servicios de FarmaFácil te interesan"
                      rows={4}
                      value={formData.infoFarmacia}
                      onChange={(e) =>
                        setFormData({ ...formData, infoFarmacia: e.target.value })
                      }
                      className={`${fieldClassName} min-h-[7rem] py-3`}
                    />
                  </div>
                )}

                <div className="rounded-xl border border-[#C5CCD3]/40 bg-[#F7F9FA] p-4">
                  <div className="flex items-start gap-3">
                    <input
                      id="contacto-rgpd"
                      type="checkbox"
                      checked={formData.aceptarRGPD}
                      onChange={(e) =>
                        setFormData({ ...formData, aceptarRGPD: e.target.checked })
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1ABBB3] accent-[#1ABBB3]"
                      required
                    />
                    <label htmlFor="contacto-rgpd" className="text-sm leading-relaxed text-gray-600">
                      He leído y acepto la{" "}
                      <a
                        href="/privacidad"
                        className="font-medium text-[#1ABBB3] hover:underline"
                        target="_blank"
                      >
                        política de protección de datos
                      </a>
                      .
                    </label>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">
                    Tus datos serán tratados por <span className="font-semibold text-gray-700">FarmaFácil</span>{" "}
                    con la finalidad de gestionar tu solicitud e informarte sobre productos o futuros
                    programas de aceleración. Puedes ejercer tus derechos escribiendo a{" "}
                    <a
                      href="mailto:privacidad@farmafacil.solutions"
                      className="text-[#1ABBB3] hover:underline"
                    >
                      privacidad@farmafacil.solutions
                    </a>
                    .
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white shadow-sm hover:bg-[#159a94] disabled:opacity-70"
                >
                  {loading ? (
                    "Enviando…"
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" aria-hidden />
                      Enviar mensaje
                    </span>
                  )}
                </Button>
              </form>
            </section>

            {/* Información lateral */}
            <aside className="space-y-5 lg:col-span-2">
              <section className="rounded-2xl border border-[#C5CCD3]/35 bg-white p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1ABBB3]">
                  Contacto directo
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#1A1A1A]">
                  Habla con el equipo
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Prefieres escribirnos o llamarnos. Estamos en Valencia.
                </p>

                <ul className="mt-8 space-y-5">
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ABBB3]/10">
                      <Mail className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-[#1A1A1A]">Email</p>
                      <a
                        href={`mailto:${FARMAFACIL_CONTACT_EMAIL}`}
                        className="mt-0.5 break-all text-sm text-gray-600 transition-colors hover:text-[#1ABBB3]"
                      >
                        {FARMAFACIL_CONTACT_EMAIL}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ABBB3]/10">
                      <Phone className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
                    </span>
                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-[#1A1A1A]">Teléfono</p>
                      <a
                        href={`tel:${FARMAFACIL_PHONE_DISPLAY.replace(/\s+/g, "")}`}
                        className="mt-0.5 text-sm text-gray-600 transition-colors hover:text-[#1ABBB3]"
                      >
                        {FARMAFACIL_PHONE_DISPLAY}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ABBB3]/10">
                      <MapPin className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
                    </span>
                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-[#1A1A1A]">Ubicación</p>
                      <p className="mt-0.5 text-sm text-gray-600">Valencia, España</p>
                    </div>
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl bg-[#0B0B0B] p-6 text-white sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ABBB3]/20">
                    <MessageCircle className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">WhatsApp Business</h3>
                    <p className="mt-1 text-sm text-[#C5CCD3]">
                      Contáctanos directamente por WhatsApp
                    </p>
                    <a
                      href={FARMAFACIL_WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#1ABBB3] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#159a94]"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                </div>
              </section>

              {formData.tipoUsuario === "farmacia" && (
                <section className="rounded-2xl border border-[#1ABBB3]/25 bg-white p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ABBB3]/10">
                      <CalendarDays className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[#1A1A1A]">
                        Agenda una cita presencial
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Si eres una farmacia interesada en FarmaFácil, puedes reservar una reunión
                        con nuestro equipo.
                      </p>
                      <a
                        href={FARMAFACIL_CALENDLY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-[#1ABBB3] bg-white px-5 text-sm font-semibold text-[#1ABBB3] transition-colors hover:bg-[#1ABBB3]/10"
                      >
                        Ver calendario
                      </a>
                    </div>
                  </div>
                </section>
              )}
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
