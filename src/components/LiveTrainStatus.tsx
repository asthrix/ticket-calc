"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLiveTrainStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Train, MapPin, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveTrainStatus() {
  const [trainNumber, setTrainNumber] = useState("");
  const [searchedTrain, setSearchedTrain] = useState("");

  const { data: status, isLoading, isError } = useQuery({
    queryKey: ["liveStatus", searchedTrain],
    queryFn: () => getLiveTrainStatus(searchedTrain),
    enabled: !!searchedTrain,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainNumber) return;
    setSearchedTrain(trainNumber);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-6 w-6 text-primary" />
            Where is my Train?
          </CardTitle>
          <CardDescription>Enter train number to check live running status</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Enter Train Number (e.g. 12951)"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="flex-1 text-lg h-12"
            />
            <Button type="submit" size="lg" disabled={isLoading} className="h-12 px-8">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              <span className="ml-2 hidden sm:inline">Track</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {status && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Info */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{status.trainName}</h2>
                  <div className="flex items-center gap-2 opacity-90 mt-1">
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                      {status.trainNumber}
                    </Badge>
                    <span>• Started on {status.startDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold text-lg">{status.currentStatus}</span>
                  </div>
                  <p className="text-sm mt-2 opacity-80 flex items-center justify-end gap-1">
                    <MapPin className="h-4 w-4" />
                    {status.currentStation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Live Route</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4 md:pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 md:before:ml-8 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {status.stations.map((station, index) => {
                  const isPassed = station.status === "passed";
                  const isCurrent = station.status === "current";
                  
                  return (
                    <div key={station.stationCode} className={cn(
                      "relative flex items-start gap-4 md:gap-8 group",
                      station.status === "upcoming" && "opacity-60"
                    )}>
                      {/* Timeline Dot */}
                      <div className={cn(
                        "absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10 transition-colors",
                        isPassed ? "bg-green-500" : isCurrent ? "bg-blue-500 scale-125 animate-pulse" : "bg-muted-foreground"
                      )} />

                      {/* Content */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <div className="md:col-span-4">
                          <p className="font-bold text-lg">{station.stationName}</p>
                          <p className="text-sm text-muted-foreground">{station.stationCode}</p>
                        </div>
                        
                        <div className="md:col-span-3 flex flex-col justify-center">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Arr:</span>
                            <span className="font-mono">{station.arrivalTime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Dep:</span>
                            <span className="font-mono">{station.departureTime}</span>
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-center">
                          <Badge variant="outline" className="w-full justify-center">
                            Day {station.day}
                          </Badge>
                        </div>

                        <div className="md:col-span-3 flex items-center justify-end">
                          {station.delay > 0 ? (
                            <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Late {station.delay}m
                            </span>
                          ) : (
                            <span className="text-green-600 text-sm font-medium">On Time</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
