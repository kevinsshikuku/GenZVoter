export interface RegistrationCentre {
  id: string;
  name: string;
  county: string;
  constituency: string;
  ward?: string;
  address: string;
  /** Primary landmark — short map hint shown as pill */
  landmark?: string;
  /** Additional nearby landmarks for richer search matching */
  nearbyLandmarks?: string[];
  status: "open" | "closed" | "seasonal";
  hours?: string;
  phone?: string;
  /** Tier of the registration centre */
  type: "constituency" | "ward" | "dynamic";
  /** Approx. daily registration capacity */
  capacity?: number;
  /** Services available at this centre beyond basic registration */
  services?: string[];
  /** Extra notes shown to user (e.g. "Bring 2 passport photos") */
  notes?: string;
  /** Direct Google Maps URL for directions */
  googleMapsUrl?: string;
  /** GPS coordinates for potential map integration */
  coordinates?: { lat: number; lng: number };
  /** ISO date string — when this entry was last verified against IEBC data */
  lastVerified?: string;
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

export type BiometricSupport = "webauthn" | "pin-fallback" | "skip";

export interface BiometricState {
  committed: boolean;
  method: BiometricSupport | null;
  credentialId: string | null;
}

// ── M-Pesa verification types ────────────────────────────────────────────────

export type MpesaStep = "idle" | "phone-input" | "waiting" | "success" | "error";
