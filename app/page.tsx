import LandingNav from "@/components/landing/LandingNav";
import FloatingDemoCta from "@/components/landing/FloatingDemoCta";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionBlocks from "@/components/landing/SolutionBlocks";
import HowItWorks from "@/components/landing/HowItWorks";
import BenefitsGrid from "@/components/landing/BenefitsGrid";
import MockupShowcase from "@/components/landing/MockupShowcase";
import UseCasesSection from "@/components/landing/UseCasesSection";
import DifferentiationSection from "@/components/landing/DifferentiationSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CTASection from "@/components/landing/CTASection";
import DemoFormSection from "@/components/landing/DemoFormSection";
import Footer from "@/components/common/Footer";

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
        <CTASection />
        <DemoFormSection />
      </main>
      <Footer />
      <FloatingDemoCta />
    </div>
  );
}
