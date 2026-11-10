"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { farmafacilSolicitudHref } from "@/lib/constants";

export default function FloatingDemoCta() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const form = document.getElementById("solicitar-demo");
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHide(entry.isIntersecting),
      { threshold: 0.12 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  if (hide) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-auto mx-auto max-w-md">
        <Button
          asChild
          className="h-12 w-full rounded-2xl bg-[#1ABBB3] text-base font-semibold text-white shadow-lg shadow-[#1ABBB3]/25 hover:bg-[#159a94]"
        >
          <a href={farmafacilSolicitudHref("flotante")}>Solicitar una prueba</a>
        </Button>
      </div>
    </div>
  );
}
