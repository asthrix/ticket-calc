import { addDays, format } from "date-fns";

// --- Interfaces ---

export interface Passenger {
  name: string;
  age: number;
  gender: "M" | "F" | "O";
  status: string;
  seatNumber?: string;
  coach?: string;
  bookingStatus?: string;
  currentStatus?: string;
}

export interface PNRStatus {
  pnr: string;
  trainNumber: string;
  trainName: string;
  dateOfJourney: string;
  fromStation: string;
  toStation: string;
  boardingStation: string;
  reservationUpto: string;
  class: string;
  chartPrepared: boolean;
  passengers: Passenger[];
  bookingDate?: string;
  quota?: string;
  totalFare?: number;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  daysRunning: string[]; // e.g., ["M", "T", "W", "T", "F", "S", "S"]
  availableClasses: string[];
  type?: string; // e.g., "SF", "EXP"
}

export interface StationStatus {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltTime: string;
  distance: string;
  day: number;
  status: "passed" | "current" | "upcoming";
  delay: number; // in minutes
  platform?: string;
}

export interface LiveTrainStatus {
  trainNumber: string;
  trainName: string;
  startDate: string;
  currentStation: string;
  currentStatus: string; // e.g., "On Time", "Delayed by 10 mins"
  stations: StationStatus[];
  lastUpdated?: string;
}

export interface TrainScheduleStation {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltTime: string;
  distance: string;
  day: number;
  platform?: string;
}

export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  stations: TrainScheduleStation[];
  daysRunning: string[];
}

export interface FareDetails {
  baseFare: number;
  reservationCharge: number;
  superfastCharge: number;
  totalFare: number;
  currency: string;
  classType: string;
}

export interface SeatAvailability {
  date: string;
  status: string; // e.g., "AVAILABLE 10", "WL 5", "RAC 2"
  ticketFare: number;
}

// --- Configuration ---

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
const RAPID_API_HOST = "irctc1.p.rapidapi.com";

// --- Mock Data ---

const MOCK_PNR_DATA: Record<string, PNRStatus> = {
  "1234567890": {
    pnr: "1234567890",
    trainNumber: "12951",
    trainName: "RAJDHANI EXP",
    dateOfJourney: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    fromStation: "MUMBAI CENTRAL (MMCT)",
    toStation: "NEW DELHI (NDLS)",
    boardingStation: "MUMBAI CENTRAL (MMCT)",
    reservationUpto: "NEW DELHI (NDLS)",
    class: "3A",
    chartPrepared: false,
    passengers: [
      { name: "John Doe", age: 30, gender: "M", status: "CNF", seatNumber: "B1/12", coach: "B1", bookingStatus: "CNF", currentStatus: "CNF" },
      { name: "Jane Doe", age: 28, gender: "F", status: "CNF", seatNumber: "B1/13", coach: "B1", bookingStatus: "CNF", currentStatus: "CNF" },
    ],
  },
};

const MOCK_TRAINS: Train[] = [
  {
    trainNumber: "12951",
    trainName: "RAJDHANI EXP",
    fromStation: "MUMBAI CENTRAL (MMCT)",
    toStation: "NEW DELHI (NDLS)",
    departureTime: "17:00",
    arrivalTime: "08:32",
    duration: "15h 32m",
    daysRunning: ["M", "T", "W", "T", "F", "S", "S"],
    availableClasses: ["1A", "2A", "3A"],
  },
  {
    trainNumber: "12009",
    trainName: "SHATABDI EXP",
    fromStation: "AHMEDABAD JN (ADI)",
    toStation: "MUMBAI CENTRAL (MMCT)",
    departureTime: "14:40",
    arrivalTime: "21:20",
    duration: "6h 40m",
    daysRunning: ["M", "T", "W", "T", "F", "S"],
    availableClasses: ["CC", "EC"],
  },
];

const MOCK_LIVE_STATUS: Record<string, LiveTrainStatus> = {
  "12951": {
    trainNumber: "12951",
    trainName: "RAJDHANI EXP",
    startDate: format(new Date(), "yyyy-MM-dd"),
    currentStation: "SURAT (ST)",
    currentStatus: "On Time",
    stations: [
      { stationCode: "MMCT", stationName: "MUMBAI CENTRAL", arrivalTime: "17:00", departureTime: "17:00", haltTime: "0", distance: "0", day: 1, status: "passed", delay: 0 },
      { stationCode: "ST", stationName: "SURAT", arrivalTime: "19:50", departureTime: "19:55", haltTime: "5", distance: "263", day: 1, status: "current", delay: 0 },
      { stationCode: "NDLS", stationName: "NEW DELHI", arrivalTime: "08:32", departureTime: "08:32", haltTime: "0", distance: "1386", day: 2, status: "upcoming", delay: 0 },
    ]
  }
};

const MOCK_SCHEDULE: Record<string, TrainSchedule> = {
  "12951": {
    trainNumber: "12951",
    trainName: "RAJDHANI EXP",
    daysRunning: ["M", "T", "W", "T", "F", "S", "S"],
    stations: [
      { stationCode: "MMCT", stationName: "MUMBAI CENTRAL", arrivalTime: "17:00", departureTime: "17:00", haltTime: "0", distance: "0", day: 1 },
      { stationCode: "BVI", stationName: "BORIVALI", arrivalTime: "17:30", departureTime: "17:32", haltTime: "2", distance: "30", day: 1 },
      { stationCode: "ST", stationName: "SURAT", arrivalTime: "19:50", departureTime: "19:55", haltTime: "5", distance: "263", day: 1 },
      { stationCode: "NDLS", stationName: "NEW DELHI", arrivalTime: "08:32", departureTime: "08:32", haltTime: "0", distance: "1386", day: 2 },
    ]
  }
};

const MOCK_FARE: FareDetails = {
  baseFare: 2500,
  reservationCharge: 60,
  superfastCharge: 75,
  totalFare: 2850,
  currency: "INR",
  classType: "3A"
};

const MOCK_SEAT_AVAILABILITY: SeatAvailability[] = [
  { date: format(addDays(new Date(), 1), "yyyy-MM-dd"), status: "AVAILABLE 15", ticketFare: 2850 },
  { date: format(addDays(new Date(), 2), "yyyy-MM-dd"), status: "WL 5", ticketFare: 2850 },
  { date: format(addDays(new Date(), 3), "yyyy-MM-dd"), status: "RAC 10", ticketFare: 2850 },
];

// --- Helper Functions ---

async function fetchFromRapidAPI(endpoint: string, params: Record<string, string>) {
  if (!RAPID_API_KEY) throw new Error("No API Key");
  
  const queryString = new URLSearchParams(params).toString();
  const url = `https://${RAPID_API_HOST}/${endpoint}?${queryString}`;
  
  const response = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
  });
  
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
}

// --- API Functions ---

export const getPNRStatus = async (pnr: string): Promise<PNRStatus> => {
  if (RAPID_API_KEY) {
    try {
      const data = await fetchFromRapidAPI("api/v3/getPNRStatus", { pnrNumber: pnr });
      if (data && data.status) {
         // Map API response to PNRStatus interface
         // Note: This mapping depends on the exact API response structure. 
         // Assuming a structure similar to our interface for now.
         // In a real scenario, we'd inspect the 'data' object and map fields accordingly.
         return {
             pnr: data.data.Pnr,
             trainNumber: data.data.TrainNo,
             trainName: data.data.TrainName,
             dateOfJourney: data.data.Doj,
             fromStation: data.data.From,
             toStation: data.data.To,
             boardingStation: data.data.BoardingStation,
             reservationUpto: data.data.ReservationUpto,
             class: data.data.Class,
             chartPrepared: data.data.ChartPrepared,
             passengers: data.data.PassengerStatus.map((p: any) => ({
                 name: p.Name || "Passenger",
                 age: p.Age || 0,
                 gender: p.Gender || "U",
                 status: p.CurrentStatus,
                 seatNumber: p.Berth,
                 coach: p.Coach,
                 bookingStatus: p.BookingStatus,
                 currentStatus: p.CurrentStatus
             })),
             bookingDate: data.data.BookingDate,
             quota: data.data.Quota,
             totalFare: data.data.TotalFare
         };
      }
    } catch (error) {
      console.error("API Error (PNR), using mock:", error);
    }
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_PNR_DATA[pnr];
      if (data) resolve(data);
      else reject(new Error("PNR not found."));
    }, 1000);
  });
};

export const searchTrains = async (from: string, to: string, date: Date): Promise<Train[]> => {
  if (RAPID_API_KEY) {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const data = await fetchFromRapidAPI("api/v3/trainBetweenStations", { 
        fromStationCode: from, 
        toStationCode: to, 
        dateOfJourney: dateStr 
      });
      
      if (data && data.data) {
        return data.data.map((t: any) => ({
          trainNumber: t.train_number,
          trainName: t.train_name,
          fromStation: t.from_station_name,
          toStation: t.to_station_name,
          departureTime: t.from_std,
          arrivalTime: t.to_sta,
          duration: t.duration,
          daysRunning: t.run_days, // Need to ensure format matches
          availableClasses: t.class_type,
          type: t.train_type
        }));
      }
    } catch (error) {
      console.error("API Error (Search), using mock:", error);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_TRAINS.filter(
        (train) =>
          (from === "" || train.fromStation.toLowerCase().includes(from.toLowerCase())) &&
          (to === "" || train.toStation.toLowerCase().includes(to.toLowerCase()))
      );
      resolve(results);
    }, 1000);
  });
};

export const getLiveTrainStatus = async (trainNumber: string): Promise<LiveTrainStatus> => {
  if (RAPID_API_KEY) {
    try {
      const data = await fetchFromRapidAPI("api/v1/getLiveTrainStatus", { 
        trainNo: trainNumber, 
        startDay: "1" // Defaulting to 1 (today/yesterday depending on API logic)
      });
      
      if (data && data.data) {
        return {
          trainNumber: data.data.train_number,
          trainName: data.data.train_name,
          startDate: data.data.train_start_date,
          currentStation: data.data.current_station_name,
          currentStatus: data.data.status,
          stations: data.data.previous_stations.concat(data.data.upcoming_stations).map((s: any) => ({
             stationCode: s.station_code,
             stationName: s.station_name,
             arrivalTime: s.eta,
             departureTime: s.etd,
             haltTime: s.halt,
             distance: s.distance_from_source,
             day: s.day,
             status: s.has_departed ? "passed" : (s.is_current ? "current" : "upcoming"),
             delay: s.delay || 0,
             platform: s.platform_number
          })).sort((a: any, b: any) => parseInt(a.distance) - parseInt(b.distance)),
          lastUpdated: data.data.updated_time
        };
      }
    } catch (error) {
      console.error("API Error (Live Status), using mock:", error);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const data = MOCK_LIVE_STATUS[trainNumber];
      resolve(data || {
        trainNumber,
        trainName: "MOCK EXPRESS",
        startDate: format(new Date(), "yyyy-MM-dd"),
        currentStation: "MOCK STATION",
        currentStatus: "Running on time",
        stations: []
      });
    }, 1000);
  });
};

export const getTrainSchedule = async (trainNumber: string): Promise<TrainSchedule> => {
  if (RAPID_API_KEY) {
    try {
      const data = await fetchFromRapidAPI("api/v1/getTrainSchedule", { trainNo: trainNumber });
      if (data && data.data) {
        return {
          trainNumber: data.data.train_number,
          trainName: data.data.train_name,
          daysRunning: data.data.run_days,
          stations: data.data.route.map((s: any) => ({
            stationCode: s.station_code,
            stationName: s.station_name,
            arrivalTime: s.scharr,
            departureTime: s.schdep,
            haltTime: s.halt,
            distance: s.distance,
            day: s.day,
            platform: s.platform
          }))
        };
      }
    } catch (error) {
      console.error("API Error (Schedule), using mock:", error);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SCHEDULE[trainNumber] || MOCK_SCHEDULE["12951"]);
    }, 1000);
  });
};

export const getFare = async (trainNumber: string, from: string, to: string, classType: string): Promise<FareDetails> => {
  if (RAPID_API_KEY) {
    try {
      const data = await fetchFromRapidAPI("api/v2/getFare", {
        trainNo: trainNumber,
        fromStationCode: from,
        toStationCode: to,
        classType: classType,
        quota: "GN" // Default to General
      });
      
      if (data && data.data) {
        return {
          baseFare: data.data.base_fare,
          reservationCharge: data.data.reservation_charge,
          superfastCharge: data.data.superfast_charge,
          totalFare: data.data.total_fare,
          currency: "INR",
          classType: classType
        };
      }
    } catch (error) {
      console.error("API Error (Fare), using mock:", error);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FARE);
    }, 1000);
  });
};

export const getSeatAvailability = async (trainNumber: string, from: string, to: string, classType: string, date: Date): Promise<SeatAvailability[]> => {
  if (RAPID_API_KEY) {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const data = await fetchFromRapidAPI("api/v1/checkSeatAvailability", {
        trainNo: trainNumber,
        fromStationCode: from,
        toStationCode: to,
        classType: classType,
        quota: "GN",
        date: dateStr
      });
      
      if (data && data.data) {
        return data.data.map((item: any) => ({
          date: item.date,
          status: item.current_status,
          ticketFare: item.ticket_fare
        }));
      }
    } catch (error) {
      console.error("API Error (Seats), using mock:", error);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SEAT_AVAILABILITY);
    }, 1000);
  });
};
