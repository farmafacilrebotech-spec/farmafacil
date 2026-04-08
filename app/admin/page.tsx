import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin · FarmaFácil</h1>
      <p className="text-muted-foreground">
        Gestión de plataforma: alta de farmacias, usuarios y configuración.
      </p>

      <div className="flex gap-3">
        <Link className="underline" href="/admin/farmacias">
          Gestionar farmacias
        </Link>
      </div>
    </main>
  );
}
