"use client";
import { useMemo } from "react";
import { Chip } from "@heroui/react";
import { FiCalendar, FiTag } from "react-icons/fi";
import { Idea } from "../../types/ideas-graph";

export default function IdeasListView({ ideas }: { ideas: Idea[] }) {
  // Group ideas by date
  const timelineGroups = useMemo(() => {
    const groups = new Map<string, Idea[]>();
    
    // Sort ideas by creation date (newest first)
    const sortedIdeas = [...ideas].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sortedIdeas.forEach((idea) => {
      const dateKey = new Date(idea.createdAt).toDateString();
      const existing = groups.get(dateKey) || [];
      groups.set(dateKey, [...existing, idea]);
    });

    return Array.from(groups.entries()).map(([date, ideas]) => ({
      date,
      ideas: ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }));
  }, [ideas]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
      
      <div className="space-y-8">
        {timelineGroups.map((group, groupIndex) => (
          <div key={group.date} className="relative">
            {/* Date header */}
            <div className="relative flex items-center mb-4">
              <div className="absolute left-6 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 transform -translate-x-1/2"></div>
              <div className="ml-12 flex items-center gap-2">
                <FiCalendar className="h-4 w-4 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(group.date)}
                </h3>
                <Chip size="sm" variant="flat" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {group.ideas.length} {group.ideas.length === 1 ? 'entry' : 'entries'}
                </Chip>
              </div>
            </div>

            {/* Timeline entries for this date */}
            <div className="space-y-4">
              {group.ideas.map((idea, ideaIndex) => {
                const animationDelay = `${(groupIndex * 200) + (ideaIndex * 100)}ms`;
                return (
                  <div 
                    key={idea.id} 
                    className="relative ml-12 animate-in fade-in-0 slide-in-from-left-2"
                    style={{ animationDelay }}
                  >
                    {/* Timeline connector dot */}
                    <div className="absolute -left-6 top-4 w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transform -translate-x-1/2"></div>
                    
                    {/* Card */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-1">
                            {idea.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{formatTime(idea.createdAt)}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                              {idea.topic}
                            </span>
                            {idea.winrate && (
                              <>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  idea.winrate >= 60 
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : idea.winrate >= 50
                                    ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                }`}>
                                  {idea.winrate}% win rate
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-3 leading-relaxed">
                        {idea.content}
                      </p>

                      {/* Tags and Trades */}
                      <div className="space-y-2">
                        {idea.tags && idea.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <FiTag className="h-3 w-3 text-slate-400" />
                            {idea.tags.map((tag, tagIndex) => (
                              <Chip 
                                key={tag} 
                                size="sm" 
                                variant="flat"
                                className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 animate-in fade-in-0 slide-in-from-bottom-1"
                                style={{ animationDelay: `${parseInt(animationDelay) + (tagIndex * 50)}ms` }}
                              >
                                {tag}
                              </Chip>
                            ))}
                          </div>
                        )}
                        {idea.trades && idea.trades.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-emerald-600 text-sm">📈</span>
                            {idea.trades.map((trade, tradeIndex) => (
                              <Chip 
                                key={trade} 
                                size="sm" 
                                variant="flat"
                                className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 animate-in fade-in-0 slide-in-from-bottom-1"
                                style={{ animationDelay: `${parseInt(animationDelay) + 200 + (tradeIndex * 50)}ms` }}
                              >
                                {trade}
                              </Chip>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {timelineGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-2">
              <FiCalendar className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">No entries yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Start journaling to see your timeline</p>
          </div>
        )}
      </div>
    </div>
  );
}

