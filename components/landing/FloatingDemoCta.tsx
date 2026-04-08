"use client";

import { Button } from "@/components/ui/button";

export default function FloatingDemoCta() {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-auto mx-auto max-w-md">
        <Button
          asChild
          className="h-12 w-full rounded-2xl bg-[#1ABBB3] text-base font-semibold text-white shadow-lg shadow-[#1ABBB3]/25 hover:bg-[#159a94]"
        >
          <a href="#solicitar-demo">Solicitar demo gratuita</a>
        </Button>
      </div>
    </div>
  );
}
