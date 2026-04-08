"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type ContactFormProps = {
  /** Si true, envía también a webhook con mensaje vacío rellenado para Sheets */
  source?: "landing" | "contacto";
  className?: string;
};

export default function ContactForm({ source = "landing", className }: ContactFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    farmacia: "",
    email: "",
    telefono: "",
    aceptarRGPD: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.aceptarRGPD) {
      toast({
        title: "Falta aceptar la política",
        description: "Marca la casilla de protección de datos para continuar.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        farmacia: form.farmacia.trim(),
        tipoUsuario: "farmacia",
        mensaje: "Solicitud de demo gratuita (landing)",
        source,
        // Campos extra para webhook / Google Sheets (mapea columnas en tu script)
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al enviar");
      }
      toast({
        title: "¡Listo!",
        description: "Hemos recibido tu solicitud. Te contactamos muy pronto.",
      });
      setForm({
        nombre: "",
        farmacia: "",
        email: "",
        telefono: "",
        aceptarRGPD: false,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "No se pudo enviar",
        description: "Inténtalo de nuevo en unos minutos o escríbenos por contacto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <Label htmlFor="demo-nombre" className="text-gray-700">
            Nombre
          </Label>
          <Input
            id="demo-nombre"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="demo-farmacia" className="text-gray-700">
            Farmacia
          </Label>
          <Input
            id="demo-farmacia"
            required
            placeholder="Nombre de la oficina"
            value={form.farmacia}
            onChange={(e) => setForm({ ...form, farmacia: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="demo-email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="demo-email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="demo-telefono" className="text-gray-700">
            Teléfono
          </Label>
          <Input
            id="demo-telefono"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+34 600 000 000"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2">
        <input
          id="demo-rgpd"
          type="checkbox"
          checked={form.aceptarRGPD}
          onChange={(e) => setForm({ ...form, aceptarRGPD: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1ABBB3] focus:ring-[#1ABBB3]"
        />
        <label htmlFor="demo-rgpd" className="text-sm text-gray-600">
          He leído y acepto la{" "}
          <Link href="/privacidad" className="font-medium text-[#1ABBB3] hover:underline">
            política de privacidad
          </Link>
          .
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-[#1ABBB3] py-6 text-base font-semibold text-white hover:bg-[#159a94] sm:w-auto sm:px-12"
      >
        {loading ? "Enviando…" : "Solicitar demo gratuita"}
      </Button>

      <p className="mt-3 text-center text-sm font-medium text-[#1ABBB3] sm:text-left">
        Te respondemos en menos de 24h
      </p>

      <p className="mt-4 text-xs text-gray-500">
        Usamos tus datos solo para responderte y concertar la demo.
      </p>
    </form>
  );
}
