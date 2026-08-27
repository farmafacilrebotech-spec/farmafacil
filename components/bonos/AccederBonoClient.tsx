"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { BonoEntregaStatus } from "@/lib/bonos/types";

type UiStatus =
  | "loading"
  | BonoEntregaStatus
  | "revealed"
  | "technical_error";

type DeliveryMeta = {
  nombre?: string;
  farmacia?: string;
  importe?: string;
  fechaLimite?: string;
};

function StatusMessage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
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
      {children}
    </div>
  );
}

function CodeRevealView({
  title,
  codigoAmazon,
  importeLabel,
}: {
  title: string;
  codigoAmazon: string;
  importeLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(codigoAmazon);
      setCopied(true);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
        {title}
      </h1>

      <div className="mt-8 rounded-xl bg-[#1ABBB3]/10 px-4 py-6">
        <p className="text-sm font-medium uppercase tracking-wide text-[#159e97]">
          Bono Amazon
        </p>
        <p className="mt-2 text-3xl font-bold text-[#1A1A1A]">{importeLabel}</p>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Código Amazon
        </p>
        <div className="mt-2 rounded-xl border-2 border-[#1ABBB3] bg-[#F7F9FA] px-4 py-4">
          <p className="break-all font-mono text-lg font-semibold tracking-wide text-[#1A1A1A] sm:text-xl">
            {codigoAmazon}
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => void onCopy()}
        className="mt-6 h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white hover:bg-[#159e97]"
      >
        {copied ? "Código copiado" : "Copiar código"}
      </Button>

      <p className="mt-6 text-sm leading-relaxed text-gray-600">
        Guarda este código. Una vez mostrado, el bono queda entregado y ya no puede
        volver a reservarse para otra participación.
      </p>
    </div>
  );
}

function formatImporte(importe?: string): string {
  if (!importe) return "10 €";
  const trimmed = importe.trim();
  if (/€/.test(trimmed)) return trimmed;
  if (/^\d+([.,]\d+)?$/.test(trimmed)) return `${trimmed.replace(".", ",")} €`;
  return trimmed;
}

export default function AccederBonoClient() {
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const [status, setStatus] = useState<UiStatus>("loading");
  const [meta, setMeta] = useState<DeliveryMeta>({});
  const [codigoAmazon, setCodigoAmazon] = useState<string | null>(null);
  const [revealError, setRevealError] = useState("");
  const [revealing, setRevealing] = useState(false);
  const revealInFlight = useRef(false);

  const applyStatusPayload = (
    json: {
      status?: BonoEntregaStatus;
      technical?: boolean;
      nombre?: string;
      farmacia?: string;
      importe?: string;
      fechaLimite?: string;
      codigoAmazon?: string;
    },
    resOk: boolean
  ) => {
    if (json.technical || (!resOk && !json.status)) {
      setStatus("technical_error");
      return;
    }

    if (
      json.status === "available" ||
      json.status === "already_revealed" ||
      json.status === "expired" ||
      json.status === "invalid"
    ) {
      setMeta({
        ...(json.nombre ? { nombre: json.nombre } : {}),
        ...(json.farmacia ? { farmacia: json.farmacia } : {}),
        ...(json.importe ? { importe: json.importe } : {}),
        ...(json.fechaLimite ? { fechaLimite: json.fechaLimite } : {}),
      });

      if (
        json.status === "already_revealed" &&
        typeof json.codigoAmazon === "string" &&
        json.codigoAmazon.trim()
      ) {
        setCodigoAmazon(json.codigoAmazon.trim());
      } else {
        setCodigoAmazon(null);
      }

      setStatus(json.status);
      return;
    }

    setStatus("technical_error");
  };

  const loadStatus = async () => {
    setStatus("loading");
    setRevealError("");
    setCodigoAmazon(null);

    if (!token) {
      setStatus("invalid");
      return;
    }

    try {
      const res = await fetch(
        `/api/bonos/entrega/token?token=${encodeURIComponent(token)}`,
        { cache: "no-store" }
      );
      const json = (await res.json()) as {
        success?: boolean;
        status?: BonoEntregaStatus;
        technical?: boolean;
        nombre?: string;
        farmacia?: string;
        importe?: string;
        fechaLimite?: string;
        codigoAmazon?: string;
      };
      applyStatusPayload(json, res.ok);
    } catch {
      setStatus("technical_error");
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        if (!cancelled) setStatus("invalid");
        return;
      }

      try {
        const res = await fetch(
          `/api/bonos/entrega/token?token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );
        const json = (await res.json()) as {
          success?: boolean;
          status?: BonoEntregaStatus;
          technical?: boolean;
          nombre?: string;
          farmacia?: string;
          importe?: string;
          fechaLimite?: string;
          codigoAmazon?: string;
        };

        if (cancelled) return;
        applyStatusPayload(json, res.ok);
      } catch {
        if (!cancelled) setStatus("technical_error");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onReveal = async () => {
    if (revealInFlight.current || revealing) return;
    revealInFlight.current = true;
    setRevealing(true);
    setRevealError("");

    try {
      const res = await fetch("/api/bonos/entrega/revelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });

      const json = (await res.json()) as {
        success?: boolean;
        status?: string;
        codigoAmazon?: string;
        technical?: boolean;
        hasCodigo?: boolean;
        nombre?: string;
        farmacia?: string;
        importe?: string;
        fechaLimite?: string;
      };

      if (
        res.ok &&
        json.success === true &&
        typeof json.codigoAmazon === "string" &&
        json.codigoAmazon.trim()
      ) {
        setCodigoAmazon(json.codigoAmazon.trim());
        setMeta((prev) => ({
          ...prev,
          ...(json.nombre ? { nombre: json.nombre } : {}),
          ...(json.farmacia ? { farmacia: json.farmacia } : {}),
          ...(json.importe ? { importe: json.importe } : {}),
          ...(json.fechaLimite ? { fechaLimite: json.fechaLimite } : {}),
        }));
        setStatus("revealed");
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

      if (json.status === "already_revealed" && json.hasCodigo === false) {
        setCodigoAmazon(null);
        setStatus("already_revealed");
        return;
      }

      if (
        json.status === "already_revealed" &&
        typeof json.codigoAmazon === "string" &&
        json.codigoAmazon.trim()
      ) {
        setCodigoAmazon(json.codigoAmazon.trim());
        setStatus("already_revealed");
        return;
      }

      setRevealError(
        "No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos."
      );
    } catch {
      setRevealError(
        "No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos."
      );
    } finally {
      revealInFlight.current = false;
      setRevealing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-sm text-gray-600">Comprobando tu enlace…</p>
      </div>
    );
  }

  if (status === "technical_error") {
    return (
      <StatusMessage title="No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos.">
        <Button
          type="button"
          onClick={() => void loadStatus()}
          className="mt-8 h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white hover:bg-[#159e97]"
        >
          Volver a intentarlo
        </Button>
      </StatusMessage>
    );
  }

  if (status === "invalid") {
    return (
      <StatusMessage
        title="No hemos podido validar este enlace"
        description="El enlace no es válido o ya no está disponible."
      />
    );
  }

  if (status === "expired") {
    return (
      <StatusMessage
        title="El plazo para acceder a este bono ha finalizado"
        description="El periodo disponible para acceder al bono asociado a esta participación ha finalizado."
      />
    );
  }

  if (status === "revealed" && codigoAmazon) {
    return (
      <CodeRevealView
        title="¡Aquí tienes tu bono!"
        codigoAmazon={codigoAmazon}
        importeLabel={formatImporte(meta.importe)}
      />
    );
  }

  if (status === "already_revealed" && codigoAmazon) {
    return (
      <CodeRevealView
        title="Tu bono ya fue entregado"
        codigoAmazon={codigoAmazon}
        importeLabel={formatImporte(meta.importe)}
      />
    );
  }

  if (status === "already_revealed") {
    return (
      <StatusMessage
        title="Este bono ya fue entregado anteriormente."
        description="Si necesitas ayuda, contacta con FarmaFácil."
      >
        <Link
          href="/contacto"
          className="mt-6 inline-block text-sm font-semibold text-[#1ABBB3] hover:underline"
        >
          Ir a contacto
        </Link>
      </StatusMessage>
    );
  }

  const hasMeta =
    Boolean(meta.nombre) ||
    Boolean(meta.farmacia) ||
    Boolean(meta.importe) ||
    Boolean(meta.fechaLimite);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
        Tu bono ya está disponible
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
        Gracias de nuevo por participar en FarmaFácil. Tu bono Amazon de 10 € está
        preparado.
      </p>

      {hasMeta ? (
        <dl className="mt-6 space-y-2 rounded-xl bg-[#F7F9FA] px-4 py-4 text-sm text-[#1A1A1A]">
          {meta.nombre ? (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="font-medium text-gray-500">Nombre</dt>
              <dd>{meta.nombre}</dd>
            </div>
          ) : null}
          {meta.farmacia ? (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="font-medium text-gray-500">Farmacia</dt>
              <dd>{meta.farmacia}</dd>
            </div>
          ) : null}
          {meta.importe ? (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="font-medium text-gray-500">Importe</dt>
              <dd>{formatImporte(meta.importe)}</dd>
            </div>
          ) : null}
          {meta.fechaLimite ? (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="font-medium text-gray-500">Fecha límite de acceso</dt>
              <dd>{meta.fechaLimite}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <div className="mt-5 rounded-xl bg-[#1ABBB3]/10 px-4 py-3 text-sm text-[#1A1A1A]">
        El código se mostrará únicamente cuando pulses el botón. Una vez mostrado,
        quedará asociado definitivamente a tu participación.
      </div>

      {revealError ? (
        <p
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {revealError}
        </p>
      ) : null}

      <Button
        type="button"
        disabled={revealing}
        onClick={() => void onReveal()}
        className="mt-8 h-12 w-full rounded-full bg-[#1ABBB3] text-base font-semibold text-white hover:bg-[#159e97]"
      >
        {revealing ? "Obteniendo código…" : "Mostrar mi código"}
      </Button>
    </div>
  );
}
