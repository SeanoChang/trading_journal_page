"use client";
import { useState, useRef } from "react";
import type { Idea, LinkMode } from "../../types/ideas-graph";
import {
  useGraphData,
  useGraphInteraction,
  useDimensions,
} from "../../hooks/ideas-graph";
import { GraphControlPanel, GraphCanvas } from "./graph";
import { ContextMenu } from "./graph/ContextMenu";

export default function IdeasGraph({ ideas }: { ideas: Idea[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // UI State
  const [linkMode, setLinkMode] = useState<LinkMode>("all");
  const [search, setSearch] = useState("");
  const [showTags, setShowTags] = useState(true);
  const [isTimelineMode, setIsTimelineMode] = useState(false);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    node: any;
    position: { x: number; y: number };
  } | null>(null);

  // Custom hooks
  const dimensions = useDimensions(containerRef);
  const graphData = useGraphData(ideas, showTags);
  const { findNodeAtPosition, getConnectedNodes } = useGraphInteraction(
    graphData.nodes,
    graphData.links,
    dimensions,
  );

  // Handlers
  const handleTickerFilter = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker],
    );
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleFilterByType = (type: string) => {
    if (type.startsWith("ticker:")) {
      const ticker = type.replace("ticker:", "");
      handleTickerFilter(ticker);
    } else {
      setSearch(type);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 w-full h-screen"
    >
      <GraphCanvas
        ref={canvasRef}
        nodes={graphData.nodes}
        links={graphData.links}
        dimensions={dimensions}
        search={search}
        linkMode={linkMode}
        isTimelineMode={isTimelineMode}
        findNodeAtPosition={findNodeAtPosition}
        getConnectedNodes={getConnectedNodes}
      />

      <GraphControlPanel
        search={search}
        onSearchChange={setSearch}
        isTimelineMode={isTimelineMode}
        onTimelineModeChange={setIsTimelineMode}
        showTags={showTags}
        onShowTagsChange={setShowTags}
        linkMode={linkMode}
        onLinkModeChange={setLinkMode}
        nodes={graphData.nodes}
        links={graphData.links}
        selectedTickers={selectedTickers}
        onTickerFilter={handleTickerFilter}
      />

      <ContextMenu
        node={contextMenu?.node}
        position={contextMenu?.position || null}
        onClose={handleContextMenuClose}
        onFilterByType={handleFilterByType}
        onCopyContent={handleCopyContent}
      />
    </div>
  );
}
