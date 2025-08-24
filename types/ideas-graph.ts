export interface Idea {
  id: string;
  title: string;
  topic: string;
  tags: string[];
  content?: string;
  trades?: string[];
  createdAt: string;
  winrate?: number;
  strategy?: string;
  tickers?: string[];
  type?: 'investment' | 'regular';
}

export interface IdeaNode extends Idea {
  type: 'idea';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  degree: number;
  radius: number;
  age: number;
}

export interface TagNode {
  id: string;
  type: 'tag';
  name: string;
  parent?: string;
  level: number;
  count: number;
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export type Node = IdeaNode | TagNode;

export interface Link {
  source: string | Node;
  target: string | Node;
  weight: number;
  kind: "topic" | "tag" | "strategy" | "temporal" | "hierarchy" | "ticker";
  distance: number;
  strength: number;
  age?: number;
}

export interface GraphDimensions {
  width: number;
  height: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
  tagHierarchy: TagNode[];
  topics: string[];
}

export interface GraphFilters {
  linkMode: LinkMode;
  search: string;
}

export type LinkMode = "all" | "temporal" | "conceptual" | "hierarchy" | "ticker";

export interface ParsedTag {
  name: string;
  parent?: string;
  level: number;
}