"use client";

import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Download, IdCard } from "lucide-react";
import type { ResolvedContactCard } from "@/lib/contact-card";
import { cn } from "@/lib/utils";

type Props = {
  contact: ResolvedContactCard | null;
  className?: string;
};

/**
 * Bloque de contacto directo en /contacto.
 * Reutiliza el perfil resuelto (teléfono vía env en servidor); no duplica datos.
 */
export default function ContactDirectSection({ contact, className }: Props) {
  if (!contact) return null;

  const vcardHref = `/api/contacto/${contact.id}/vcard`;

  return (
    <section
      aria-labelledby="contacto-directo-title"
      className={cn(
        "overflow-hidden rounded-2xl border border-[#A8B0B8]/25 bg-[#0A0C10] text-white shadow-[0_0_40px_rgba(26,187,179,0.12)]",
        className
      )}
    >
      <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
        {/* Columna izquierda */}
        <div className="order-1 flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1ABBB3]">
            {contact.organization}
          </p>
          <h2
            id="contacto-directo-title"
            className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Contacto directo con FarmaFácil
          </h2>
          <p className="mt-4 text-xl font-semibold text-white">
            {contact.fullName}
          </p>
          <p className="mt-1 text-sm text-[#A8B0B8] sm:text-base">
            {contact.title}
          </p>
          {contact.phone ? (
            <p className="mt-3 text-sm text-[#4ED3C2]">
              <a
                href={contact.phone.telHref}
                className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]"
              >
                {contact.phone.display}
              </a>
            </p>
          ) : null}
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#A8B0B8]">
            Habla directamente con la fundadora de FarmaFácil. Escanea el código
            QR o guarda el contacto en tu agenda.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={contact.publicUrl}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1ABBB3] px-6 text-sm font-semibold text-black transition hover:bg-[#4ED3C2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ED3C2]"
            >
              <IdCard className="h-5 w-5" aria-hidden />
              Ver tarjeta digital
            </Link>
            <a
              href={vcardHref}
              download={contact.vcfFilename}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#A8B0B8]/40 bg-white/[0.04] px-6 text-sm font-medium text-white transition hover:border-[#1ABBB3]/60 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ABBB3]"
            >
              <Download className="h-5 w-5" aria-hidden />
              Guardar contacto
            </a>
          </div>
        </div>

        {/* Columna derecha: QR + logo */}
        <div className="order-2 flex flex-col items-center justify-center text-center lg:items-end">
          <div className="flex w-full max-w-[220px] flex-col items-center rounded-2xl border border-[#A8B0B8]/25 bg-white/[0.03] px-4 py-5 sm:max-w-[260px] sm:px-5 sm:py-6 lg:max-w-[280px]">
            <div className="mb-3 rounded-xl border border-[#A8B0B8]/20 bg-[#0a0c10] p-2">
              <Image
                src={contact.logoSrc}
                alt={contact.organization}
                width={48}
                height={48}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
            </div>
            <div className="rounded-xl bg-white p-2.5 shadow-[0_0_24px_rgba(26,187,179,0.18)] sm:p-3">
              <QRCodeSVG
                value={contact.publicUrl}
                size={148}
                level="H"
                includeMargin
                bgColor="#FFFFFF"
                fgColor="#0A0C10"
                className="h-[132px] w-[132px] sm:h-[160px] sm:w-[160px] lg:h-[180px] lg:w-[180px]"
                title={`Código QR: ${contact.publicUrl}`}
              />
            </div>
            <p className="mt-3 max-w-[14rem] text-[11px] leading-relaxed text-[#A8B0B8] sm:text-xs">
              Escanea para guardar mi contacto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
