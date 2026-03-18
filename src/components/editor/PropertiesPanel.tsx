/**
 * Properties panel for selected furniture item and room settings.
 * 
 * HCI Rationale: Provides visibility of system status (Nielsen H1)
 * and direct manipulation of object properties (Norman affordances).
 * Color wheel supports full customization (Nielsen H7: flexibility).
 * Lock/unlock supports error prevention (Nielsen H5).
 * Immediate feedback on every change supports user confidence.
 */

import { useDesign } from '@/contexts/DesignContext';
import { FURNITURE_COLORS, WALL_COLORS, FLOOR_COLORS } from '@/types/design';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ColorPicker from '@/components/ui/color-picker';
import { Trash2, Copy, Lock, Unlock, Palette } from 'lucide-react';

const PropertiesPanel = () => {
  const {
    currentDesign, selectedFurnitureId, updateFurniture,
    removeFurniture, duplicateFurniture, updateRoom, toggleLockFurniture,
  } = useDesign();

  const selectedItem = currentDesign?.furniture.find(f => f.id === selectedFurnitureId);
  const room = currentDesign?.room;

  if (!room) return null;

  return (
    <div className="w-60 border-l bg-card flex flex-col shrink-0">
      <ScrollArea className="flex-1">
        {selectedItem ? (
          <div className="p-3 space-y-4">
            {/* Item header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Selected Item
                </h3>
                <p className="font-display font-semibold text-sm mt-1">{selectedItem.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => toggleLockFurniture(selectedItem.id)}
                title={selectedItem.locked ? 'Unlock position' : 'Lock position'}
              >
                {selectedItem.locked ? <Lock className="h-3.5 w-3.5 text-warning" /> : <Unlock className="h-3.5 w-3.5" />}
              </Button>
            </div>

            <Separator />

            {/* Position */}
            <div className="space-y-2">
              <Label className="text-xs">Position</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">X (m)</span>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max={room.width - selectedItem.width}
                    value={selectedItem.x.toFixed(1)}
                    onChange={e => updateFurniture(selectedItem.id, { x: parseFloat(e.target.value) || 0 })}
                    className="h-7 text-xs"
                    disabled={selectedItem.locked}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Y (m)</span>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max={room.length - selectedItem.depth}
                    value={selectedItem.y.toFixed(1)}
                    onChange={e => updateFurniture(selectedItem.id, { y: parseFloat(e.target.value) || 0 })}
                    className="h-7 text-xs"
                    disabled={selectedItem.locked}
                  />
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <Label className="text-xs">Dimensions</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">W (m)</span>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={selectedItem.width.toFixed(1)}
                    onChange={e => updateFurniture(selectedItem.id, { width: parseFloat(e.target.value) || selectedItem.width })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">D (m)</span>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={selectedItem.depth.toFixed(1)}
                    onChange={e => updateFurniture(selectedItem.id, { depth: parseFloat(e.target.value) || selectedItem.depth })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">H (m)</span>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5"
                    value={selectedItem.height.toFixed(1)}
                    onChange={e => updateFurniture(selectedItem.id, { height: parseFloat(e.target.value) || selectedItem.height })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <Label className="text-xs">Rotation: {selectedItem.rotation}°</Label>
              <Slider
                value={[selectedItem.rotation]}
                onValueChange={([v]) => updateFurniture(selectedItem.id, { rotation: v })}
                min={0}
                max={360}
                step={15}
                className="py-1"
                disabled={selectedItem.locked}
              />
              <div className="flex gap-1">
                {[0, 90, 180, 270].map(deg => (
                  <Button
                    key={deg}
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px] flex-1"
                    onClick={() => updateFurniture(selectedItem.id, { rotation: deg })}
                    disabled={selectedItem.locked}
                  >
                    {deg}°
                  </Button>
                ))}
              </div>
            </div>

            {/* Color with colour wheel */}
            <ColorPicker
              label="Colour"
              value={selectedItem.color}
              onChange={c => updateFurniture(selectedItem.id, { color: c })}
              presets={FURNITURE_COLORS}
            />

            {/* Opacity/Shade */}
            <div className="space-y-2">
              <Label className="text-xs">Opacity: {Math.round((selectedItem.opacity ?? 1) * 100)}%</Label>
              <Slider
                value={[selectedItem.opacity ?? 1]}
                onValueChange={([v]) => updateFurniture(selectedItem.id, { opacity: v })}
                min={0}
                max={1}
                step={0.05}
                className="py-1"
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1 text-xs"
                onClick={() => duplicateFurniture(selectedItem.id)}
              >
                <Copy className="h-3 w-3" /> Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs text-destructive hover:text-destructive"
                onClick={() => removeFurniture(selectedItem.id)}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ) : (
          /* Room properties when nothing selected */
          <div className="p-3 space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Room Settings
              </h3>
            </div>

            <Separator />

            {/* Room dimensions */}
            <div className="space-y-2">
              <Label className="text-xs">Dimensions</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">W (m)</span>
                  <Input
                    type="number"
                    step="0.5"
                    min="2"
                    max="20"
                    value={room.width}
                    onChange={e => updateRoom({ width: parseFloat(e.target.value) || room.width })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">L (m)</span>
                  <Input
                    type="number"
                    step="0.5"
                    min="2"
                    max="20"
                    value={room.length}
                    onChange={e => updateRoom({ length: parseFloat(e.target.value) || room.length })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">H (m)</span>
                  <Input
                    type="number"
                    step="0.1"
                    min="2"
                    max="5"
                    value={room.height}
                    onChange={e => updateRoom({ height: parseFloat(e.target.value) || room.height })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Wall color with colour wheel */}
            <ColorPicker
              label="Wall Colour"
              value={room.wallColor}
              onChange={v => updateRoom({ wallColor: v })}
              presets={WALL_COLORS}
            />

            {/* Floor color with colour wheel */}
            <ColorPicker
              label="Floor Colour"
              value={room.floorColor}
              onChange={v => updateRoom({ floorColor: v })}
              presets={FLOOR_COLORS}
            />

            <Separator />

            <p className="text-[10px] text-muted-foreground text-center">
              Click a furniture item to edit its properties
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PropertiesPanel;
