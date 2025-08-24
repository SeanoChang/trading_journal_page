"use client";
import { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiFolder, FiFile } from 'react-icons/fi';
import type { ReactElement } from 'react';
import type { IdeaNode } from '../../../types/ideas-graph';

interface FolderNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children: FolderNode[];
  ideas: IdeaNode[];
  count: number;
}

interface FolderNavigationProps {
  ideas: IdeaNode[];
  onFileSelect?: (idea: IdeaNode) => void;
  onFolderFilter?: (path: string) => void;
}

export function FolderNavigation({
  ideas,
  onFileSelect,
  onFolderFilter
}: FolderNavigationProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Trading Journal']));

  const buildFolderTree = (ideas: IdeaNode[]): FolderNode[] => {
    const root: FolderNode = {
      name: 'Trading Journal',
      path: '',
      type: 'folder',
      children: [],
      ideas: [],
      count: ideas.length
    };

    // Group ideas by topic to simulate folder structure
    const topicGroups = new Map<string, IdeaNode[]>();
    ideas.forEach(idea => {
      const group = topicGroups.get(idea.topic) || [];
      group.push(idea);
      topicGroups.set(idea.topic, group);
    });

    // Create topic folders
    topicGroups.forEach((topicIdeas, topic) => {
      const topicFolder: FolderNode = {
        name: topic,
        path: topic,
        type: 'folder',
        children: [],
        ideas: topicIdeas,
        count: topicIdeas.length
      };

      // Group by tags within topic for sub-folders
      const tagGroups = new Map<string, IdeaNode[]>();
      topicIdeas.forEach(idea => {
        if (idea.tags && idea.tags.length > 0) {
          idea.tags.forEach(tag => {
            const group = tagGroups.get(tag) || [];
            group.push(idea);
            tagGroups.set(tag, group);
          });
        } else {
          const group = tagGroups.get('General') || [];
          group.push(idea);
          tagGroups.set('General', group);
        }
      });

      // Create tag sub-folders
      tagGroups.forEach((tagIdeas, tag) => {
        if (tagIdeas.length > 1) {
          topicFolder.children.push({
            name: tag,
            path: `${topic}/${tag}`,
            type: 'folder',
            children: [],
            ideas: tagIdeas,
            count: tagIdeas.length
          });
        }
      });

      root.children.push(topicFolder);
    });

    return [root];
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFolderNode = (node: FolderNode, level: number = 0): ReactElement => {
    const isExpanded = expandedFolders.has(node.path || node.name);
    const hasChildren = node.children.length > 0;
    
    return (
      <div key={node.path || node.name} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleFolder(node.path || node.name);
            }
            if (node.path) {
              onFolderFilter?.(node.path);
            }
          }}
        >
          {hasChildren && (
            <span className="text-slate-400">
              {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          
          <span className="text-slate-400">
            {node.type === 'folder' ? <FiFolder className="w-4 h-4" /> : <FiFile className="w-4 h-4" />}
          </span>
          
          <span className="text-sm font-medium flex-1 truncate">{node.name}</span>
          
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({node.count})
          </span>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderFolderNode(child, level + 1))}
            
            {/* Show individual ideas if folder is leaf or has few children */}
            {(node.children.length < 3 || node.ideas.length <= 5) && node.ideas.map(idea => (
              <div
                key={idea.id}
                className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
                onClick={() => onFileSelect?.(idea)}
              >
                <FiFile className="w-3 h-3 text-slate-400" />
                <span className="text-xs truncate flex-1" title={idea.title}>
                  {idea.title}
                </span>
                {idea.tickers && idea.tickers.length > 0 && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {idea.tickers.slice(0, 2).map(t => `$${t}`).join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const folderTree = buildFolderTree(ideas);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-2 py-2 border-b border-slate-200 dark:border-slate-700">
        <FiFolder className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-semibold">Navigation</h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {folderTree.map(node => renderFolderNode(node))}
      </div>
    </div>
  );
}