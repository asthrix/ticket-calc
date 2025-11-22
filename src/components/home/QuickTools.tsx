
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketStatus } from "@/components/TicketStatus";
import { TrainSearch } from "@/components/TrainSearch";
import { LiveTrainStatus } from "@/components/LiveTrainStatus";
import { Ticket, Search, Radio, Activity } from "lucide-react";

export function QuickTools() {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-6">
      <div className="flex items-center justify-center mb-4 sm:mb-8">
        <div className="bg-background/50 backdrop-blur-sm border px-4 py-1.5 rounded-full shadow-sm">
          <h2 className="text-xs sm:text-base font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            Quick Tools
          </h2>
        </div>
      </div>

      <Tabs defaultValue="pnr" className="w-full">
        <div className="flex justify-center mb-4 sm:mb-10">
          <TabsList className="h-auto p-1 bg-muted/30 backdrop-blur-md border rounded-xl sm:rounded-full flex-wrap justify-center gap-1 w-full sm:w-auto">
            <TabsTrigger 
              value="pnr" 
              className="rounded-lg sm:rounded-full px-3 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex-1 sm:flex-none"
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>PNR Status</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="rounded-lg sm:rounded-full px-3 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex-1 sm:flex-none"
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Search Trains</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="live" 
              className="rounded-lg sm:rounded-full px-3 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex-1 sm:flex-none"
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <Radio className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Live Status</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="bg-background/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl border shadow-xl p-0 sm:p-2 overflow-hidden">
          <TabsContent value="pnr" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="p-3 sm:p-8">
              <TicketStatus />
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="p-3 sm:p-8">
              <TrainSearch />
            </div>
          </TabsContent>

          <TabsContent value="live" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="p-3 sm:p-8">
              <LiveTrainStatus />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
