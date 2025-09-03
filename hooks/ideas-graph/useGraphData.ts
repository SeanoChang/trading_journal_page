import { useMemo } from "react";
import type {
  Idea,
  GraphData,
  IdeaNode,
  TagNode,
  Link,
} from "../../types/ideas-graph";
import {
  parseNestedTags,
  calculateAge,
  processJournalEntry,
} from "../../utils/ideas-graph";

export function useGraphData(ideas: Idea[], showTags: boolean): GraphData {
  return useMemo(() => {
    if (!ideas || ideas.length === 0) {
      return { nodes: [], links: [], tagHierarchy: [], topics: [] };
    }

    const links: Link[] = [];
    const tagNodes = new Map<string, TagNode>();
    const ideaNodes: IdeaNode[] = [];

    // Process ideas and calculate temporal properties
    ideas.forEach((idea) => {
      const age = calculateAge(idea.createdAt);
      const processedIdea = processJournalEntry(idea);

      const ideaNode: IdeaNode = {
        ...processedIdea,
        type: "idea",
        degree: 0,
        radius: Math.max(
          6,
          Math.min(
            12,
            6 +
              (idea.tags?.length || 0) * 0.5 +
              (processedIdea.tickers?.length || 0) * 0.8,
          ),
        ),
        age,
      };
      ideaNodes.push(ideaNode);
    });

    // Process nested tags
    const allTags = ideas.flatMap((idea) => idea.tags || []);
    const parsedTags = parseNestedTags(allTags);

    // Create tag nodes
    const tagCounts = new Map<string, number>();
    ideas.forEach((idea) => {
      (idea.tags || []).forEach((tag) => {
        const parsed = parseNestedTags([tag]);
        parsed.forEach((p) => {
          tagCounts.set(p.name, (tagCounts.get(p.name) || 0) + 1);
        });
      });
    });

    parsedTags.forEach((tag) => {
      const count = tagCounts.get(tag.name) || 0;
      if (count > 0) {
        tagNodes.set(tag.name, {
          id: `tag-${tag.name}`,
          type: "tag",
          name: tag.name,
          parent: tag.parent,
          level: tag.level,
          count,
          radius: Math.max(4, Math.min(10, 4 + count * 0.8)),
        });
      }
    });

    // Create hierarchical links between tags
    tagNodes.forEach((tagNode) => {
      if (tagNode.parent && tagNodes.has(tagNode.parent)) {
        links.push({
          source: `tag-${tagNode.parent}`,
          target: tagNode.id,
          weight: 2,
          kind: "hierarchy",
          distance: 30,
          strength: 0.8,
        });
      }
    });

    // Create links between ideas and tags
    ideaNodes.forEach((ideaNode) => {
      (ideaNode.tags || []).forEach((tag) => {
        const parsed = parseNestedTags([tag]);
        parsed.forEach((p) => {
          const tagNodeId = `tag-${p.name}`;
          if (tagNodes.has(p.name)) {
            links.push({
              source: ideaNode.id,
              target: tagNodeId,
              weight: 1,
              kind: "tag",
              distance: 40,
              strength: 0.5,
            });
          }
        });
      });
    });

    // Create temporal links (ideas created within similar timeframes)
    const sortedIdeas = [...ideaNodes].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    for (let i = 0; i < sortedIdeas.length - 1; i++) {
      const current = sortedIdeas[i];
      const next = sortedIdeas[i + 1];
      const timeDiff =
        Math.abs(
          new Date(next.createdAt).getTime() -
            new Date(current.createdAt).getTime(),
        ) /
        (1000 * 60 * 60 * 24); // days

      if (timeDiff <= 7) {
        // Within a week
        links.push({
          source: current.id,
          target: next.id,
          weight: 0.5,
          kind: "temporal",
          distance: Math.max(60, timeDiff * 10),
          strength: 0.3,
          age: Math.min(current.age, next.age),
        });
      }
    }

    // Create conceptual links (shared topics)
    const topicGroups = new Map<string, IdeaNode[]>();
    ideaNodes.forEach((node) => {
      const group = topicGroups.get(node.topic) || [];
      group.push(node);
      topicGroups.set(node.topic, group);
    });

    topicGroups.forEach((group) => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          links.push({
            source: group[i].id,
            target: group[j].id,
            weight: 1.5,
            kind: "topic",
            distance: 70,
            strength: 0.4,
          });
        }
      }
    });

    // Create ticker-based links (shared tickers)
    const tickerGroups = new Map<string, IdeaNode[]>();
    ideaNodes.forEach((node) => {
      (node.tickers || []).forEach((ticker) => {
        const group = tickerGroups.get(ticker) || [];
        group.push(node);
        tickerGroups.set(ticker, group);
      });
    });

    tickerGroups.forEach((group, ticker) => {
      if (group.length > 1) {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            links.push({
              source: group[i].id,
              target: group[j].id,
              weight: 2.0,
              kind: "ticker",
              distance: 50,
              strength: 0.6,
            });
          }
        }
      }
    });

    const allNodes = [
      ...ideaNodes,
      ...(showTags ? Array.from(tagNodes.values()) : []),
    ];

    // Calculate degrees
    const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
    links.forEach((link) => {
      const sourceId =
        typeof link.source === "string" ? link.source : link.source.id;
      const targetId =
        typeof link.target === "string" ? link.target : link.target.id;
      const source = nodeMap.get(sourceId);
      const target = nodeMap.get(targetId);
      if (source && target && source.type === "idea") {
        source.degree++;
      }
      if (source && target && target.type === "idea") {
        target.degree++;
      }
    });

    return {
      nodes: allNodes,
      links,
      tagHierarchy: Array.from(tagNodes.values()),
      topics: Array.from(new Set(ideas.map((i) => i.topic))),
    };
  }, [ideas, showTags]);
}
