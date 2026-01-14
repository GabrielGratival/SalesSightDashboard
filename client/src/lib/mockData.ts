import { format, subDays, subHours, addDays } from "date-fns";

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
  temperature?: 'cold' | 'warm' | 'hot';
  isPriority?: boolean;
  mayor?: string;
  viceMayor?: string;
  educationSecretary?: string;
  educationSpending?: string;
  isInVAAR?: boolean;
  nextVisit?: Date;
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
        content = "Liguei para o gabinete do prefeito, deixei recado com o assistente.";
        break;
      case "visit":
        content = "Visitei a prefeitura. O projeto foi discutido.";
        break;
      case "cta":
        content = "Enviar proposta atualizada.";
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
  
  return interactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

const BRAZILIAN_CITIES = [
  { name: "Sertãozinho", state: "SP" }, { name: "Jaboticabal", state: "SP" }, { name: "Bebedouro", state: "SP" },
  { name: "Batatais", state: "SP" }, { name: "Franca", state: "SP" }, { name: "Araraquara", state: "SP" },
  { name: "São Carlos", state: "SP" }, { name: "Matão", state: "SP" }, { name: "Catanduva", state: "SP" },
  { name: "Barretos", state: "SP" }, { name: "Olímpia", state: "SP" }, { name: "Piracicaba", state: "SP" },
  { name: "Limeira", state: "SP" }, { name: "Americana", state: "SP" }, { name: "Sumaré", state: "SP" },
  { name: "Hortolândia", state: "SP" }, { name: "Indaiatuba", state: "SP" }, { name: "Itu", state: "SP" },
  { name: "Salto", state: "SP" }, { name: "Jundiaí", state: "SP" }, { name: "Vinhedo", state: "SP" },
  { name: "Valinhos", state: "SP" }, { name: "Louveira", state: "SP" }, { name: "Itatiba", state: "SP" },
  { name: "Atibaia", state: "SP" }, { name: "Bragança Paulista", state: "SP" }, { name: "Mairiporã", state: "SP" },
  { name: "Guarulhos", state: "SP" }, { name: "Osasco", state: "SP" }, { name: "Barueri", state: "SP" },
  { name: "Santana de Parnaíba", state: "SP" }, { name: "Itapevi", state: "SP" }, { name: "Cotia", state: "SP" },
  { name: "Taboão da Serra", state: "SP" }, { name: "Embu das Artes", state: "SP" }, { name: "Itapecerica da Serra", state: "SP" },
  { name: "Santo André", state: "SP" }, { name: "São Bernardo do Campo", state: "SP" }, { name: "São Caetano do Sul", state: "SP" },
  { name: "Diadema", state: "SP" }, { name: "Mauá", state: "SP" }, { name: "Ribeirão Pires", state: "SP" }
];

export const mockCities: City[] = (() => {
  const cities: City[] = [];
  const today = startOfDay(new Date());

  // Generate 5 cities per day for 7 days
  for (let day = 0; day < 7; day++) {
    for (let i = 0; i < 5; i++) {
      const cityIdx = day * 5 + i;
      const data = BRAZILIAN_CITIES[cityIdx] || { name: `Cidade ${cityIdx}`, state: "SP" };
      cities.push({
        id: `city-${cityIdx}`,
        name: data.name,
        state: data.state,
        population: Math.floor(Math.random() * 500000) + 20000,
        currentStatus: CRM_STATUSES[Math.floor(Math.random() * CRM_STATUSES.length)],
        lastVisit: subDays(new Date(), Math.floor(Math.random() * 30)),
        nextVisit: addDays(today, day),
        portfolioOwner: "rep-1",
        interactions: generateInteractions(Math.floor(Math.random() * 5) + 1),
        temperature: (['hot', 'warm', 'cold'] as const)[Math.floor(Math.random() * 3)],
        isPriority: Math.random() > 0.7,
        isInVAAR: Math.random() > 0.5
      });
    }
  }

  // Add some unscheduled cities
  for (let i = 0; i < 10; i++) {
    const idx = 35 + i;
    const data = BRAZILIAN_CITIES[idx] || { name: `Cidade Extra ${i}`, state: "SP" };
    cities.push({
      id: `city-unscheduled-${i}`,
      name: data.name,
      state: data.state,
      population: Math.floor(Math.random() * 100000) + 10000,
      currentStatus: CRM_STATUSES[Math.floor(Math.random() * CRM_STATUSES.length)],
      lastVisit: subDays(new Date(), Math.floor(Math.random() * 60)),
      nextVisit: undefined,
      portfolioOwner: "rep-1",
      interactions: generateInteractions(1),
      temperature: 'cold',
      isPriority: false,
      isInVAAR: false
    });
  }

  return cities;
})();

function startOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export const mockSalesReps: SalesRep[] = [
  {
    id: "rep-1",
    name: "Carlos Silva",
    email: "carlos@company.com",
    avatar: "https://i.pravatar.cc/150?u=carlos"
  }
];
