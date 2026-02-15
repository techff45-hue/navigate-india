export type PersonaMode = "local" | "traveler" | "accessible" | "deaf";

export interface Station {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
}

export interface Facility {
  id: string;
  name: string;
  type: "platform" | "restroom" | "food" | "atm" | "ramp" | "helpdesk" | "waiting" | "bench" | "elevator";
  lat: number;
  lng: number;
  description: string;
  crowdLevel: "low" | "medium" | "high";
  accessible: boolean;
  floor: number;
}

export interface Train {
  number: string;
  name: string;
  platform: number;
  arrival: string;
  departure: string;
  delay: number; // minutes
  status: "On Time" | "Delayed" | "Arrived" | "Departed";
}

export const stations: Station[] = [
  { id: "ndls", name: "New Delhi Railway Station", code: "NDLS", lat: 28.6425, lng: 77.2193 },
  { id: "hwh", name: "Howrah Junction", code: "HWH", lat: 22.5836, lng: 88.3425 },
  { id: "bct", name: "Mumbai Central", code: "BCT", lat: 18.9692, lng: 72.8198 },
  { id: "mas", name: "Chennai Central", code: "MAS", lat: 13.0827, lng: 80.2752 },
  { id: "sbc", name: "Bangalore City Junction", code: "SBC", lat: 12.9784, lng: 77.5710 },
];

export const ndlsFacilities: Facility[] = [
  { id: "p1", name: "Platform 1", type: "platform", lat: 28.6430, lng: 77.2190, description: "Main platform for Rajdhani Express", crowdLevel: "high", accessible: true, floor: 0 },
  { id: "p2", name: "Platform 2", type: "platform", lat: 28.6428, lng: 77.2195, description: "Shatabdi Express platform", crowdLevel: "medium", accessible: true, floor: 0 },
  { id: "p3", name: "Platform 3", type: "platform", lat: 28.6426, lng: 77.2200, description: "General trains", crowdLevel: "low", accessible: true, floor: 0 },
  { id: "p4", name: "Platform 4", type: "platform", lat: 28.6424, lng: 77.2185, description: "Duronto Express platform", crowdLevel: "medium", accessible: true, floor: 0 },
  { id: "p5", name: "Platform 5", type: "platform", lat: 28.6422, lng: 77.2180, description: "Garib Rath platform", crowdLevel: "low", accessible: false, floor: 0 },
  { id: "r1", name: "Restroom A (Main Hall)", type: "restroom", lat: 28.6427, lng: 77.2192, description: "Male/Female/Accessible restrooms near main entrance", crowdLevel: "medium", accessible: true, floor: 0 },
  { id: "r2", name: "Restroom B (Platform 3)", type: "restroom", lat: 28.6425, lng: 77.2202, description: "Basic restroom facilities", crowdLevel: "low", accessible: false, floor: 0 },
  { id: "f1", name: "Jan Aahar Food Stall", type: "food", lat: 28.6429, lng: 77.2188, description: "Affordable meals - Thali ₹30", crowdLevel: "high", accessible: true, floor: 0 },
  { id: "f2", name: "IRCTC Food Plaza", type: "food", lat: 28.6431, lng: 77.2197, description: "Multi-cuisine food court", crowdLevel: "medium", accessible: true, floor: 1 },
  { id: "a1", name: "SBI ATM", type: "atm", lat: 28.6433, lng: 77.2191, description: "24/7 ATM near main entrance", crowdLevel: "low", accessible: true, floor: 0 },
  { id: "rmp1", name: "Main Ramp", type: "ramp", lat: 28.6426, lng: 77.2188, description: "Wheelchair accessible ramp to all platforms", crowdLevel: "low", accessible: true, floor: 0 },
  { id: "hd1", name: "Help Desk", type: "helpdesk", lat: 28.6428, lng: 77.2190, description: "Station master and assistance counter", crowdLevel: "medium", accessible: true, floor: 0 },
  { id: "w1", name: "AC Waiting Room", type: "waiting", lat: 28.6430, lng: 77.2185, description: "Air-conditioned waiting area with charging points", crowdLevel: "low", accessible: true, floor: 1 },
  { id: "b1", name: "Seating Area (Platform 1)", type: "bench", lat: 28.6432, lng: 77.2192, description: "Covered bench seating", crowdLevel: "medium", accessible: true, floor: 0 },
  { id: "e1", name: "Elevator A", type: "elevator", lat: 28.6427, lng: 77.2194, description: "Elevator connecting platforms to overbridge", crowdLevel: "low", accessible: true, floor: 0 },
];

export const ndlsTrains: Train[] = [
  { number: "12301", name: "Howrah Rajdhani", platform: 1, arrival: "16:55", departure: "17:05", delay: 0, status: "On Time" },
  { number: "12002", name: "Bhopal Shatabdi", platform: 2, arrival: "22:30", departure: "--", delay: 15, status: "Delayed" },
  { number: "12951", name: "Mumbai Rajdhani", platform: 1, arrival: "08:35", departure: "08:50", delay: 0, status: "Arrived" },
  { number: "12259", name: "Sealdah Duronto", platform: 4, arrival: "12:40", departure: "12:55", delay: 5, status: "Delayed" },
  { number: "12615", name: "Grand Trunk Express", platform: 3, arrival: "06:45", departure: "07:00", delay: 0, status: "Departed" },
  { number: "12310", name: "Rajdhani Express", platform: 5, arrival: "19:15", departure: "19:30", delay: 0, status: "On Time" },
  { number: "12424", name: "Dibrugarh Rajdhani", platform: 2, arrival: "10:55", departure: "11:10", delay: 30, status: "Delayed" },
  { number: "12560", name: "Shatabdi Express", platform: 3, arrival: "14:20", departure: "14:35", delay: 0, status: "On Time" },
];

export const facilityIcons: Record<Facility["type"], string> = {
  platform: "🚂",
  restroom: "🚻",
  food: "🍽️",
  atm: "🏧",
  ramp: "♿",
  helpdesk: "ℹ️",
  waiting: "🪑",
  bench: "💺",
  elevator: "🛗",
};

export const signLanguagePhrases = [
  { phrase: "Where is the toilet?", hindi: "शौचालय कहाँ है?" },
  { phrase: "Which platform?", hindi: "कौन सा प्लेटफ़ॉर्म?" },
  { phrase: "Ticket Checker", hindi: "टिकट चेकर" },
  { phrase: "Help me please", hindi: "कृपया मेरी मदद करें" },
  { phrase: "Where is the exit?", hindi: "बाहर कहाँ है?" },
  { phrase: "I need water", hindi: "मुझे पानी चाहिए" },
];
