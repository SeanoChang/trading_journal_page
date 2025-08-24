import type { JournalEntry, JournalTag, Trade } from "@prisma/client";

export type JournalEntryWithTags = JournalEntry & {
  tags: JournalTag[];
  trades: Pick<Trade, 'id' | 'pair' | 'side' | 'orderStatus'>[];
};

export interface Node extends JournalEntryWithTags {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  degree: number;
  radius: number;
}

export interface Link {
  source: string | Node;
  target: string | Node;
  weight: number;
  kind: "tag" | "mood" | "date";
  distance: number;
}

export interface GraphDimensions {
  width: number;
  height: number;
}

export interface GraphFilters {
  linkMode: "tag" | "mood" | "date" | "all";
  search: string;
}