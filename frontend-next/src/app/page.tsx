import { SavingsPredictionDashboard } from "@/components/dashboard/savings-prediction-dashboard";
import { HeroSection } from "@/components/dashboard/hero-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-8 -mt-20 relative z-10">
        <SavingsPredictionDashboard />
      </div>
    </div>
  );
}
