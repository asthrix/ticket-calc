"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchTrains, getTrainSchedule, getFare, getSeatAvailability, Train, TrainSchedule, FareDetails, SeatAvailability } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Train as TrainIcon, ArrowRight, Clock, Calendar, Info, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { StationSearch } from "@/components/StationSearch";

export function TrainSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searchParams, setSearchParams] = useState<{ from: string; to: string } | null>(null);

  const { data: trains, isLoading } = useQuery({
    queryKey: ["trains", searchParams],
    queryFn: () => searchTrains(searchParams!.from, searchParams!.to, new Date()),
    enabled: !!searchParams,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    setSearchParams({ from, to });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Search Trains</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <StationSearch 
                value={from} 
                onChange={setFrom} 
                placeholder="From Station (e.g. Mumbai)"
              />
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 md:rotate-0" />
            </div>
            <div className="flex-1">
              <StationSearch 
                value={to} 
                onChange={setTo} 
                placeholder="To Station (e.g. Delhi)"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2 md:hidden">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {trains && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrainIcon className="h-5 w-5" />
            Available Trains ({trains.length})
          </h3>
          
          {trains.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
              No trains found between these stations.
            </div>
          ) : (
            <div className="grid gap-4">
              {trains.map((train) => (
                <Card key={train.trainNumber} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-primary">{train.trainName}</h4>
                          <Badge variant="outline">{train.trainNumber}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Runs: {train.daysRunning.join(" ")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="font-bold text-lg">{train.departureTime}</p>
                          <p className="text-xs text-muted-foreground">{train.fromStation.split(" (")[0]}</p>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="text-xs text-muted-foreground mb-1">{train.duration}</span>
                          <div className="w-24 h-[2px] bg-border relative">
                            <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary" />
                            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">{train.arrivalTime}</p>
                          <p className="text-xs text-muted-foreground">{train.toStation.split(" (")[0]}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 justify-center">
                         <TrainDetailsDialog train={train} from={from} to={to} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TrainDetailsDialog({ train, from, to }: { train: Train; from: string; to: string }) {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">Check Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{train.trainName} ({train.trainNumber})</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="schedule" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="fare">Fare</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="schedule" className="h-full">
              <ScheduleView trainNumber={train.trainNumber} />
            </TabsContent>
            <TabsContent value="availability" className="h-full">
              <AvailabilityView train={train} from={from} to={to} />
            </TabsContent>
            <TabsContent value="fare" className="h-full">
              <FareView train={train} from={from} to={to} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleView({ trainNumber }: { trainNumber: string }) {
  const { data: schedule, isLoading } = useQuery({
    queryKey: ["schedule", trainNumber],
    queryFn: () => getTrainSchedule(trainNumber),
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (!schedule) return <div className="p-4 text-center">No schedule available</div>;

  return (
    <ScrollArea className="h-[50vh]">
      <div className="space-y-4 p-4">
        {schedule.stations.map((station, i) => (
          <div key={station.stationCode} className="flex items-center gap-4 p-2 border-b last:border-0">
            <div className="w-8 text-sm text-muted-foreground">{i + 1}</div>
            <div className="flex-1">
              <p className="font-medium">{station.stationName}</p>
              <p className="text-xs text-muted-foreground">{station.stationCode}</p>
            </div>
            <div className="text-right text-sm">
              <p><span className="text-muted-foreground">Arr:</span> {station.arrivalTime}</p>
              <p><span className="text-muted-foreground">Dep:</span> {station.departureTime}</p>
            </div>
            <div className="w-16 text-right text-sm">
              <p>{station.distance} km</p>
              <p>Day {station.day}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function AvailabilityView({ train, from, to }: { train: Train; from: string; to: string }) {
  const [selectedClass, setSelectedClass] = useState(train.availableClasses[0] || "SL");
  
  const { data: availability, isLoading } = useQuery({
    queryKey: ["availability", train.trainNumber, from, to, selectedClass],
    queryFn: () => getSeatAvailability(train.trainNumber, from, to, selectedClass, new Date()),
    enabled: !!selectedClass,
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {train.availableClasses.map((cls) => (
          <Button 
            key={cls} 
            variant={selectedClass === cls ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedClass(cls)}
          >
            {cls}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : availability ? (
        <div className="grid gap-3">
          {availability.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={item.status.includes("AVAILABLE") ? "default" : "secondary"}>
                  {item.status}
                </Badge>
                <span className="font-bold">₹{item.ticketFare}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4">Select a class to check availability</div>
      )}
    </div>
  );
}

function FareView({ train, from, to }: { train: Train; from: string; to: string }) {
  const [selectedClass, setSelectedClass] = useState(train.availableClasses[0] || "SL");

  const { data: fare, isLoading } = useQuery({
    queryKey: ["fare", train.trainNumber, from, to, selectedClass],
    queryFn: () => getFare(train.trainNumber, from, to, selectedClass),
    enabled: !!selectedClass,
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {train.availableClasses.map((cls) => (
          <Button 
            key={cls} 
            variant={selectedClass === cls ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedClass(cls)}
          >
            {cls}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : fare ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-lg font-semibold">Total Fare</span>
              <span className="text-2xl font-bold text-primary">₹{fare.totalFare}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Fare</span>
                <span>₹{fare.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reservation Charge</span>
                <span>₹{fare.reservationCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Superfast Charge</span>
                <span>₹{fare.superfastCharge}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-4">Select a class to check fare</div>
      )}
    </div>
  );
}
