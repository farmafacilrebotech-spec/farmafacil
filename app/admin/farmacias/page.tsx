export default function AdminFarmacias() {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin · Farmacias</h1>
        <p className="text-muted-foreground">
          Aquí irá el alta y listado de farmacias.
        </p>
  
        <div className="rounded-xl border p-4">
          <p className="font-medium">Siguiente:</p>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Botón “Nueva farmacia”</li>
            <li>Tabla con farmacias (nombre, código, estado)</li>
            <li>Acciones: activar/desactivar, ver panel, regenerar token kiosko</li>
          </ul>
        </div>
      </main>
    );
  }
  