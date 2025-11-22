import { HeroSection } from "@/components/home/HeroSection";
import { QuickTools } from "@/components/home/QuickTools";

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-16 pb-12 sm:pb-24">
      <HeroSection />
      <QuickTools />
    </div>
  );
}
