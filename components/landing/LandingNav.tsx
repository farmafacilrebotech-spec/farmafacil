"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#problema", label: "Retos" },
  { href: "#solucion", label: "Solución" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#demo-visual", label: "Ver en acción" },
] as const;

export default function LandingNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80 bg-white/95 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {!logoError ? (
            <Image
              src="/images/logo/farmafacil-logo.png"
              alt="FarmaFácil"
              width={40}
              height={40}
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              onError={() => setLogoError(true)}
              priority
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] sm:h-10 sm:w-10">
              <Pill className="h-5 w-5 text-white" />
            </div>
          )}
          <span className="text-lg font-bold tracking-tight text-[#1A1A1A] sm:text-xl">
            FarmaFácil
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-[#F7F9FA] hover:text-[#1ABBB3]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/contacto"
            className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-[#F7F9FA] hover:text-[#1ABBB3]"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden text-sm font-medium text-gray-500 hover:text-[#1ABBB3] sm:block">
            Acceder
          </Link>
          <Button
            asChild
            className="hidden rounded-full bg-[#1ABBB3] px-5 text-white shadow-sm hover:bg-[#159a94] sm:inline-flex"
          >
            <a href="#solicitar-demo">Solicitar demo</a>
          </Button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-gray-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/contacto"
              className="rounded-lg px-3 py-3 text-base font-medium text-gray-800"
              onClick={() => setOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-3 text-base font-medium text-gray-500"
              onClick={() => setOpen(false)}
            >
              Acceder
            </Link>
            <Button asChild className="mt-2 w-full rounded-full bg-[#1ABBB3] text-white">
              <a href="#solicitar-demo" onClick={() => setOpen(false)}>
                Solicitar demo
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
