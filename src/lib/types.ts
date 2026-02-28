export interface RegistrationCentre {
  id: string;
  name: string;
  county: string;
  constituency: string;
  ward?: string;
  address: string;
  landmark?: string;       // Very short description or map hint
  status: "open" | "closed" | "seasonal";
  hours?: string;
  phone?: string;
  /** Tier of the registration centre */
  type: "constituency" | "ward" | "dynamic";
}

export interface MythCard {
  id: string;
  myth: string;
  reality: string;
  stat?: string;
  emoji: string;
}

export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  steps: string[];
  emoji: string;
  xp: number;
  badge: string;
  note?: string;
}

export interface IEBCRegistrationPeriod {
  phase: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
}
