/**
 * Dashboard — Design portfolio management workspace.
 * Separated from landing page for clean routing architecture.
 * 
 * HCI Rationale: Card-based layout supports recognition over recall (Nielsen H6).
 * Search/sort/filter improve efficiency for expert users (Nielsen H7).
 */

import { useState, useMemo } from 'react';
import { useDesign } from '@/contexts/DesignContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import DesignCard from '@/components/dashboard/DesignCard';
import NewDesignDialog from '@/components/dashboard/NewDesignDialog';
import { DESIGN_TEMPLATES, Design } from '@/types/design';
import { Search, Grid2x2, List, ArrowUpDown, ArrowRight } from 'lucide-react';
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
import Footer from '@/components/landing/Footer';

type SortKey = 'updatedAt' | 'createdAt' | 'name' | 'roomType';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Templates section */}
        <section className="px-6 md:px-12 max-w-6xl mx-auto pt-12 mb-12">
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

        {/* Designs section */}
        <section className="px-6 md:px-12 max-w-6xl mx-auto pb-16 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {designs.length > 0 ? 'Your Designs' : 'Your Portfolio'}
              </h2>
              {designs.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{designs.length} design{designs.length !== 1 ? 's' : ''}</p>
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
                  <Button variant={viewType === 'grid' ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewType('grid')} aria-label="Grid view">
                    <Grid2x2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant={viewType === 'table' ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewType('table')} aria-label="Table view">
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
      <Footer />
    </div>
  );
};

const TableDesignRow = ({ design }: { design: Design }) => {
  const { loadDesign } = useDesign();
  const navigate = useNavigate();
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <TableRow className="cursor-pointer" onClick={() => { loadDesign(design.id); navigate('/editor'); }}>
      <TableCell className="font-medium text-sm">{design.name}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{design.room.width}m × {design.room.length}m</TableCell>
      <TableCell className="text-xs">{design.furniture.length}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDate(design.updatedAt)}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDate(design.createdAt)}</TableCell>
    </TableRow>
  );
};

export default Dashboard;
