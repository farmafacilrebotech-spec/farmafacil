"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mensaje = {
  id: string;
  conversacion_id: string;
  emisor: "cliente" | "asistente" | "farmacia";
  mensaje: string;
  leido: boolean;
  created_at: string;
};

type Props = {
  conversacionId: string | null;
  onSent?: () => Promise<void> | void;
};

const emisorLabel: Record<Mensaje["emisor"], string> = {
  cliente: "Cliente",
  asistente: "Asistente",
  farmacia: "Farmacia",
};

export default function ChatFarmacia({ conversacionId, onSent }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef(false);
  const shouldStickToBottomRef = useRef(true);

  const canSend = useMemo(
    () => Boolean(conversacionId && input.trim() && !sending),
    [conversacionId, input, sending]
  );

  const fetchMensajes = async (silent = false) => {
    if (!conversacionId) return;
    if (pollingRef.current) return;
    pollingRef.current = true;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch(
        `/api/farmacia/mensajes?conversacion_id=${encodeURIComponent(conversacionId)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los mensajes");
      setMensajes(data.mensajes || []);
    } catch (err: any) {
      setError(err?.message || "Error cargando mensajes");
    } finally {
      pollingRef.current = false;
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setMensajes([]);
    setInput("");
    setError(null);
    shouldStickToBottomRef.current = true;
    if (conversacionId) void fetchMensajes();
  }, [conversacionId]);

  useEffect(() => {
    if (listRef.current && shouldStickToBottomRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [mensajes, loading]);

  useEffect(() => {
    if (!conversacionId) return;

    const intervalId = setInterval(() => {
      void fetchMensajes(true);
    }, 7000);

    return () => clearInterval(intervalId);
  }, [conversacionId]);

  const handleSend = async () => {
    if (!canSend || !conversacionId) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/responder-farmacia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversacion_id: conversacionId,
          mensaje: input.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo enviar el mensaje");

      setInput("");
      await fetchMensajes();
      await onSent?.();
    } catch (err: any) {
      setError(err?.message || "Error enviando mensaje");
    } finally {
      setSending(false);
    }
  };

  if (!conversacionId) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
        <p className="text-sm text-gray-500">
          Selecciona una conversacion para ver los mensajes
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-semibold text-[#1A1A1A]">
          Conversacion {conversacionId.slice(0, 8)}
        </p>
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto p-4"
        onScroll={() => {
          if (!listRef.current) return;
          const distanceFromBottom =
            listRef.current.scrollHeight -
            listRef.current.scrollTop -
            listRef.current.clientHeight;
          shouldStickToBottomRef.current = distanceFromBottom < 80;
        }}
      >
        {loading ? (
          <p className="text-sm text-gray-500">Cargando mensajes...</p>
        ) : mensajes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay mensajes en esta conversacion</p>
        ) : (
          mensajes.map((msg) => {
            const isCliente = msg.emisor === "cliente";
            return (
              <div
                key={msg.id}
                className={`flex ${isCliente ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 ${
                    isCliente
                      ? "bg-gray-100 text-gray-800"
                      : "bg-[#1ABBB3] text-white"
                  }`}
                >
                  <p className="mb-1 text-xs font-semibold opacity-80">
                    {emisorLabel[msg.emisor]}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.mensaje}</p>
                  <p className="mt-1 text-[11px] opacity-80">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t p-3">
        {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe una respuesta..."
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!canSend}
            className="bg-[#1ABBB3] hover:bg-[#149b94] text-white"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
