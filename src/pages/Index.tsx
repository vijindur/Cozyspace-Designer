/**
 * Dashboard — modern SaaS-style landing page with design portfolio management.
 * 
 * HCI Rationale: Card-based layout supports recognition over recall (Nielsen H6).
 * Search/sort/filter improve efficiency for expert users (Nielsen H7).
 * Modern hero section creates strong first impression and reduces blank-canvas anxiety.
 */

import { useState, useMemo } from 'react';
import { useDesign } from '@/contexts/DesignContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import DesignCard from '@/components/dashboard/DesignCard';
import NewDesignDialog from '@/components/dashboard/NewDesignDialog';
import { DESIGN_TEMPLATES, Design } from '@/types/design';
import { Box, Layers, Eye, Ruler, Search, Grid2x2, List, ArrowUpDown, Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const features = [
  { icon: Layers, title: '2D Layout Editor', desc: 'Drag-and-drop furniture with precision grid snapping and real-time feedback' },
  { icon: Eye, title: '3D Visualisation', desc: 'Realistic perspective view with lighting presets and camera controls' },
  { icon: Ruler, title: 'Real Dimensions', desc: 'All furniture scaled to real-world proportions for accurate planning' },
  { icon: Box, title: 'Save & Iterate', desc: 'Persistent designs with undo/redo and version management' },
];

const highlights = [
  { icon: Zap, title: 'Instant Preview', desc: 'Switch between 2D and 3D views seamlessly' },
  { icon: Shield, title: 'Professional Grade', desc: 'Built for interior designers and consultants' },
  { icon: Globe, title: 'Real-World Scale', desc: 'Every dimension matches actual furniture sizes' },
];

type SortKey = 'updatedAt' | 'createdAt' | 'name' | 'roomType';

const Index = () => {
  const { designs, createDesignFromTemplate } = useDesign();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('updatedAt');
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    let result = designs.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'createdAt': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'roomType': return (a.room.roomType || '').localeCompare(b.room.roomType || '');
        case 'updatedAt':
        default: return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    return result;
  }, [designs, search, sortBy]);

  const handleTemplate = (template: typeof DESIGN_TEMPLATES[0]) => {
    createDesignFromTemplate(template);
    navigate('/editor');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section — Modern SaaS style */}
        <section className="relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/3 to-accent/3 blur-3xl rounded-full" />
          </div>

          <div className="relative py-16 md:py-24 px-6 md:px-12 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              Professional Interior Design Tool
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
              Design Spaces That
              <span className="block text-primary"> Come to Life</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Create stunning room layouts with drag-and-drop furniture placement, 
              then visualize in immersive 3D with realistic lighting and materials.
            </p>

            {designs.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <NewDesignDialog />
              </div>
            )}
          </div>
        </section>

        {/* Feature cards */}
        {designs.length === 0 && (
          <>
            <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    className="group relative p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold mb-2">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social proof / highlights strip */}
            <section className="px-6 md:px-12 max-w-5xl mx-auto mb-16">
              <div className="rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {highlights.map(h => (
                    <div key={h.title} className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                        <h.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-0.5">{h.title}</div>
                        <div className="text-xs text-muted-foreground">{h.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Templates section */}
            <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Start from a Template</h2>
                <p className="text-muted-foreground text-sm">Pre-configured rooms with furniture — get started in seconds</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {DESIGN_TEMPLATES.map(t => (
                  <button
                    key={t.name}
                    onClick={() => handleTemplate(t)}
                    className="group text-left p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{t.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{t.name}</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {t.room.width}m × {t.room.length}m · {t.furniture.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Use template <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Designs section */}
        <section className="px-6 md:px-12 max-w-6xl mx-auto pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {designs.length > 0 ? 'Your Designs' : 'Get Started'}
              </h2>
              {designs.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{designs.length} design{designs.length !== 1 ? 's' : ''} in your portfolio</p>
              )}
            </div>

            {designs.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search designs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-9 pl-8 text-xs w-full sm:w-48"
                  />
                </div>

                <Select value={sortBy} onValueChange={v => setSortBy(v as SortKey)}>
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updatedAt">Last Modified</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="roomType">Room Type</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center bg-secondary rounded-lg p-0.5">
                  <Button
                    variant={viewType === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setViewType('grid')}
                    aria-label="Grid view"
                  >
                    <Grid2x2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewType === 'table' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setViewType('table')}
                    aria-label="Table view"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <NewDesignDialog />
              {filtered.map(d => (
                <DesignCard key={d.id} design={d} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <NewDesignDialog />
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Room</TableHead>
                      <TableHead className="text-xs">Items</TableHead>
                      <TableHead className="text-xs">Modified</TableHead>
                      <TableHead className="text-xs">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(d => (
                      <TableDesignRow key={d.id} design={d} />
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                          No designs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">RoomForge</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Professional Interior Design & Furniture Visualisation Tool
          </p>
        </div>
      </footer>
    </div>
  );
};

/** Table row component for list view */
const TableDesignRow = ({ design }: { design: Design }) => {
  const { loadDesign } = useDesign();
  const navigate = useNavigate();
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => { loadDesign(design.id); navigate('/editor'); }}
    >
      <TableCell className="font-medium text-sm">{design.name}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {design.room.width}m × {design.room.length}m
      </TableCell>
      <TableCell className="text-xs">{design.furniture.length}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDate(design.updatedAt)}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDate(design.createdAt)}</TableCell>
    </TableRow>
  );
};

export default Index;
