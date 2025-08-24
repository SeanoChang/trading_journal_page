"use client";
import { useEffect, useRef, forwardRef } from 'react';
import * as d3 from 'd3';
import type { Node, Link, LinkMode, GraphDimensions } from '../../../types/ideas-graph';
import { getNodeColor, LINK_STYLES } from '../../../utils/ideas-graph';

interface GraphCanvasProps {
  nodes: Node[];
  links: Link[];
  dimensions: GraphDimensions;
  search: string;
  linkMode: LinkMode;
  isTimelineMode: boolean;
  findNodeAtPosition: (x: number, y: number, transform: any) => Node | undefined;
  getConnectedNodes: (nodeId: string) => Set<string>;
}

export const GraphCanvas = forwardRef<HTMLCanvasElement, GraphCanvasProps>(({ 
  nodes,
  links,
  dimensions,
  search,
  linkMode,
  isTimelineMode,
  findNodeAtPosition,
  getConnectedNodes
}, ref) => {
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const isDraggingRef = useRef(false);
  const draggedNodeRef = useRef<Node | null>(null);
  const hoveredNodeRef = useRef<Node | null>(null);
  const isolatedNodeRef = useRef<string | null>(null);
  const contextMenuRef = useRef<{ node: Node | null; position: { x: number; y: number } | null }>({ 
    node: null, 
    position: null 
  });

  useEffect(() => {
    const canvas = ref as React.RefObject<HTMLCanvasElement>;
    if (!canvas.current || !dimensions.width || !dimensions.height) return;

    const canvasElement = canvas.current;
    const context = canvasElement.getContext('2d');
    if (!context) return;

    // Enhanced force simulation with temporal positioning
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(d => d.distance)
        .strength(d => d.strength)
      )
      .force("charge", d3.forceManyBody<Node>()
        .strength((d) => {
          if (d.type === 'tag') return -400;
          return d.type === 'idea' ? -200 - (d.degree * 20) : -200;
        })
        .distanceMax(300)
      )
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide<Node>()
        .radius(d => d.radius + 3)
        .strength(0.8)
      )
      // Temporal positioning force
      .force("temporal", d3.forceX<Node>((d) => {
        if (d.type === 'idea' && isTimelineMode) {
          return (d.age - 45) * -3;
        }
        return 0;
      }).strength(0.1))
      // Hierarchical positioning for tags
      .force("hierarchy", d3.forceY<Node>((d) => {
        if (d.type === 'tag') {
          return d.level * -50;
        }
        return 0;
      }).strength(0.15))
      .alphaDecay(0.015)
      .velocityDecay(0.4);

    simulationRef.current = simulation;

    const render = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      // Match canvas buffer to CSS pixels for crisp, non-stretched rendering
      canvasElement.width = Math.max(1, Math.floor(dimensions.width * dpr));
      canvasElement.height = Math.max(1, Math.floor(dimensions.height * dpr));
      canvasElement.style.width = `${Math.max(0, Math.floor(dimensions.width))}px`;
      canvasElement.style.height = `${Math.max(0, Math.floor(dimensions.height))}px`;

      // Draw in CSS pixel coordinates
      context.save();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, dimensions.width, dimensions.height);
      
      context.translate(dimensions.width / 2, dimensions.height / 2);
      context.translate(transformRef.current.x, transformRef.current.y);
      context.scale(transformRef.current.k, transformRef.current.k);

      // Filter nodes and links
      let filteredNodes = search.trim() 
        ? nodes.filter(node => {
            if (node.type === 'tag') {
              return node.name.toLowerCase().includes(search.toLowerCase());
            }
            return node.title.toLowerCase().includes(search.toLowerCase()) ||
                   node.topic.toLowerCase().includes(search.toLowerCase()) ||
                   node.content?.toLowerCase().includes(search.toLowerCase()) ||
                   (node.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
                   (node.trades || []).some(trade => trade.toLowerCase().includes(search.toLowerCase()));
          })
        : nodes;

      // Apply isolation filter if a node is isolated
      if (isolatedNodeRef.current) {
        const isolatedId = isolatedNodeRef.current;
        const connectedNodes = getConnectedNodes(isolatedId);
        filteredNodes = filteredNodes.filter(node => 
          node.id === isolatedId || connectedNodes.has(node.id)
        );
      }
        
      const hoveredConnections = hoveredNodeRef.current ? getConnectedNodes(hoveredNodeRef.current.id) : new Set<string>();

      const nodeIds = new Set(filteredNodes.map(n => n.id));
      const filteredLinks = links.filter(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        const validNodes = nodeIds.has(sourceId) && nodeIds.has(targetId);
        
        if (!validNodes) return false;
        
        switch (linkMode) {
          case 'temporal': return link.kind === 'temporal';
          case 'conceptual': return link.kind === 'topic' || link.kind === 'tag';
          case 'hierarchy': return link.kind === 'hierarchy';
          case 'ticker': return link.kind === 'ticker';
          case 'all': return true;
          default: return true;
        }
      });

      // Draw links
      filteredLinks.forEach(link => {
        const source = typeof link.source === 'string' ? 
          nodes.find(n => n.id === link.source) : link.source;
        const target = typeof link.target === 'string' ? 
          nodes.find(n => n.id === link.target) : link.target;
        
        if (!source || !target || source.x === undefined || target.x === undefined) return;

        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        const isHighlighted = hoveredConnections.has(sourceId) || hoveredConnections.has(targetId);
        
        const style = LINK_STYLES[link.kind] || LINK_STYLES.topic;
        
        context.beginPath();
        context.moveTo(source.x, source.y!);
        context.lineTo(target.x, target.y!);
        context.strokeStyle = style.color;
        context.lineWidth = isHighlighted ? style.width * 1.5 : style.width;
      context.globalAlpha = isHighlighted ? style.alpha * 1.5 : style.alpha;
        context.stroke();
        
        // Draw arrows for hierarchical links
        if (link.kind === 'hierarchy') {
          const dx = target.x - source.x;
          const dy = target.y! - source.y!;
          const length = Math.sqrt(dx * dx + dy * dy);
          const arrowSize = 6;
          const arrowX = target.x - (dx / length) * (target.radius + 2);
          const arrowY = target.y! - (dy / length) * (target.radius + 2);
          
          context.beginPath();
          context.moveTo(arrowX, arrowY);
          context.lineTo(arrowX - arrowSize * dx/length + arrowSize * dy/length, 
                        arrowY - arrowSize * dy/length - arrowSize * dx/length);
          context.lineTo(arrowX - arrowSize * dx/length - arrowSize * dy/length, 
                        arrowY - arrowSize * dy/length + arrowSize * dx/length);
          context.closePath();
          context.fillStyle = style.color;
          context.fill();
        }
      });

      // Draw nodes
      context.globalAlpha = 1;
      context.font = '11px Inter, sans-serif';
      
      const sortedNodes = [...filteredNodes].sort((a, b) => {
        if (a.type === 'tag' && b.type === 'idea') return -1;
        if (a.type === 'idea' && b.type === 'tag') return 1;
        return 0;
      });
      
      sortedNodes.forEach(node => {
        if (node.x === undefined || node.y === undefined) return;

        const isHighlighted = search.trim() && (
          (node.type === 'idea' && (
            node.title.toLowerCase().includes(search.toLowerCase()) ||
            node.topic.toLowerCase().includes(search.toLowerCase()) ||
            (node.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
          )) ||
          (node.type === 'tag' && node.name.toLowerCase().includes(search.toLowerCase()))
        );

        const isHovered = hoveredNodeRef.current?.id === node.id;
        const isDragged = draggedNodeRef.current?.id === node.id;
        const isConnected = hoveredNodeRef.current && hoveredConnections.has(node.id);
        
        context.globalAlpha = 1;

        // Enhanced visual hierarchy based on node types
        if (node.type === 'tag') {
          // Tag nodes: hollow circles with colored border
          context.beginPath();
          context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255, 255, 255, 0.95)';
          context.fill();
          context.strokeStyle = getNodeColor(node, isTimelineMode);
          context.lineWidth = 3;
          context.stroke();
          
          // Add subtle inner shadow for depth
          context.beginPath();
          context.arc(node.x, node.y, node.radius - 1, 0, Math.PI * 2);
          context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          context.lineWidth = 1;
          context.stroke();
        } else {
          // Idea nodes: filled circles
          context.beginPath();
          context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          context.fillStyle = getNodeColor(node, isTimelineMode);
          context.fill();
          
          // Special treatment for investment nodes
          if ('tickers' in node && node.tickers && node.tickers.length > 0) {
            // Add golden border for ticker-containing nodes
            context.strokeStyle = "#ffd700";
            context.lineWidth = 2.5;
            context.stroke();
            
            // Add small ticker indicator dot
            context.beginPath();
            context.arc(node.x + node.radius * 0.6, node.y - node.radius * 0.6, 3, 0, Math.PI * 2);
            context.fillStyle = "#ffd700";
            context.fill();
            context.strokeStyle = "#fff";
            context.lineWidth = 1;
            context.stroke();
          }
          
          // Add depth with subtle gradient effect
          const gradient = context.createRadialGradient(
            node.x - node.radius * 0.3, 
            node.y - node.radius * 0.3, 
            0,
            node.x, 
            node.y, 
            node.radius
          );
          const baseColor = getNodeColor(node, isTimelineMode);
          gradient.addColorStop(0, baseColor);
          gradient.addColorStop(1, baseColor + '88');
          
          context.beginPath();
          context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          context.fillStyle = gradient;
          context.fill();
        }
        
        context.strokeStyle = isHighlighted ? "#0ea5e9" : 
                             isDragged ? "#ef4444" : 
                             isHovered || isConnected ? "#f59e0b" : 
                             node.type === 'tag' ? getNodeColor(node, isTimelineMode) : "#1e293b";
        context.lineWidth = isHighlighted || isHovered || isDragged ? 3 : 
                           isConnected ? 2 : 
                           node.type === 'tag' ? 3 : 1;
        if (node.type === 'idea') {
          context.stroke();
        }

        // Labels and metadata
        context.globalAlpha = 1;
        context.fillStyle = node.type === 'tag' ? getNodeColor(node, isTimelineMode) : "#1e293b";
        context.font = node.type === 'tag' ? 'bold 10px Inter, sans-serif' : '11px Inter, sans-serif';
        
        const label = node.type === 'tag' ? 
          (node.level > 0 ? node.name.split('/').pop() || node.name : node.name) :
          node.title;
          
        const labelX = node.x + node.radius + 4;
        const labelY = node.y + (node.type === 'tag' ? -2 : 4);
        
        context.fillText(label, labelX, labelY);
        
        if (node.type === 'idea' && (isHovered || isHighlighted)) {
          context.font = '9px Inter, sans-serif';
          context.fillStyle = "#64748b";
          const ageText = `${Math.round(node.age)}d ago`;
          context.fillText(ageText, labelX, labelY + 12);
          
          if (node.winrate) {
            const winrateText = `${node.winrate}% WR`;
            context.fillText(winrateText, labelX, labelY + 22);
          }
          
          if (node.tickers && node.tickers.length > 0) {
            const tickerText = node.tickers.map(t => `$${t}`).join(', ');
            context.fillStyle = "#ffd700";
            context.font = 'bold 9px Inter, sans-serif';
            context.fillText(tickerText, labelX, labelY + (node.winrate ? 32 : 22));
          }
        }
        
        if (node.type === 'tag' && (isHovered || isHighlighted)) {
          context.font = '9px Inter, sans-serif';
          context.fillStyle = "#64748b";
          context.fillText(`${node.count} items`, labelX, labelY + 12);
        }
      });

      context.restore();
    };

    // Mouse event handlers
    const handleMouseDown = (event: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const node = findNodeAtPosition(x, y, transformRef.current);
      
      if (node) {
        // Start dragging immediately for responsive UX
        isDraggingRef.current = true;
        draggedNodeRef.current = node;
        hoveredNodeRef.current = null;

        node.fx = node.x;
        node.fy = node.y;

        simulation.alphaTarget(0.3).restart();
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      if (isDraggingRef.current && draggedNodeRef.current) {
        const transform = transformRef.current;
        const simX = (x - dimensions.width / 2 - transform.x) / transform.k;
        const simY = (y - dimensions.height / 2 - transform.y) / transform.k;
        
        draggedNodeRef.current.fx = simX;
        draggedNodeRef.current.fy = simY;
        
        event.preventDefault();
        event.stopPropagation();
      } else {
        const node = findNodeAtPosition(x, y, transformRef.current);
        const previousHovered = hoveredNodeRef.current;
        hoveredNodeRef.current = node || null;
        
        if (previousHovered !== hoveredNodeRef.current) {
          render();
        }
        
        canvasElement.style.cursor = node ? 'pointer' : 'default';
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const node = findNodeAtPosition(x, y, transformRef.current);
      if (node) {
        if (isolatedNodeRef.current === node.id) {
          isolatedNodeRef.current = null;
        } else {
          isolatedNodeRef.current = node.id;
        }
        render();
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDraggingRef.current && draggedNodeRef.current) {
        draggedNodeRef.current.fx = null;
        draggedNodeRef.current.fy = null;
        
        isDraggingRef.current = false;
        draggedNodeRef.current = null;
        
        simulation.alphaTarget(0);
        
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleMouseLeave = () => {
      hoveredNodeRef.current = null;
      canvasElement.style.cursor = 'default';
      render();
      
      if (isDraggingRef.current && draggedNodeRef.current) {
        draggedNodeRef.current.fx = null;
        draggedNodeRef.current.fy = null;
        simulation.alphaTarget(0);
        isDraggingRef.current = false;
        draggedNodeRef.current = null;
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      
      const rect = canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const node = findNodeAtPosition(x, y, transformRef.current);
      
      if (node) {
        contextMenuRef.current = {
          node,
          position: { x: event.clientX, y: event.clientY }
        };
        render();
      }
    };

    const preventScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    canvasElement.addEventListener('wheel', preventScroll, { passive: false });
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mouseleave', handleMouseLeave);
    canvasElement.addEventListener('contextmenu', handleContextMenu);
    canvasElement.addEventListener('dblclick', handleDoubleClick);

    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 4])
      .filter((event) => !isDraggingRef.current)
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        render();
      });

    d3.select(canvasElement).call(zoom);

    simulation.on("tick", render);

    render();

    return () => {
      simulation.stop();
      canvasElement.removeEventListener('wheel', preventScroll);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('mouseleave', handleMouseLeave);
      canvasElement.removeEventListener('contextmenu', handleContextMenu);
      canvasElement.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [ref, nodes, links, dimensions, search, linkMode, isTimelineMode, findNodeAtPosition, getConnectedNodes]);

  // Expose simulation ref for external control
  useEffect(() => {
    if (ref && typeof ref === 'object') {
      (ref as any).simulationRef = simulationRef;
      (ref as any).transformRef = transformRef;
    }
  }, [ref, simulationRef, transformRef]);

  return (
    <canvas
      ref={ref}
      className="w-full h-full"
      style={{ 
        touchAction: 'none', 
        display: 'block',
        cursor: 'default'
      }}
    />
  );
});

GraphCanvas.displayName = 'GraphCanvas';
