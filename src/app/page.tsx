import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketStatus } from "@/components/TicketStatus";
import { BookingCalculator } from "@/components/BookingCalculator";
import { TrainSearch } from "@/components/TrainSearch";
import { LiveTrainStatus } from "@/components/LiveTrainStatus";

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      <section className="text-center space-y-4 pt-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Your Smart Railway Companion
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Check PNR status, find trains, track live status, and know exactly when to book your tickets.
        </p>
      </section>

      {/* Main Feature: Booking Calculator */}
      <section className="w-full max-w-6xl mx-auto px-4">
        <BookingCalculator />
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Tools</h2>
        <Tabs defaultValue="pnr" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto bg-muted/50 p-1">
            <TabsTrigger value="pnr" className="py-3 text-base">Check PNR Status</TabsTrigger>
            <TabsTrigger value="search" className="py-3 text-base">Search Trains</TabsTrigger>
            <TabsTrigger value="live" className="py-3 text-base">Live Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pnr" className="space-y-4">
            <TicketStatus />
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <TrainSearch />
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            <LiveTrainStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
