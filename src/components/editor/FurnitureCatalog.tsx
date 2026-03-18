/**
 * Furniture catalog with built-in and custom items, plus custom furniture creation.
 * 
 * HCI Rationale: Categorized catalog supports recognition over recall (Nielsen H6).
 * Search filtering enables efficient retrieval (Nielsen H7). Custom furniture
 * creation empowers power users without affecting novice simplicity.
 */

import { useState } from 'react';
import { FURNITURE_CATALOG, FurnitureCatalogItem } from '@/types/design';
import { useDesign } from '@/contexts/DesignContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ColorPicker from '@/components/ui/color-picker';
import { FURNITURE_COLORS } from '@/types/design';
import { Search, Plus } from 'lucide-react';

const allCategories = [...new Set(FURNITURE_CATALOG.map(f => f.category))];

const FurnitureCatalog = () => {
  const { addFurniture, addCustomFurniture, customCatalog } = useDesign();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const combinedCatalog = [...FURNITURE_CATALOG, ...customCatalog];
  const categories = [...new Set(combinedCatalog.map(f => f.category))];

  const filtered = combinedCatalog.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-56 border-r bg-card flex flex-col shrink-0">
      <div className="p-3 border-b space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Furniture
          </h2>
          <CreateCustomDialog onAdd={addCustomFurniture} />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              !activeCategory ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                activeCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filtered.map((item, idx) => (
            <button
              key={`${item.type}-${idx}`}
              onClick={() => addFurniture(item)}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary transition-colors text-left group"
              title={`Add ${item.name} (${item.width}×${item.depth}m)`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {item.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {item.width}×{item.depth}×{item.height}m
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No items found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

/**
 * Dialog for creating custom furniture — power user feature.
 * HCI Rationale: Supports flexibility (Nielsen H7) without cluttering
 * the default experience for novice users.
 */
const CreateCustomDialog = ({ onAdd }: { onAdd: (item: FurnitureCatalogItem) => void }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Custom');
  const [width, setWidth] = useState('1.0');
  const [depth, setDepth] = useState('1.0');
  const [height, setHeight] = useState('0.8');
  const [color, setColor] = useState('#DEB887');

  const handleCreate = () => {
    if (!name.trim()) return;
    onAdd({
      type: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      width: parseFloat(width) || 1,
      depth: parseFloat(depth) || 1,
      height: parseFloat(height) || 0.8,
      color,
      icon: '📦',
    });
    setOpen(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Create custom furniture">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Custom Furniture</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standing Desk" autoFocus />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Category</Label>
            <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Custom" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">W (m)</Label>
              <Input type="number" step="0.1" min="0.1" value={width} onChange={e => setWidth(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">D (m)</Label>
              <Input type="number" step="0.1" min="0.1" value={depth} onChange={e => setDepth(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">H (m)</Label>
              <Input type="number" step="0.1" min="0.1" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
          </div>
          <ColorPicker label="Colour" value={color} onChange={setColor} presets={FURNITURE_COLORS} />
          <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
            Add to Catalogue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FurnitureCatalog;
