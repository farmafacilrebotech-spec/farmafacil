"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getFarmaciaSession } from "@/lib/sessionManager";
import ConversacionesList from "@/components/farmacia/ConversacionesList";
import ChatFarmacia from "@/components/farmacia/ChatFarmacia";

type Conversacion = {
  id: string;
  cliente_id: string | null;
  cliente?: {
    nombre?: string | null;
    telefono?: string | null;
  } | null;
  estado: "abierta" | "derivada" | "cerrada";
  created_at: string;
};

const IS_DEV = process.env.NODE_ENV === "development";
// TODO: Reemplazar este ID temporal por el farmacia_id autenticado real al reactivar protección.
const DEV_FARMACIA_ID = process.env.NEXT_PUBLIC_DEV_FARMACIA_ID;

export default function FarmaciaConversacionesPage() {
  const router = useRouter();
  const [farmaciaId, setFarmaciaId] = useState("");
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [selectedConversacionId, setSelectedConversacionId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initFarmacia();
  }, []);

  const initFarmacia = async () => {
    const session = getFarmaciaSession();
    if (!session?.farmacia_id) {
      if (IS_DEV && DEV_FARMACIA_ID) {
        setFarmaciaId(DEV_FARMACIA_ID);
        await fetchConversaciones(DEV_FARMACIA_ID);
        setIsLoading(false);
        return;
      }

      router.push("/login-farmacia");
      return;
    }

    setFarmaciaId(session.farmacia_id);
    await fetchConversaciones(session.farmacia_id);
    setIsLoading(false);
  };

  const fetchConversaciones = useCallback(async (fId: string) => {
    setError(null);
    try {
      const res = await fetch(
        `/api/farmacia/conversaciones?farmacia_id=${encodeURIComponent(fId)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar las conversaciones");
      }

      const prioridadEstado: Record<Conversacion["estado"], number> = {
        derivada: 0,
        abierta: 1,
        cerrada: 2,
      };

      const sorted: Conversacion[] = (data.conversaciones || []).sort(
        (a: Conversacion, b: Conversacion) => {
          const porEstado = prioridadEstado[a.estado] - prioridadEstado[b.estado];
          if (porEstado !== 0) return porEstado;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      );

      setConversaciones(sorted);

      if (sorted.length === 0) {
        setSelectedConversacionId(null);
        return;
      }

      const selectedSigueExistiendo = sorted.some(
        (conv) => conv.id === selectedConversacionId
      );

      if (!selectedSigueExistiendo) {
        setSelectedConversacionId(sorted[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Error cargando conversaciones");
    }
  }, [selectedConversacionId]);

  useEffect(() => {
    if (!farmaciaId) return;

    const intervalId = setInterval(() => {
      void fetchConversaciones(farmaciaId);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [farmaciaId, fetchConversaciones]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
              Conversaciones del Asistente
            </h1>
            <p className="text-gray-600">
              Gestiona respuestas manuales de tu farmacia
            </p>
          </div>

          {conversaciones.length === 0 && !isLoading && !error ? (
            <div className="rounded-lg border bg-white py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">No hay conversaciones todavia</p>
            </div>
          ) : (
            <div className="grid min-h-[65vh] grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
              <aside className="rounded-lg border bg-white p-3">
                <h2 className="mb-3 text-sm font-semibold text-[#1A1A1A]">
                  Conversaciones ({conversaciones.length})
                </h2>
                <ConversacionesList
                  conversaciones={conversaciones}
                  selectedId={selectedConversacionId}
                  onSelect={setSelectedConversacionId}
                  isLoading={isLoading}
                  error={error}
                />
              </aside>

              <section className="min-h-[60vh]">
                <ChatFarmacia
                  conversacionId={selectedConversacionId}
                  onSent={async () => {
                    if (farmaciaId) {
                      await fetchConversaciones(farmaciaId);
                    }
                  }}
                />
              </section>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

