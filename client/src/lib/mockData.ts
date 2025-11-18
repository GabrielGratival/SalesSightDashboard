import { format, subDays, subHours } from "date-fns";

export type CRMStatus = 
  | "Quero" 
  | "Devo" 
  | "Posso" 
  | "Quantitativo" 
  | "Prefeito" 
  | "Contrato";

export const CRM_STATUSES: CRMStatus[] = [
  "Quero",
  "Devo",
  "Posso",
  "Quantitativo",
  "Prefeito",
  "Contrato"
];

export interface Interaction {
  id: string;
  type: "audio" | "note" | "visit" | "cta";
  content: string; // Text content or audio URL
  duration?: string; // For audio
  createdAt: Date;
  author: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  population: number;
  currentStatus: CRMStatus;
  lastVisit?: Date;
  nextAction?: string;
  portfolioOwner: string; // Sales rep ID
  interactions: Interaction[];
}

export interface SalesRep {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

// Mock Data Generation

const generateInteractions = (count: number): Interaction[] => {
  const types: Interaction["type"][] = ["audio", "note", "visit", "cta"];
  const interactions: Interaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const date = subDays(new Date(), Math.floor(Math.random() * 30));
    
    let content = "";
    let duration = undefined;
    
    switch (type) {
      case "audio":
        content = "Audio note about the meeting with the secretary.";
        duration = "2:34";
        break;
      case "note":
        content = "Called the mayor's office, left a message with the assistant. Need to follow up next Tuesday.";
        break;
      case "visit":
        content = "Visited the city hall. The infrastructure project is approved but pending budget allocation.";
        break;
      case "cta":
        content = "Send the updated proposal with the new discount rates.";
        break;
    }

    interactions.push({
      id: `int-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      duration,
      createdAt: date,
      author: "Carlos Silva"
    });
  }
  
  return interactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const mockSalesReps: SalesRep[] = [
  {
    id: "rep-1",
    name: "Carlos Silva",
    email: "carlos@company.com",
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  {
    id: "rep-2",
    name: "Ana Souza",
    email: "ana@company.com",
    avatar: "https://i.pravatar.cc/150?u=ana"
  }
];

export const mockCities: City[] = [
  {
    id: "city-1",
    name: "Ribeirão Preto",
    state: "SP",
    population: 711825,
    currentStatus: "Quantitativo",
    lastVisit: subDays(new Date(), 2),
    nextAction: "Present budget proposal",
    portfolioOwner: "rep-1",
    interactions: generateInteractions(5)
  },
  {
    id: "city-2",
    name: "Campinas",
    state: "SP",
    population: 1213792,
    currentStatus: "Posso",
    lastVisit: subDays(new Date(), 15),
    nextAction: "Schedule meeting with Mayor",
    portfolioOwner: "rep-1",
    interactions: generateInteractions(3)
  },
  {
    id: "city-3",
    name: "Sorocaba",
    state: "SP",
    population: 687357,
    currentStatus: "Contrato",
    lastVisit: subDays(new Date(), 5),
    nextAction: "Contract renewal discussion",
    portfolioOwner: "rep-1",
    interactions: generateInteractions(8)
  },
  {
    id: "city-4",
    name: "São José dos Campos",
    state: "SP",
    population: 729737,
    currentStatus: "Quero",
    lastVisit: undefined,
    nextAction: "Initial outreach",
    portfolioOwner: "rep-1",
    interactions: generateInteractions(1)
  },
  {
    id: "city-5",
    name: "Santos",
    state: "SP",
    population: 433991,
    currentStatus: "Prefeito",
    lastVisit: subDays(new Date(), 1),
    nextAction: "Finalize terms",
    portfolioOwner: "rep-1",
    interactions: generateInteractions(6)
  }
];
