"use client";
import { useEffect, useRef } from 'react';
import { FiEye, FiEyeOff, FiFilter, FiSearch, FiCopy, FiExternalLink } from 'react-icons/fi';
import type { Node, IdeaNode } from '../../../types/ideas-graph';

interface ContextMenuProps {
  node: Node | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onHideNode?: (nodeId: string) => void;
  onIsolateNode?: (nodeId: string) => void;
  onFilterByType?: (type: string) => void;
  onFindSimilar?: (nodeId: string) => void;
  onCopyContent?: (content: string) => void;
}

export function ContextMenu({
  node,
  position,
  onClose,
  onHideNode,
  onIsolateNode,
  onFilterByType,
  onFindSimilar,
  onCopyContent
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Element)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!node || !position) return null;

  const menuItems = [];

  if (node.type === 'idea') {
    const ideaNode = node as IdeaNode;
    
    menuItems.push({
      icon: <FiEye className="w-4 h-4" />,
      label: 'Isolate neighborhood',
      onClick: () => {
        onIsolateNode?.(node.id);
        onClose();
      }
    });

    menuItems.push({
      icon: <FiEyeOff className="w-4 h-4" />,
      label: 'Hide this node',
      onClick: () => {
        onHideNode?.(node.id);
        onClose();
      }
    });

    menuItems.push({
      icon: <FiFilter className="w-4 h-4" />,
      label: `Show only ${ideaNode.topic} ideas`,
      onClick: () => {
        onFilterByType?.(ideaNode.topic);
        onClose();
      }
    });

    if (ideaNode.tickers && ideaNode.tickers.length > 0) {
      menuItems.push({
        icon: <FiFilter className="w-4 h-4" />,
        label: `Filter by ${ideaNode.tickers[0]}`,
        onClick: () => {
          onFilterByType?.(`ticker:${ideaNode.tickers![0]}`);
          onClose();
        }
      });
    }

    menuItems.push({
      icon: <FiSearch className="w-4 h-4" />,
      label: 'Find similar ideas',
      onClick: () => {
        onFindSimilar?.(node.id);
        onClose();
      }
    });

    menuItems.push({
      icon: <FiCopy className="w-4 h-4" />,
      label: 'Copy title',
      onClick: () => {
        onCopyContent?.(ideaNode.title);
        onClose();
      }
    });

    if (ideaNode.content) {
      menuItems.push({
        icon: <FiCopy className="w-4 h-4" />,
        label: 'Copy content',
        onClick: () => {
          onCopyContent?.(ideaNode.content || '');
          onClose();
        }
      });
    }
  } else if (node.type === 'tag') {
    menuItems.push({
      icon: <FiFilter className="w-4 h-4" />,
      label: `Filter by tag: ${node.name}`,
      onClick: () => {
        onFilterByType?.(node.name);
        onClose();
      }
    });

    menuItems.push({
      icon: <FiEyeOff className="w-4 h-4" />,
      label: 'Hide this tag',
      onClick: () => {
        onHideNode?.(node.id);
        onClose();
      }
    });
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-48"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, 0)'
      }}
    >
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="font-medium text-sm truncate">
          {node.type === 'idea' ? node.title : node.name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {node.type === 'idea' ? `${node.topic} idea` : 'Tag'}
        </div>
      </div>
      
      <div className="py-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}