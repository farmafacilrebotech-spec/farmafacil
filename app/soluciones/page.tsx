import type { Metadata } from "next";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SolucionesContent from "@/components/soluciones/SolucionesContent";

export const metadata: Metadata = {
  title: "Soluciones y planes | FarmaFácil",
  description:
    "Descubre las modalidades FarmaFácil General, Personalizado y con Asistente IA. Solicita información comercial sin compromiso.",
};

export default function SolucionesPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />
      <main>
        <SolucionesContent />
      </main>
      <Footer />
    </div>
  );
}
