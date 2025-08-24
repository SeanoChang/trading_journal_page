export interface Idea {
  id: string;
  title: string;
  topic: string;
  tags: string[];
  strategy?: string;
}

export interface Node extends Idea {
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
  kind: "topic" | "tag" | "strategy";
  distance: number;
}

export interface GraphDimensions {
  width: number;
  height: number;
}

export interface GraphFilters {
  linkMode: "topic" | "tag" | "strategy" | "all";
  search: string;
}