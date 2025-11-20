"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPNRStatus } from "@/lib/api";
import { useTicketStore } from "@/store/useTicketStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Download, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { getGoogleCalendarUrl } from "@/lib/date-utils";

export function TicketStatus() {
  const [pnrInput, setPnrInput] = useState("");
  const [searchedPnr, setSearchedPnr] = useState("");
  const addRecentPnr = useTicketStore((state) => state.addRecentPnr);

  const { data: pnrStatus, isLoading, isError, error } = useQuery({
    queryKey: ["pnr", searchedPnr],
    queryFn: () => getPNRStatus(searchedPnr),
    enabled: !!searchedPnr,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.length !== 10) {
      toast.error("PNR must be 10 digits");
      return;
    }
    setSearchedPnr(pnrInput);
    addRecentPnr(pnrInput);
  };

  const downloadTicket = () => {
    if (!pnrStatus) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("E-Ticket / Reservation Slip", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`PNR: ${pnrStatus.pnr}`, 20, 40);
    doc.text(`Train: ${pnrStatus.trainNumber} - ${pnrStatus.trainName}`, 20, 50);
    doc.text(`Date: ${pnrStatus.dateOfJourney}`, 20, 60);
    doc.text(`From: ${pnrStatus.fromStation}`, 20, 70);
    doc.text(`To: ${pnrStatus.toStation}`, 20, 80);
    doc.text(`Class: ${pnrStatus.class}`, 20, 90);

    let y = 110;
    doc.text("Passenger Details:", 20, y);
    y += 10;
    pnrStatus.passengers.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.name} (${p.age}/${p.gender}) - ${p.status} ${p.coach}/${p.seatNumber || '-'}`, 20, y);
      y += 10;
    });

    doc.save(`Ticket_${pnrStatus.pnr}.pdf`);
    toast.success("Ticket downloaded successfully");
  };

  const addToCalendar = () => {
    if (!pnrStatus) return;
    
    const journeyDate = new Date(pnrStatus.dateOfJourney);
    const url = getGoogleCalendarUrl(
      `Train Journey: ${pnrStatus.trainName} (${pnrStatus.trainNumber})`,
      `PNR: ${pnrStatus.pnr}\nFrom: ${pnrStatus.fromStation}\nTo: ${pnrStatus.toStation}\nClass: ${pnrStatus.class}`,
      `${pnrStatus.fromStation} Railway Station`,
      journeyDate
    );
    
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check PNR Status</CardTitle>
          <CardDescription>Enter your 10-digit PNR number to check current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Enter 10-digit PNR"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isError && (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
          {error instanceof Error ? error.message : "Failed to fetch PNR status"}
        </div>
      )}

      {pnrStatus && (
        <Card className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">{pnrStatus.trainName}</CardTitle>
              <CardDescription className="text-lg font-medium mt-1">
                {pnrStatus.trainNumber} • {pnrStatus.dateOfJourney}
              </CardDescription>
            </div>
            <Badge variant={pnrStatus.chartPrepared ? "default" : "secondary"} className="text-sm">
              {pnrStatus.chartPrepared ? "Chart Prepared" : "Chart Not Prepared"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">From</p>
                <p className="font-semibold">{pnrStatus.fromStation}</p>
              </div>
              <div>
                <p className="text-muted-foreground">To</p>
                <p className="font-semibold">{pnrStatus.toStation}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Class</p>
                <p className="font-semibold">{pnrStatus.class}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Boarding At</p>
                <p className="font-semibold">{pnrStatus.boardingStation}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Passenger Status</h4>
              <div className="space-y-2">
                {pnrStatus.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">{passenger.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">({passenger.age}, {passenger.gender})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={passenger.status.includes("CNF") ? "default" : "outline"}>
                        {passenger.status}
                      </Badge>
                      {passenger.seatNumber && (
                        <span className="text-sm font-mono bg-background px-2 py-1 rounded border">
                          {passenger.coach}/{passenger.seatNumber}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 justify-end border-t pt-6">
            <Button variant="outline" onClick={addToCalendar}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <Button onClick={downloadTicket}>
              <Download className="mr-2 h-4 w-4" />
              Download Ticket
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
