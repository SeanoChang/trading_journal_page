"use client";
import { Button } from "@heroui/react";
import { FiSearch, FiClock, FiTag, FiTrendingUp } from "react-icons/fi";
import type { LinkMode, Node, Link, IdeaNode } from "../../../types/ideas-graph";
import { getTickerStats } from "../../../utils/ideas-graph";
import { FolderNavigation } from "./FolderNavigation";

interface GraphControlPanelProps {
  search: string;
  onSearchChange: (search: string) => void;
  isTimelineMode: boolean;
  onTimelineModeChange: (enabled: boolean) => void;
  showTags: boolean;
  onShowTagsChange: (enabled: boolean) => void;
  linkMode: LinkMode;
  onLinkModeChange: (mode: LinkMode) => void;
  nodes: Node[];
  links: Link[];
  selectedTickers?: string[];
  onTickerFilter?: (ticker: string) => void;
  onFileSelect?: (idea: IdeaNode) => void;
  onFolderFilter?: (path: string) => void;
}

export function GraphControlPanel({
  search,
  onSearchChange,
  isTimelineMode,
  onTimelineModeChange,
  showTags,
  onShowTagsChange,
  linkMode,
  onLinkModeChange,
  nodes,
  links,
  selectedTickers = [],
  onTickerFilter,
  onFileSelect,
  onFolderFilter
}: GraphControlPanelProps) {
  const ideaNodes = nodes.filter((n): n is IdeaNode => n.type === 'idea');
  const tickerStats = getTickerStats(ideaNodes);
  return (
    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg space-y-3 min-w-64">
      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search ideas, tags, topics..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isTimelineMode ? "solid" : "flat"}
          onPress={() => onTimelineModeChange(!isTimelineMode)}
          className="flex-1"
          startContent={<FiClock />}
        >
          Timeline
        </Button>
        <Button
          size="sm"
          variant={showTags ? "solid" : "flat"}
          onPress={() => onShowTagsChange(!showTags)}
          className="flex-1"
          startContent={<FiTag />}
        >
          Tags
        </Button>
      </div>
      
      {/* Node Type Filters */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Show Node Types</label>
        <div className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="flat"
            className="text-xs"
            startContent={<span className="w-2 h-2 rounded-full bg-blue-500" />}
          >
            Ideas ({ideaNodes.length})
          </Button>
          <Button
            size="sm"
            variant={showTags ? "solid" : "flat"}
            onPress={() => onShowTagsChange(!showTags)}
            className="text-xs"
            startContent={<span className="w-2 h-2 rounded-full bg-green-500" />}
          >
            Tags ({nodes.filter(n => n.type === 'tag').length})
          </Button>
        </div>
      </div>
      
      {/* Link Mode Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Connection Types</label>
        <div className="grid grid-cols-2 gap-1">
          {(['all', 'temporal', 'conceptual', 'hierarchy', 'ticker'] as const).map(mode => (
            <Button
              key={mode}
              size="sm"
              variant={linkMode === mode ? "solid" : "flat"}
              onPress={() => onLinkModeChange(mode)}
              className="text-xs capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Ticker Filter */}
      {tickerStats.size > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="h-4 w-4" />
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Investment Focus</label>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {Array.from(tickerStats.entries())
              .sort((a, b) => b[1].frequency - a[1].frequency)
              .slice(0, 8)
              .map(([ticker, stats]) => (
                <button
                  key={ticker}
                  onClick={() => onTickerFilter?.(ticker)}
                  className={`w-full text-left text-xs px-2 py-1 rounded flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                    selectedTickers.includes(ticker) 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${stats.type === 'crypto' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    ${ticker}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">({stats.frequency})</span>
                </button>
              ))}
          </div>
        </div>
      )}
      
      {/* Folder Navigation */}
      <FolderNavigation
        ideas={ideaNodes}
        onFileSelect={onFileSelect}
        onFolderFilter={onFolderFilter}
      />
      
      {/* Stats */}
      <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
        <div>{nodes.filter(n => n.type === 'idea').length} ideas</div>
        <div>{nodes.filter(n => n.type === 'tag').length} tags</div>
        <div>{links.length} connections</div>
        {tickerStats.size > 0 && <div>{tickerStats.size} tickers</div>}
      </div>
    </div>
  );
}
