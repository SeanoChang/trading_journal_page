export interface Idea {
  id: string;
  title: string;
  content: string;
  topic: string; // e.g., Breakout, Journal, etc.
  tags: string[];
  trades?: string[];
  createdAt: string;
  strategy?: string;
  winrate?: number;
}

export interface TagNode {
  id: string;
  type: "tag";
  name: string;
  parent?: string;
  level: number;
  count: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  radius: number;
}

export interface IdeaNode extends Idea {
  type: "idea";
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  degree: number;
  radius: number;
  age: number; // days since creation
}

export type Node = IdeaNode | TagNode;

export interface Link {
  source: string | Node;
  target: string | Node;
  weight: number;
  kind: "topic" | "tag" | "strategy" | "temporal" | "hierarchy" | "ticker";
  distance: number;
  strength: number;
  age?: number; // for temporal links
}

export type LinkMode =
  | "all"
  | "temporal"
  | "conceptual"
  | "hierarchy"
  | "ticker";

export interface GraphData {
  nodes: Node[];
  links: Link[];
  tagHierarchy: TagNode[];
  topics: string[];
}

export interface GraphDimensions {
  width: number;
  height: number;
}

export interface GraphState {
  linkMode: LinkMode;
  search: string;
  dimensions: GraphDimensions;
  showTags: boolean;
  isTimelineMode: boolean;
}

export interface ParsedTag {
  name: string;
  parent?: string;
  level: number;
}

export interface LinkStyle {
  color: string;
  width: number;
  alpha: number;
}
