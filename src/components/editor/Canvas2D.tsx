/**
 * 2D Room Canvas with drag-and-drop furniture placement and professional toolbar.
 * Supports rectangular, square, L-shaped, and U-shaped room rendering.
 * 
 * HCI Rationale: Direct manipulation (Shneiderman) — users drag objects
 * and see immediate visual feedback. Room shapes rendered accurately
 * support correct mental models (Norman's conceptual model principle).
 */

import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { useDesign } from '@/contexts/DesignContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Undo2, Redo2, ZoomIn, ZoomOut, Grid3x3, Lock } from 'lucide-react';

const GRID_SNAP = 0.1;
const MIN_SCALE = 20;
const MAX_SCALE = 150;
const CANVAS_PADDING = 40;

/**
 * Returns a CSS clip-path for the room shape.
 * L-shaped and U-shaped rooms clip out portions of the rectangle.
 */
const getRoomClipPath = (shape: string): string | undefined => {
  switch (shape) {
    case 'l-shaped':
      // L-shape: cuts top-right corner (40% width, 40% length)
      return 'polygon(0% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 100%, 0% 100%)';
    case 'u-shaped':
      // U-shape: cuts a notch from the bottom center
      return 'polygon(0% 0%, 100% 0%, 100% 100%, 75% 100%, 75% 65%, 25% 65%, 25% 100%, 0% 100%)';
    default:
      return undefined;
  }
};

/**
 * Renders an SVG overlay for non-rectangular room shapes to show
 * the cut-out area as hatched/disabled.
 */
const RoomShapeOverlay = ({ shape, width, height }: { shape: string; width: number; height: number }) => {
  if (shape === 'rectangular' || shape === 'square') return null;

  let paths: string[] = [];
  if (shape === 'l-shaped') {
    // Hatched area: top-right block
    const cx = width * 0.6;
    const cy = height * 0.4;
    paths = [`M ${cx} 0 L ${width} 0 L ${width} ${cy} L ${cx} ${cy} Z`];
  } else if (shape === 'u-shaped') {
    // Hatched area: bottom center notch
    const lx = width * 0.25;
    const rx = width * 0.75;
    const ty = height * 0.65;
    paths = [`M ${lx} ${ty} L ${rx} ${ty} L ${rx} ${height} L ${lx} ${height} Z`];
  }

  return (
    <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.2" />
        </pattern>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="url(#hatch)" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 3" />
      ))}
    </svg>
  );
};

const Canvas2D = () => {
  const {
    currentDesign, updateFurniture, selectFurniture, selectedFurnitureId,
    undo, redo, canUndo, canRedo, gridEnabled, setGridEnabled,
  } = useDesign();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const room = currentDesign?.room;
  const furniture = currentDesign?.furniture || [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const baseScale = useMemo(() => {
    if (!room) return 50;
    const sw = (containerSize.width - CANVAS_PADDING * 2) / room.width;
    const sh = (containerSize.height - CANVAS_PADDING * 2 - 44) / room.length;
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(sw, sh)));
  }, [room, containerSize]);

  const scale = baseScale * zoomLevel;
  const gridSizePx = GRID_SNAP * scale;

  const snap = (val: number) => gridEnabled ? Math.round(val / GRID_SNAP) * GRID_SNAP : val;

  const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const item = furniture.find(f => f.id === itemId);
    if (!item || item.locked) return;

    const roomEl = containerRef.current?.querySelector('[data-room]') as HTMLElement;
    if (!roomEl) return;
    const rect = roomEl.getBoundingClientRect();

    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    setDragOffset({ x: mouseX - item.x, y: mouseY - item.y });
    setDragId(itemId);
    setIsDragging(true);
    selectFurniture(itemId);
  }, [furniture, scale, selectFurniture, gridEnabled]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragId || !room) return;

    const roomEl = containerRef.current?.querySelector('[data-room]') as HTMLElement;
    if (!roomEl) return;
    const rect = roomEl.getBoundingClientRect();

    let newX = (e.clientX - rect.left) / scale - dragOffset.x;
    let newY = (e.clientY - rect.top) / scale - dragOffset.y;

    newX = snap(newX);
    newY = snap(newY);

    const item = furniture.find(f => f.id === dragId);
    if (item) {
      newX = Math.max(0, Math.min(room.width - item.width, newX));
      newY = Math.max(0, Math.min(room.length - item.depth, newY));
    }

    updateFurniture(dragId, { x: newX, y: newY });
  }, [isDragging, dragId, room, scale, dragOffset, furniture, updateFurniture, snap]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragId(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute('data-room') !== null) {
      selectFurniture(null);
    }
  }, [selectFurniture]);

  if (!room) return null;

  const roomWidthPx = room.width * scale;
  const roomHeightPx = room.length * scale;
  const clipPath = getRoomClipPath(room.shape);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'hsl(var(--canvas-bg))' }}>
      {/* Toolbar */}
      <div className="h-10 border-b bg-card flex items-center px-2 gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={undo} disabled={!canUndo}>
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={redo} disabled={!canRedo}>
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">Redo (Ctrl+Shift+Z)</TooltipContent>
        </Tooltip>

        <div className="w-px h-5 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={gridEnabled ? 'default' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setGridEnabled(!gridEnabled)}
            >
              <Grid3x3 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">Toggle Grid Snap</TooltipContent>
        </Tooltip>

        <div className="w-px h-5 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">Zoom Out</TooltipContent>
        </Tooltip>
        <span className="text-[10px] text-muted-foreground w-10 text-center font-mono">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">Zoom In</TooltipContent>
        </Tooltip>

        <div className="flex-1" />
        <span className="text-[10px] text-muted-foreground">
          {furniture.length} items · {room.width}×{room.length}m · {room.shape}
        </span>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative" style={{ width: roomWidthPx, height: roomHeightPx }}>
          {/* Room shape overlay for non-rectangular */}
          <RoomShapeOverlay shape={room.shape} width={roomWidthPx} height={roomHeightPx} />

          <div
            data-room
            className={cn('absolute inset-0 border-2 border-foreground/20 shadow-lg', gridEnabled && 'editor-grid-bg')}
            style={{
              backgroundColor: room.floorColor,
              backgroundSize: gridEnabled ? `${gridSizePx * 5}px ${gridSizePx * 5}px` : undefined,
              clipPath,
            }}
            onClick={handleCanvasClick}
          >
            {/* Dimension labels */}
            <div className="absolute -top-6 left-0 right-0 flex justify-center">
              <span className="text-[10px] font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                {room.width.toFixed(1)}m
              </span>
            </div>
            <div className="absolute -right-8 top-0 bottom-0 flex items-center">
              <span className="text-[10px] font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded -rotate-90 origin-center whitespace-nowrap">
                {room.length.toFixed(1)}m
              </span>
            </div>

            {/* Furniture items */}
            {furniture.map(item => {
              const isSelected = selectedFurnitureId === item.id;
              const isDragTarget = dragId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'absolute flex items-center justify-center border-2 transition-shadow select-none',
                    item.locked ? 'cursor-not-allowed opacity-80' : isDragTarget ? 'cursor-grabbing' : 'cursor-grab',
                    isSelected
                      ? 'furniture-selected border-primary'
                      : 'border-foreground/25 hover:border-primary/60',
                  )}
                  style={{
                    left: item.x * scale,
                    top: item.y * scale,
                    width: item.width * scale,
                    height: item.depth * scale,
                    backgroundColor: item.color,
                    opacity: item.opacity ?? 1,
                    transform: `rotate(${item.rotation}deg)`,
                    transformOrigin: 'center center',
                    zIndex: isSelected ? 20 : isDragTarget ? 15 : 1,
                  }}
                  onMouseDown={e => handleMouseDown(e, item.id)}
                  onClick={e => { e.stopPropagation(); selectFurniture(item.id); }}
                  title={`${item.name} — ${item.width}×${item.depth}m${item.locked ? ' (locked)' : ''}`}
                  role="button"
                  aria-label={`${item.name} at position ${item.x.toFixed(1)}, ${item.y.toFixed(1)}${item.locked ? ' (locked)' : ''}`}
                  tabIndex={0}
                >
                  {item.width * scale > 40 && item.depth * scale > 20 && (
                    <span
                      className="text-[9px] font-bold drop-shadow-sm truncate px-1 pointer-events-none"
                      style={{ color: isLightColor(item.color) ? '#333' : '#fff' }}
                    >
                      {item.name}
                    </span>
                  )}
                  {item.locked && (
                    <div className="absolute top-0.5 right-0.5">
                      <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                  )}
                  {isSelected && !item.locked && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary border border-primary-foreground pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default Canvas2D;
