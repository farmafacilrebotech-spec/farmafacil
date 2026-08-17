"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEY } from "@/lib/encuesta/config";
import { trackSurveyEvent } from "@/lib/encuesta/analytics";
import { focusFirstError } from "@/lib/encuesta/focusError";
import { createEmptySurveyForm, type SurveyFormData } from "@/lib/encuesta/types";
import { findFirstInvalidStep, validateStep } from "@/lib/encuesta/validation";
import {
  StepAtencion,
  StepCaracteristicas,
  StepComercial,
  StepIdentificacion,
  StepPedidos,
  StepPrioridades,
  StepSoluciones,
  StepVenta,
} from "./SurveySteps";

const STEP_TITLES = [
  "Identificación",
  "Tu farmacia",
  "Atención y carga",
  "Pedidos",
  "Venta y digitalización",
  "Prioridades",
  "Soluciones y consentimiento",
  "Interés comercial",
] as const;

type Phase = "intro" | "form" | "success";

export default function SurveyWizard({
  enabled = true,
  bonosDisponibles = true,
}: {
  enabled?: boolean;
  bonosDisponibles?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SurveyFormData>(() => createEmptySurveyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStepAlert, setShowStepAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{
    id: string;
    comunidad: boolean;
    informe: boolean;
  } | null>(null);
  const startedTracked = useRef(false);
  const submittedRef = useRef(false);
  /** ID estable de esta participación (mismo en reintentos) */
  const submissionIdRef = useRef<string | null>(null);
  const pendingFocusRef = useRef<Record<string, string> | null>(null);
  const surveyTopRef = useRef<HTMLDivElement>(null);
  /** Evita scroll al top en la primera entrada al formulario */
  const stepScrollMountedRef = useRef(false);
  /** Si true, el cambio de paso es por errores → no scroll al top */
  const skipStepTopScrollRef = useRef(false);

  const scrollToSurveyTop = () => {
    requestAnimationFrame(() => {
      const element = surveyTopRef.current;
      if (!element) return;

      const headerOffset = 100;
      const elementTop =
        element.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(elementTop, 0),
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    trackSurveyEvent("survey_view");
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SurveyFormData;
        setData({ ...createEmptySurveyForm(), ...parsed, website: "" });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (phase !== "form") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, website: "" }));
    } catch {
      // ignore
    }
  }, [data, phase]);

  useEffect(() => {
    const onLeave = () => {
      if (phase === "form" && !submittedRef.current) {
        trackSurveyEvent("survey_abandoned", { step });
      }
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [phase, step]);

  // Scroll al inicio del formulario tras cambiar de paso (Continuar / Anterior)
  useEffect(() => {
    if (phase !== "form") {
      stepScrollMountedRef.current = false;
      return;
    }

    if (!stepScrollMountedRef.current) {
      stepScrollMountedRef.current = true;
      return;
    }

    if (skipStepTopScrollRef.current) {
      skipStepTopScrollRef.current = false;
      return;
    }

    scrollToSurveyTop();
  }, [step, phase]);

  // Tras cambiar de paso por error en envío, enfocar el primer campo
  useEffect(() => {
    if (!pendingFocusRef.current) return;
    const errs = pendingFocusRef.current;
    pendingFocusRef.current = null;
    const t = window.setTimeout(() => focusFirstError(errs), 80);
    return () => window.clearTimeout(t);
  }, [step, errors]);

  const applyStepErrors = (nextErrors: Record<string, string>) => {
    setErrors(nextErrors);
    setShowStepAlert(true);
    pendingFocusRef.current = nextErrors;
    // Si seguimos en el mismo paso, el useEffect de step puede no disparar: forzar foco
    requestAnimationFrame(() => {
      focusFirstError(nextErrors);
    });
  };

  const update = <K extends keyof SurveyFormData>(key: K, value: SurveyFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      const keyStr = String(key);
      delete next[keyStr];
      for (const k of Object.keys(next)) {
        if (k.startsWith(`${keyStr}.`)) delete next[k];
      }
      if (Object.keys(next).length === 0) setShowStepAlert(false);
      return next;
    });
  };

  const start = () => {
    if (!enabled) return;
    setPhase("form");
    setData((prev) => ({ ...prev, startedAt: prev.startedAt || Date.now() }));
    if (!startedTracked.current) {
      trackSurveyEvent("survey_start");
      startedTracked.current = true;
    }
  };

  const goNext = () => {
    const result = validateStep(step, data);
    if (!result.ok) {
      applyStepErrors(result.errors);
      return;
    }
    setErrors({});
    setShowStepAlert(false);
    trackSurveyEvent("survey_step_completed", { step: step + 1 });
    // El scroll al top del formulario lo hace el useEffect de `step`
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  };

  const goPrev = () => {
    setErrors({});
    setShowStepAlert(false);
    // El scroll al top del formulario lo hace el useEffect de `step`
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    const invalid = findFirstInvalidStep(data);
    if (invalid) {
      setShowStepAlert(true);
      setErrors(invalid.errors);
      pendingFocusRef.current = invalid.errors;
      if (invalid.stepIndex !== step) {
        // No desplazar al top: ir al primer error del paso destino
        skipStepTopScrollRef.current = true;
        setStep(invalid.stepIndex);
      } else {
        requestAnimationFrame(() => focusFirstError(invalid.errors));
      }
      return;
    }

    if (submitting || submittedRef.current) return;

    // Generar ID una sola vez; reutilizar en reintentos
    if (!submissionIdRef.current) {
      submissionIdRef.current =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `enc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
    const submissionId = submissionIdRef.current;

    setSubmitting(true);
    setSubmitError("");
    setShowStepAlert(false);
    try {
      const res = await fetch("/api/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submissionId }),
      });
      const json = await res.json();

      // Mantener el ID que confirme el servidor (reintentos)
      if (typeof json.submissionId === "string" && json.submissionId) {
        submissionIdRef.current = json.submissionId;
      } else if (typeof json.id === "string" && json.id) {
        submissionIdRef.current = json.id;
      }

      const sheetsSaved = json.sheetsSaved === true || json.success === true;

      if (!res.ok || !sheetsSaved) {
        trackSurveyEvent("survey_error");
        setSubmitError(json.error || "No se pudo enviar. Inténtalo de nuevo.");
        if (json.errors && typeof json.errors === "object") {
          const serverErrors = json.errors as Record<string, string>;
          const again = findFirstInvalidStep(data);
          if (again) {
            setErrors({ ...again.errors, ...serverErrors });
            setShowStepAlert(true);
            pendingFocusRef.current = { ...again.errors, ...serverErrors };
            if (again.stepIndex !== step) {
              skipStepTopScrollRef.current = true;
            }
            setStep(again.stepIndex);
          } else {
            applyStepErrors(serverErrors);
          }
        }
        return;
      }

      // Sheets OK → agradecimiento aunque fallen los emails
      submittedRef.current = true;
      sessionStorage.removeItem(STORAGE_KEY);
      trackSurveyEvent("survey_submitted");
      if (data.consentimiento_comunidad) trackSurveyEvent("community_consent");
      if (data.interes_piloto === "Sí" || data.interes_piloto.startsWith("Quizá")) {
        trackSurveyEvent("pilot_interest");
      }

      const confirmedId =
        (typeof json.responseId === "string" && json.responseId) ||
        (typeof json.submissionId === "string" && json.submissionId) ||
        (typeof json.id === "string" && json.id) ||
        submissionId;
      submissionIdRef.current = confirmedId;

      setResult({
        id: confirmedId,
        comunidad: Boolean(json.consentimientos?.comunidad),
        informe: Boolean(json.consentimientos?.informe),
      });
      setPhase("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      trackSurveyEvent("survey_error");
      setSubmitError("Error de red. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!enabled) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Encuesta temporalmente cerrada</h2>
        <p className="mt-3 text-gray-600">
          Gracias por tu interés. Vuelve a intentarlo más adelante o contacta con FarmaFácil.
        </p>
      </div>
    );
  }

  if (phase === "success" && result) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
        ¡Muchas gracias por tu participación!
        </h2>
        <p className="mt-4 text-gray-600">
          Hemos recibido tu participación. 
          En los próximos días revisaremos la información para confirmar que cumple las condiciones del estudio.
        </p>
        {bonosDisponibles ? (
          <p className="mt-4 rounded-xl bg-[#1ABBB3]/10 p-4 text-sm text-[#1A1A1A]">
            Una vez validada, recibirás automáticamente tu bono regalo de 
            Amazon de 10 € en el email que nos has indicado.
          </p>
        ) : (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Tu participación ha quedado registrada. En este momento los bonos regalo pueden estar
            agotados o pausados; te informaremos si procede.
          </p>
        )}
        {result.comunidad && (
          <p className="mt-3 text-sm text-gray-600">
            También te enviaremos información para acceder a la comunidad de farmacias impulsada
            por FarmaFácil.
          </p>
        )}
        {result.informe && (
          <p className="mt-3 text-sm text-gray-600">
            Te avisaremos cuando publiquemos los resultados del estudio.
          </p>
        )}
        <p className="mt-6 text-xs text-gray-400">Referencia: {result.id}</p>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-[1.75rem]">
          Estudio sobre los retos de las farmacias españolas
        </h1>
        <p className="mt-3 text-lg font-semibold text-[#1ABBB3]">
          ¿Nos ayudas en solo unos minutos?
        </p>
        <p className="mt-3 text-gray-600">
          Queremos conocer los principales retos de las farmacias para desarrollar
          mejores soluciones para el sector.
        </p>

        <div className="mt-5 rounded-2xl border border-[#1ABBB3]/30 bg-gradient-to-br from-[#1ABBB3]/10 to-[#4ED3C2]/10 px-4 py-3.5">
          <p className="text-sm font-semibold text-[#1A1A1A] sm:text-base">
            Como agradecimiento, recibirás un bono Amazon de 10 € tras validar tu participación.
          </p>
        </div>

        <ul className="mt-5 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
          <li className="rounded-xl bg-[#F7F9FA] px-3 py-2.5">
            Exclusivo para titulares y cotitulares.
          </li>
          <li className="rounded-xl bg-[#F7F9FA] px-3 py-2.5">
            Duración aproximada: 5 minutos.
          </li>
          <li className="rounded-xl bg-[#F7F9FA] px-3 py-2.5">Una participación por farmacia.</li>
        </ul>

        {!bonosDisponibles && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Los bonos regalo pueden estar temporalmente agotados. Aun así puedes participar en el
            estudio y recibir un bono regalo de 10 € si vuelven a estar disponibles. si tu participación es válida.
          </p>
        )}

        <Button
          type="button"
          onClick={start}
          className="mt-6 h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white hover:bg-[#159a94] sm:w-auto sm:px-10"
        >
          Empezar encuesta
        </Button>

        <p className="mt-4 text-center text-xs leading-relaxed text-gray-500 sm:text-left">
          El bono se enviará tras verificar los datos.{" "}
          <Link
            href="/encuesta-farmacias/condiciones"
            className="text-[#1ABBB3] underline underline-offset-2 hover:text-[#159a94]"
          >
            Consulta las condiciones de participación
          </Link>
          .{" "}
          <Link
            href="/privacidad"
            className="text-[#1ABBB3] underline underline-offset-2 hover:text-[#159a94]"
          >
            Política de privacidad
          </Link>
          .
        </p>
      </div>
    );
  }

  const progress = ((step + 1) / STEP_TITLES.length) * 100;

  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
      <div ref={surveyTopRef} className="mb-6 scroll-mt-24">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>
            Paso {step + 1} de {STEP_TITLES.length}
          </span>
          <span>{STEP_TITLES[step]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#1ABBB3] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {step === 0 && <StepIdentificacion data={data} errors={errors} update={update} />}
      {step === 1 && <StepCaracteristicas data={data} errors={errors} update={update} />}
      {step === 2 && <StepAtencion data={data} errors={errors} update={update} />}
      {step === 3 && <StepPedidos data={data} errors={errors} update={update} />}
      {step === 4 && <StepVenta data={data} errors={errors} update={update} />}
      {step === 5 && <StepPrioridades data={data} errors={errors} update={update} />}
      {step === 6 && <StepSoluciones data={data} errors={errors} update={update} />}
      {step === 7 && <StepComercial data={data} errors={errors} update={update} />}

      {showStepAlert && Object.keys(errors).length > 0 && (
        <p
          className="mt-6 rounded-xl border border-[#e07a3d]/40 bg-[#fff8f3] px-4 py-3 text-sm font-medium text-[#9a3412]"
          role="alert"
          aria-live="polite"
        >
          Revisa los campos marcados antes de continuar.
        </p>
      )}

      {submitError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0 || submitting}
          onClick={goPrev}
          className="h-11 rounded-full border-gray-200"
        >
          Anterior
        </Button>
        {step < STEP_TITLES.length - 1 ? (
          <Button
            type="button"
            onClick={goNext}
            className="h-11 rounded-full bg-[#1ABBB3] px-8 text-white hover:bg-[#159a94]"
          >
            Continuar
          </Button>
        ) : (
          <Button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="h-11 rounded-full bg-[#1ABBB3] px-8 text-white hover:bg-[#159a94]"
          >
            {submitting ? "Enviando…" : "Enviar participación"}
          </Button>
        )}
      </div>
    </div>
  );
}
