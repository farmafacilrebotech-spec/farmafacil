"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { BonoTokenStatus } from "@/lib/bonos/types";

type FormState = {
  nombre: string;
  farmacia: string;
  direccion: string;
  codigoPostal: string;
  municipio: string;
  email: string;
  whatsapp: string;
  confirmaDatos: boolean;
  consentimientoComercial: boolean;
};

type UiStatus = BonoTokenStatus | "loading" | "error";

const emptyForm: FormState = {
  nombre: "",
  farmacia: "",
  direccion: "",
  codigoPostal: "",
  municipio: "",
  email: "",
  whatsapp: "",
  confirmaDatos: false,
  consentimientoComercial: false,
};

function StatusMessage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function SolicitarBonoClient() {
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const [status, setStatus] = useState<UiStatus>("loading");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (!token) {
        if (!cancelled) setStatus("invalid");
        return;
      }

      try {
        const res = await fetch(
          `/api/bonos/token?token=${encodeURIComponent(token)}`
        );
        const json = (await res.json()) as {
          success?: boolean;
          status?: BonoTokenStatus;
        };

        if (cancelled) return;

        // Solo confiar en el status real del backend
        if (
          json.status === "available" ||
          json.status === "already_claimed" ||
          json.status === "expired" ||
          json.status === "invalid"
        ) {
          setStatus(json.status);
          return;
        }

        setStatus("invalid");
      } catch {
        if (!cancelled) setStatus("invalid");
      }
    }

    void loadStatus();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateClient = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (form.nombre.trim().length < 2) {
      next.nombre = "Indica tu nombre y apellidos.";
    }
    if (form.farmacia.trim().length < 2) {
      next.farmacia = "Indica el nombre de la farmacia.";
    }
    if (form.direccion.trim().length < 3) {
      next.direccion = "Indica la dirección de la farmacia.";
    }
    if (!/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(form.codigoPostal.replace(/\D/g, ""))) {
      next.codigoPostal = "Indica un código postal español válido.";
    }
    if (form.municipio.trim().length < 2) {
      next.municipio = "Indica el municipio.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Indica un email válido.";
    }
    if (form.whatsapp.replace(/\D/g, "").length < 9) {
      next.whatsapp = "Indica un número de WhatsApp válido.";
    }
    if (!form.confirmaDatos) {
      next.confirmaDatos =
        "Debes confirmar que los datos corresponden a la farmacia participante.";
    }
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bonos/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          nombre: form.nombre.trim(),
          farmacia: form.farmacia.trim(),
          direccion: form.direccion.trim(),
          codigoPostal: form.codigoPostal.replace(/\D/g, "").slice(0, 5),
          municipio: form.municipio.trim(),
          email: form.email.trim().toLowerCase(),
          whatsapp: form.whatsapp.trim(),
          confirmacionFarmacia: form.confirmaDatos,
          consentimientoComercial: form.consentimientoComercial,
        }),
      });

      const json = (await res.json()) as {
        success?: boolean;
        status?: BonoTokenStatus;
        error?: string;
        errors?: Record<string, string>;
      };

      // Éxito real: Apps Script escribió la solicitud
      if (res.ok && json.success === true && json.status === "claimed") {
        setStatus("claimed");
        return;
      }

      // Ya registrada (confirmado por Apps Script)
      if (json.status === "already_claimed") {
        setStatus("already_claimed");
        return;
      }

      if (json.status === "expired") {
        setStatus("expired");
        return;
      }

      if (json.status === "invalid") {
        setStatus("invalid");
        return;
      }

      if (json.errors) {
        setErrors(json.errors);
        return;
      }

      // No convertir errores en éxito: mantener el formulario y los datos
      setSubmitError(
        "No hemos podido registrar la solicitud. Inténtalo de nuevo en unos minutos."
      );
    } catch {
      setSubmitError(
        "No hemos podido registrar la solicitud. Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-sm text-gray-600">Comprobando tu enlace…</p>
      </div>
    );
  }

  if (status === "claimed") {
    return (
      <StatusMessage
        title="Tu solicitud ha sido registrada"
        description="Recibirás el bono en el email indicado."
      />
    );
  }

  if (status === "already_claimed") {
    return (
      <StatusMessage
        title="Tu solicitud ya ha sido registrada"
        description="Recibirás el bono en el email indicado."
      />
    );
  }

  if (status === "expired") {
    return (
      <StatusMessage title="El plazo para solicitar este bono ha finalizado." />
    );
  }

  if (status === "invalid") {
    return <StatusMessage title="No hemos podido validar este enlace." />;
  }

  // status === "available" → formulario
  const fieldClass = (key: string) =>
    `h-11 w-full rounded-xl border bg-white px-3 text-sm text-[#1A1A1A] outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1 ${
      errors[key]
        ? "border-[#e07a3d] bg-[#fff8f3] focus-visible:border-[#c2410c] focus-visible:ring-[#e07a3d]/40"
        : "border-gray-200 focus-visible:border-[#1ABBB3] focus-visible:ring-[#1ABBB3]"
    }`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
        Tu participación ha sido validada
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
        Gracias por ayudarnos a conocer mejor la realidad de las farmacias. Confirma tus
        datos para que podamos enviarte correctamente tu bono Amazon de 10 €.
      </p>

      <div className="mt-5 rounded-xl bg-[#1ABBB3]/10 px-4 py-3 text-sm text-[#1A1A1A]">
        El bono se enviará al email que indiques en este formulario tras la confirmación
        de tus datos.
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Nombre y apellidos <span className="text-[#1ABBB3]">*</span>
          </label>
          <input
            id="nombre"
            className={fieldClass("nombre")}
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
            autoComplete="name"
            disabled={submitting}
          />
          {errors.nombre ? (
            <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
              {errors.nombre}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="farmacia" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Nombre de la farmacia <span className="text-[#1ABBB3]">*</span>
          </label>
          <input
            id="farmacia"
            className={fieldClass("farmacia")}
            value={form.farmacia}
            onChange={(e) => update("farmacia", e.target.value)}
            autoComplete="organization"
            disabled={submitting}
          />
          {errors.farmacia ? (
            <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
              {errors.farmacia}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="direccion" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Dirección de la farmacia <span className="text-[#1ABBB3]">*</span>
          </label>
          <input
            id="direccion"
            className={fieldClass("direccion")}
            value={form.direccion}
            onChange={(e) => update("direccion", e.target.value)}
            autoComplete="street-address"
            disabled={submitting}
          />
          {errors.direccion ? (
            <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
              {errors.direccion}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="codigoPostal"
              className="mb-1.5 block text-sm font-medium text-[#1A1A1A]"
            >
              Código postal <span className="text-[#1ABBB3]">*</span>
            </label>
            <input
              id="codigoPostal"
              className={fieldClass("codigoPostal")}
              value={form.codigoPostal}
              onChange={(e) =>
                update("codigoPostal", e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              inputMode="numeric"
              autoComplete="postal-code"
              disabled={submitting}
            />
            {errors.codigoPostal ? (
              <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
                {errors.codigoPostal}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="municipio"
              className="mb-1.5 block text-sm font-medium text-[#1A1A1A]"
            >
              Municipio <span className="text-[#1ABBB3]">*</span>
            </label>
            <input
              id="municipio"
              className={fieldClass("municipio")}
              value={form.municipio}
              onChange={(e) => update("municipio", e.target.value)}
              autoComplete="address-level2"
              disabled={submitting}
            />
            {errors.municipio ? (
              <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
                {errors.municipio}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Email para recibir el bono <span className="text-[#1ABBB3]">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={fieldClass("email")}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
            disabled={submitting}
          />
          {errors.email ? (
            <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            WhatsApp <span className="text-[#1ABBB3]">*</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            className={fieldClass("whatsapp")}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            autoComplete="tel"
            placeholder="+34 600 000 000"
            disabled={submitting}
          />
          {errors.whatsapp ? (
            <p className="mt-1.5 text-sm font-medium text-[#c2410c]" role="alert">
              {errors.whatsapp}
            </p>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-5">
          <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 text-sm text-[#1A1A1A]">
            <input
              type="checkbox"
              className="mt-0.5 accent-[#1ABBB3]"
              checked={form.confirmaDatos}
              onChange={(e) => update("confirmaDatos", e.target.checked)}
              disabled={submitting}
            />
            <span>
              Confirmo que los datos indicados corresponden a la farmacia participante.{" "}
              <span className="text-[#1ABBB3]">*</span>
            </span>
          </label>
          {errors.confirmaDatos ? (
            <p className="text-sm font-medium text-[#c2410c]" role="alert">
              {errors.confirmaDatos}
            </p>
          ) : null}

          <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 text-sm text-[#1A1A1A]">
            <input
              type="checkbox"
              className="mt-0.5 accent-[#1ABBB3]"
              checked={form.consentimientoComercial}
              onChange={(e) => update("consentimientoComercial", e.target.checked)}
              disabled={submitting}
            />
            <span>Quiero recibir novedades y comunicaciones de FarmaFácil.</span>
          </label>
        </div>

        {submitError ? (
          <p
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white hover:bg-[#159e97]"
        >
          {submitting ? "Enviando…" : "Solicitar mi bono"}
        </Button>
      </form>
    </div>
  );
}
