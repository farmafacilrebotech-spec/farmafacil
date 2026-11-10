"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  COMMERCIAL_INTERESTS,
  COMMERCIAL_MESSAGE_MAX,
  EMPTY_COMMERCIAL_PRESET,
  presetFromQuery,
  sanitizedCommercialSearch,
  type CampaignAttribution,
  type CommercialInterestId,
  type CommercialPreset,
} from "@/lib/contacto/comercial";
import { buildCommercialLeadPayload } from "@/lib/contacto/payload";
import { cn } from "@/lib/utils";

const fieldClassName =
  "h-12 rounded-xl border-[#C5CCD3]/80 bg-white px-4 text-base text-[#1A1A1A] shadow-none placeholder:text-gray-500 hover:border-[#1ABBB3]/50 focus-visible:bg-white focus-visible:ring-[#1ABBB3]/30 focus-visible:ring-offset-0";

const labelClassName = "mb-2 block text-sm font-medium text-[#1A1A1A]";

function submitLabel(interes: CommercialInterestId | ""): string {
  switch (interes) {
    case "piloto":
      return "Solicitar una prueba";
    case "implantar":
      return "Solicitar implantación";
    case "demo":
      return "Solicitar una demostración";
    case "planes":
      return "Recibir información";
    case "otra":
      return "Enviar consulta";
    default:
      return "Enviar solicitud";
  }
}

type CommercialLeadFormProps = {
  source: "landing" | "solicitar";
  preset?: CommercialPreset;
  className?: string;
};

export default function CommercialLeadForm({
  source,
  preset,
  className,
}: CommercialLeadFormProps) {
  const { toast } = useToast();
  const initial = preset ?? EMPTY_COMMERCIAL_PRESET;
  const baseline = useRef<CommercialPreset>(initial);
  const [loading, setLoading] = useState(false);
  const [interes, setInteres] = useState<CommercialInterestId | "">(initial.interes);
  const [campana, setCampana] = useState<CampaignAttribution>({ ...initial.campana });
  const [form, setForm] = useState({
    nombre: "",
    farmacia: "",
    email: "",
    telefono: "",
    mensaje: "",
    aceptarInformacion: false,
    consentimientoPromocional: false,
  });

  const presetKey = preset
    ? [
        preset.interes,
        preset.plan,
        preset.campana.origen,
        preset.campana.medio,
        preset.campana.campana,
        preset.campana.pieza,
      ].join("|")
    : "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed = presetFromQuery(params);
    baseline.current = parsed;
    setInteres(parsed.interes);
    setCampana({ ...parsed.campana });
    if (source !== "solicitar") return;
    const clean = sanitizedCommercialSearch(params);
    const next = `/solicitar${clean ? `?${clean}` : ""}`;
    const here = `${window.location.pathname}${window.location.search}`;
    if (here !== next) window.history.replaceState(null, "", next);
  }, [source, presetKey]);

  function resetForm() {
    const base = baseline.current;
    setInteres(base.interes);
    setCampana({ ...base.campana });
    setForm({
      nombre: "",
      farmacia: "",
      email: "",
      telefono: "",
      mensaje: "",
      aceptarInformacion: false,
      consentimientoPromocional: false,
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!interes) {
      toast({
        title: "Elige un interés",
        description: "Indica qué quieres hacer con FarmaFácil.",
        variant: "destructive",
      });
      return;
    }
    if (!form.aceptarInformacion) {
      toast({
        title: "Falta la información de privacidad",
        description: "Márcala para que podamos atender tu solicitud. No autoriza promociones.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...buildCommercialLeadPayload({
          nombre: form.nombre,
          farmacia: form.farmacia,
          email: form.email,
          telefono: form.telefono,
          interes,
          mensaje: form.mensaje,
          consentimientoPromocional: form.consentimientoPromocional,
          aceptaInformacion: true,
          campana,
          source,
        }),
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al enviar");
      }

      toast({
        title: "Solicitud enviada",
        description: "Hemos recibido tus datos. Te respondemos lo antes posible.",
      });
      resetForm();
    } catch (error: unknown) {
      toast({
        title: "No se pudo enviar",
        description:
          error instanceof Error && error.message
            ? error.message
            : "Inténtalo de nuevo en unos minutos o escríbenos por contacto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="formulario-solicitud" onSubmit={handleSubmit} className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="solicitud-nombre" className={labelClassName}>
            Nombre
          </label>
          <Input
            id="solicitud-nombre"
            name="nombre"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(event) => setForm({ ...form, nombre: event.target.value })}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="solicitud-farmacia" className={labelClassName}>
            Farmacia
          </label>
          <Input
            id="solicitud-farmacia"
            name="organization"
            required
            autoComplete="organization"
            placeholder="Nombre de la oficina"
            value={form.farmacia}
            onChange={(event) => setForm({ ...form, farmacia: event.target.value })}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="solicitud-email" className={labelClassName}>
            Email
          </label>
          <Input
            id="solicitud-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@farmacia.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="solicitud-telefono" className={labelClassName}>
            Teléfono
          </label>
          <Input
            id="solicitud-telefono"
            name="tel"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+34 600 000 000"
            value={form.telefono}
            onChange={(event) => setForm({ ...form, telefono: event.target.value })}
            className={fieldClassName}
          />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className={labelClassName}>
          Interés principal <span className="font-normal text-gray-600">(elige una)</span>
        </legend>
        <div className="space-y-1.5">
          {COMMERCIAL_INTERESTS.map((item) => {
            const selected = interes === item.id;
            return (
              <label
                key={item.id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm leading-snug text-[#1A1A1A]",
                  selected
                    ? "border-[#1ABBB3] bg-[#E8F8F7]"
                    : "border-[#C5CCD3]/80 bg-white hover:border-[#1ABBB3]/45"
                )}
              >
                <input
                  id={`interes-${item.id}`}
                  type="radio"
                  name="interes"
                  value={item.id}
                  required
                  checked={selected}
                  onChange={() => setInteres(item.id)}
                  className="h-4 w-4 shrink-0 accent-[#1ABBB3]"
                />
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="solicitud-mensaje" className={labelClassName}>
          Cuéntanos qué necesitas{" "}
          <span className="font-normal text-gray-600">(opcional)</span>
        </label>
        <Textarea
          id="solicitud-mensaje"
          name="mensaje"
          rows={3}
          maxLength={COMMERCIAL_MESSAGE_MAX}
          placeholder="Cuéntanos qué te gustaría mejorar en tu farmacia o qué necesitas saber de FarmaFácil."
          value={form.mensaje}
          onChange={(event) => setForm({ ...form, mensaje: event.target.value })}
          className={`${fieldClassName} min-h-[6.5rem] py-3`}
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-xl border border-[#C5CCD3]/70 bg-white p-3">
          <div className="flex items-start gap-3">
            <input
              id="aceptar-solicitud"
              type="checkbox"
              name="aceptarInformacion"
              checked={form.aceptarInformacion}
              onChange={(event) =>
                setForm({ ...form, aceptarInformacion: event.target.checked })
              }
              className="mt-1 h-4 w-4 shrink-0 accent-[#1ABBB3]"
              required
            />
            <label htmlFor="aceptar-solicitud" className="text-sm leading-relaxed text-[#1A1A1A]">
              He leído la información sobre el tratamiento de mis datos para gestionar esta
              solicitud.{" "}
              <Link
                href="/privacidad#solicitudes-comerciales"
                className="font-medium text-[#0F766E] underline decoration-[#1ABBB3] underline-offset-2 hover:text-[#159a94]"
              >
                Política de privacidad
              </Link>
              .
            </label>
          </div>
          <p className="mt-2 pl-7 text-xs leading-relaxed text-gray-600">
            Sirve para responderte y valorar el siguiente paso. No autoriza comunicaciones
            promocionales.
          </p>
        </div>

        <div className="rounded-xl border border-[#C5CCD3]/70 bg-white p-3">
          <div className="flex items-start gap-3">
            <input
              id="consentimiento-promocional"
              type="checkbox"
              name="consentimientoPromocional"
              checked={form.consentimientoPromocional}
              onChange={(event) =>
                setForm({ ...form, consentimientoPromocional: event.target.checked })
              }
              className="mt-1 h-4 w-4 shrink-0 accent-[#1ABBB3]"
            />
            <label
              htmlFor="consentimiento-promocional"
              className="text-sm leading-relaxed text-[#1A1A1A]"
            >
              Quiero recibir comunicaciones promocionales de FarmaFácil sobre planes, novedades y
              promociones. Puedo retirar este consentimiento cuando quiera escribiendo a{" "}
              <a
                href="mailto:privacidad@farmafacil.solutions"
                className="font-medium text-[#0F766E] underline decoration-[#1ABBB3] underline-offset-2 hover:text-[#159a94]"
              >
                privacidad@farmafacil.solutions
              </a>
              .
            </label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white hover:bg-[#159a94] disabled:opacity-70"
      >
        {loading ? "Enviando…" : submitLabel(interes)}
      </Button>
      <p className="mt-3 text-sm font-medium text-[#0F766E]">
        Te responderemos lo antes posible.
      </p>
    </form>
  );
}
