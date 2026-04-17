export type FireStatus = 'suspected' | 'confirmed' | 'extinguished';
export type FireLevel = 'I' | 'II' | 'III' | 'IV';
export type ResourceType = 'team' | 'equipment' | 'supply' | 'facility';

export interface FirePoint {
  id: string;
  name: string;
  status: FireStatus;
  level: FireLevel;
  location: [number, number];
  area: number;
  startTime: string;
  duration: string;
  description: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: ResourceType;
  status: 'available' | 'busy' | 'offline';
  location: [number, number];
  details: {
    count?: number;
    equipment?: string[];
    items?: { name: string; quantity: number; unit: string }[];
  };
}

export interface UAVPatrol {
  id: string;
  route: string;
  coverage: number;
  hazardsFound: number;
  date: string;
}
