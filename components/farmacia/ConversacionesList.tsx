"use client";

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

type Props = {
  conversaciones: Conversacion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  error: string | null;
};

const estadoStyle: Record<Conversacion["estado"], string> = {
  derivada: "bg-red-100 text-red-700",
  abierta: "bg-emerald-100 text-emerald-700",
  cerrada: "bg-gray-100 text-gray-600",
};

const estadoLabel: Record<Conversacion["estado"], string> = {
  derivada: "Derivada",
  abierta: "Abierta",
  cerrada: "Cerrada",
};

export default function ConversacionesList({
  conversaciones,
  selectedId,
  onSelect,
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Cargando conversaciones...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (conversaciones.length === 0) {
    return <p className="text-sm text-gray-500">No hay conversaciones todavia</p>;
  }

  return (
    <div className="space-y-2">
      {conversaciones.map((conv) => {
        const isActive = selectedId === conv.id;
        const clienteNombre =
          conv.cliente?.nombre?.trim() ||
          conv.cliente_id ||
          "Cliente sin identificar";
        return (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv.id)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              isActive
                ? "border-[#1ABBB3] bg-[#1ABBB3]/10"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                {clienteNombre}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoStyle[conv.estado]}`}
              >
                {estadoLabel[conv.estado]}
              </span>
            </div>
            {conv.cliente?.telefono && (
              <p className="mb-1 truncate text-xs text-gray-500">
                {conv.cliente.telefono}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(conv.created_at).toLocaleString()}
            </p>
          </button>
        );
      })}
    </div>
  );
}
