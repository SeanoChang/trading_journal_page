export type Tp = { price: number; sizePct: number };

export type Execution = {
  avgEntry?: number;
  avgExit?: number;
  realizedR?: number;
  stuckToPlan?: boolean;
  notes?: string;
};

export type Trade = {
  id: string;
  date: string; // ISO date
  pair: string;
  direction: "long" | "short";
  plannedEntry: number;
  plannedStop: number; // invalidation
  plannedSizePct: number; // 0-100 of account risked or size applied (user-defined)
  plannedTPs: Tp[];
  plannedNotes?: string;
  status: "planned" | "executed";
  exec?: Execution;
};

