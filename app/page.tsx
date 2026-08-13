import dynamic from "next/dynamic";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionBlocks from "@/components/landing/SolutionBlocks";
import HowItWorks from "@/components/landing/HowItWorks";
import BenefitsGrid from "@/components/landing/BenefitsGrid";
import UseCasesSection from "@/components/landing/UseCasesSection";
import DifferentiationSection from "@/components/landing/DifferentiationSection";
import SurveyCtaSection from "@/components/landing/SurveyCtaSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/common/Footer";

/** Mockups de cliente, kiosco y panel — fuera del primer viewport */
const MockupShowcase = dynamic(() => import("@/components/landing/MockupShowcase"), {
  ssr: true,
});

/** Testimonios */
const SocialProofSection = dynamic(() => import("@/components/landing/SocialProofSection"), {
  ssr: true,
});

/** Formulario de demo (incluye ContactForm cliente) */
const DemoFormSection = dynamic(() => import("@/components/landing/DemoFormSection"), {
  ssr: true,
});

/** CTA fijo interactivo en móvil */
const FloatingDemoCta = dynamic(() => import("@/components/landing/FloatingDemoCta"), {
  ssr: true,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F9FA] pb-24 md:pb-0">
      <LandingNav />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionBlocks />
        <HowItWorks />
        <BenefitsGrid />
        <MockupShowcase />
        <UseCasesSection />
        <DifferentiationSection />
        <SocialProofSection />
        <SurveyCtaSection />
        <CTASection />
        <DemoFormSection />
      </main>
      <Footer />
      <FloatingDemoCta />
    </div>
  );
}
