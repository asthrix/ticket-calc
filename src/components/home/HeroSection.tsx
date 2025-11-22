
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { BookingCalculator } from "@/components/BookingCalculator";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <DottedGlowBackground />
      <div className="relative z-10 space-y-8 sm:space-y-16 pb-8 sm:pb-16">
        <section className="text-center space-y-3 sm:space-y-4 pt-8 sm:pt-16 px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-rose-500 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
            Your Smart Railway Companion
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Check PNR status, find trains, track live status, and know exactly when to book your tickets.
          </p>
        </section>

        {/* Main Feature: Booking Calculator */}
        <section className="w-full mx-auto px-0 sm:px-4">
          <BookingCalculator />
        </section>
      </div>
    </div>
  );
}
