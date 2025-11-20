"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { STATIONS } from "@/lib/stations";

interface StationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function StationSearch({ value, onChange, placeholder = "Select station..." }: StationSearchProps) {
  const [open, setOpen] = React.useState(false);

  const selectedStation = STATIONS.find((station) => station.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedStation
            ? `${selectedStation.name} (${selectedStation.code})`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search station..." />
          <CommandList>
            <CommandEmpty>No station found.</CommandEmpty>
            <CommandGroup>
              {STATIONS.map((station) => (
                <CommandItem
                  key={station.code}
                  value={station.name}
                  onSelect={() => {
                    onChange(station.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === station.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {station.name} ({station.code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
