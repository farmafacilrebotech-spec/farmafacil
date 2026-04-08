"use client";

import Image from "next/image";
import { useState } from "react";
import { Pill } from "lucide-react";

export default function FooterLogo() {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3]">
        <Pill className="h-10 w-10 text-white" aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src="/images/logo/farmafacil-logo.png"
      alt="FarmaFácil"
      width={80}
      height={80}
      className="h-20 w-20 shrink-0 object-contain"
      onError={() => setError(true)}
    />
  );
}
