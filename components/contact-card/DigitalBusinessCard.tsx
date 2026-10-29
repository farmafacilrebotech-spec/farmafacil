"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import type { ResolvedContactCard } from "@/lib/contact-card";

type Props = {
  contact: ResolvedContactCard;
  /** Ruta relativa del endpoint vCard, p. ej. /api/contacto/pilar/vcard */
  vcardHref: string;
};

export default function DigitalBusinessCard({
  contact,
  vcardHref,
}: Props) {
  const hasPhone = Boolean(contact.phone);
  const [shareFeedback, setShareFeedback] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  async function shareCard() {
    const url = contact.publicUrl;
    const payload = {
      title: `${contact.fullName} · ${contact.organization}`,
      text: `${contact.title} · ${contact.organization}`,
      url,
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        setShareFeedback("idle");
        return;
      } catch (err) {
        // Usuario canceló el sheet nativo: no mostrar error.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Otros fallos → copiar enlace.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback("copied");
      window.setTimeout(() => setShareFeedback("idle"), 2200);
    } catch {
      setShareFeedback("error");
      window.setTimeout(() => setShareFeedback("idle"), 2800);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Atmósfera sutil: gradiente turquesa + plateado */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(26,187,179,0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(168,176,184,0.12), transparent 50%)",
        }}
      />

      <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 py-6 sm:max-w-lg sm:py-10 lg:max-w-xl">
        <header className="flex flex-col items-center text-center">
          <div className="mb-5 rounded-2xl border border-[#A8B0B8]/25 bg-[#0a0c10] p-2.5 shadow-[0_0_0_1px_rgba(168,176,184,0.08)] sm:mb-6 sm:p-3">
            {/*
              Logo oficial: PNG opaco con fondo ya oscuro (sin canal alpha útil).
              Sin filtros CSS para no alterar colores corporativos.
            */}
            <Image
              src={contact.logoSrc}
              alt="FarmaFácil"
              width={72}
              height={72}
              className="h-14 w-14 object-contain sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]"
              priority
            />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1ABBB3]">
            {contact.organization}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:mt-2.5 sm:text-3xl">
            {contact.fullName}
          </h1>
          <p className="mt-1.5 text-sm text-[#A8B0B8] sm:text-base">
            {contact.title}
          </p>
          <div
            className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#A8B0B8]/70 to-transparent sm:mt-5"
            aria-hidden
          />
        </header>

        <section
          className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3"
          aria-label="Acciones principales"
        >
          <ActionLink
            href={vcardHref}
            download={contact.vcfFilename}
            icon={<Download className="h-5 w-5" aria-hidden />}
            label="Guardar contacto"
            primary
          />
          <button
            type="button"
            onClick={() => void shareCard()}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#A8B0B8]/35 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:border-[#1ABBB3]/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]"
          >
            {shareFeedback === "copied" ? (
              <Check className="h-5 w-5 text-[#1ABBB3]" aria-hidden />
            ) : shareFeedback === "error" ? (
              <Copy className="h-5 w-5" aria-hidden />
            ) : (
              <Share2 className="h-5 w-5" aria-hidden />
            )}
            <span>
              {shareFeedback === "copied"
                ? "Enlace copiado"
                : shareFeedback === "error"
                  ? "No se pudo copiar el enlace"
                  : "Compartir tarjeta"}
            </span>
          </button>
        </section>

        {/* QR integrado: bloque compacto entre acciones y contacto */}
        <section
          className="mt-6 flex flex-col items-center rounded-2xl border border-[#A8B0B8]/25 bg-white/[0.03] px-4 py-5 sm:mt-7 sm:px-6 sm:py-6"
          aria-label="Código QR de la tarjeta"
        >
          <div className="rounded-xl bg-white p-3 shadow-[0_0_28px_rgba(26,187,179,0.18)] sm:rounded-2xl sm:p-4">
            <QRCodeSVG
              value={contact.publicUrl}
              size={168}
              level="H"
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#0A0C10"
              className="h-[148px] w-[148px] sm:h-[180px] sm:w-[180px] lg:h-[200px] lg:w-[200px]"
              title={`Código QR: ${contact.publicUrl}`}
            />
          </div>
          <p className="mt-3 max-w-[18rem] text-center text-[11px] leading-relaxed text-[#A8B0B8] sm:mt-3.5 sm:text-xs">
            Escanea para abrir esta tarjeta
          </p>
        </section>

        <section
          className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3"
          aria-label="Acciones de contacto"
        >
          <ActionLink
            href={`mailto:${contact.email}`}
            icon={<Mail className="h-5 w-5" aria-hidden />}
            label="Enviar email"
          />
          {hasPhone && contact.phone && (
            <>
              <ActionLink
                href={contact.phone.telHref}
                icon={<Phone className="h-5 w-5" aria-hidden />}
                label={`Llamar · ${contact.phone.display}`}
              />
              <ActionLink
                href={contact.phone.whatsappUrl}
                icon={<MessageCircle className="h-5 w-5" aria-hidden />}
                label="WhatsApp"
                external
              />
            </>
          )}
          <ActionLink
            href={contact.website}
            icon={<ExternalLink className="h-5 w-5" aria-hidden />}
            label="Visitar FarmaFácil"
            external
          />
        </section>

        <footer className="mt-auto pt-8 text-center sm:pt-10">
          <p className="text-[11px] tracking-wide text-[#A8B0B8]/70">
            FarmaFácil · Tarjeta digital
          </p>
        </footer>
      </main>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  label,
  primary = false,
  external = false,
  download,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  primary?: boolean;
  external?: boolean;
  download?: string;
}) {
  return (
    <a
      href={href}
      download={download}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={
        primary
          ? "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#1ABBB3] px-5 text-sm font-semibold text-black transition hover:bg-[#4ED3C2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ED3C2]"
          : "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#A8B0B8]/35 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:border-[#1ABBB3]/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]"
      }
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
