import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Train, Activity, ShieldCheck, Clock, Smartphone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-24 space-y-16 sm:space-y-24">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-linear-to-r from-rose-500 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
          About Ticket Calc
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Simplifying your railway journey with precision tools and real-time insights. 
          We help you book confirmed tickets by telling you exactly when to act.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Booking Tatkal tickets on IRCTC can be stressful. Seconds matter. 
            Our mission is to give you the competitive edge you need. By providing 
            precise opening times, automated reminders, and instant status updates, 
            we ensure you're always ready when the booking window opens.
          </p>
        </div>
        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-linear-to-br from-primary/10 to-violet-500/10 border border-border/50 flex items-center justify-center">
            <Train className="h-32 w-32 text-primary/20" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Us?</h2>
          <p className="text-muted-foreground">
            Built for the modern traveler, our tools are designed to be fast, accurate, and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Calculator className="h-6 w-6 text-rose-500" />}
            title="Smart Calculator"
            description="Instantly calculate the exact booking opening date for your journey, including Tatkal and Advance Reservation periods."
          />
          <FeatureCard 
            icon={<Clock className="h-6 w-6 text-emerald-500" />}
            title="Precise Reminders"
            description="Get notified exactly when you need to be ready. We integrate directly with your calendar for seamless alerts."
          />
          <FeatureCard 
            icon={<Activity className="h-6 w-6 text-violet-500" />}
            title="Live Status"
            description="Track your train's live location and running status in real-time to plan your journey better."
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6 text-blue-500" />}
            title="PNR Status"
            description="Check the current status of your booked tickets with detailed prediction analysis."
          />
          <FeatureCard 
            icon={<Smartphone className="h-6 w-6 text-orange-500" />}
            title="Mobile First"
            description="Designed to work perfectly on your phone. Deep links open the IRCTC app directly for faster booking."
          />
          <FeatureCard 
            icon={<Train className="h-6 w-6 text-primary" />}
            title="All-in-One"
            description="Your complete companion for Indian Railways. From planning to booking to tracking, we cover it all."
          />
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="mb-4 p-3 w-fit rounded-xl bg-muted/50">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
