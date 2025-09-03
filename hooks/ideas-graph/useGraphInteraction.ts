import { useCallback } from "react";
import type { Node, Link, GraphDimensions } from "../../types/ideas-graph";

export function useGraphInteraction(
  nodes: Node[],
  links: Link[],
  dimensions: GraphDimensions,
) {
  // Helper function to find node at coordinates
  const findNodeAtPosition = useCallback(
    (x: number, y: number, transform: any) => {
      const simX = (x - dimensions.width / 2 - transform.x) / transform.k;
      const simY = (y - dimensions.height / 2 - transform.y) / transform.k;

      return nodes.find((node) => {
        if (node.x === undefined || node.y === undefined) return false;
        const dx = node.x - simX;
        const dy = node.y - simY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= node.radius;
      });
    },
    [nodes, dimensions],
  );

  // Get connected nodes for highlighting
  const getConnectedNodes = useCallback(
    (nodeId: string): Set<string> => {
      const connected = new Set<string>();
      links.forEach((link) => {
        const sourceId =
          typeof link.source === "string" ? link.source : link.source.id;
        const targetId =
          typeof link.target === "string" ? link.target : link.target.id;
        if (sourceId === nodeId) connected.add(targetId);
        if (targetId === nodeId) connected.add(sourceId);
      });
      return connected;
    },
    [links],
  );

  return {
    findNodeAtPosition,
    getConnectedNodes,
  };
}
