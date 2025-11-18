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
  type: "audio" | "note" | "visit" | "cta" | "image";
  content: string; // Text content or audio/image URL
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
  const types: Interaction["type"][] = ["audio", "note", "visit", "cta", "image"];
  const interactions: Interaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const date = subDays(new Date(), Math.floor(Math.random() * 30));
    
    let content = "";
    let duration = undefined;
    
    switch (type) {
      case "audio":
        content = "Nota de áudio sobre a reunião com o secretário.";
        duration = "2:34";
        break;
      case "note":
        content = "Liguei para o gabinete do prefeito, deixei recado com o assistente. Preciso retornar na próxima terça-feira.";
        break;
      case "visit":
        content = "Visitei a prefeitura. O projeto de infraestrutura foi aprovado, mas aguarda alocação orçamentária.";
        break;
      case "cta":
        content = "Enviar a proposta atualizada com as novas taxas de desconto.";
        break;
      case "image":
        content = `https://picsum.photos/seed/${Math.random()}/800/600`;
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
    nextAction: "Apresentar proposta de orçamento",
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
    nextAction: "Agendar reunião com o Prefeito",
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
    nextAction: "Discussão de renovação de contrato",
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
    nextAction: "Contato inicial",
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
    nextAction: "Finalizar termos",
    portfolioOwner: "rep-1",
    interactions: generateInteractions(6)
  }
];
