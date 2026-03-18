/**
 * Navbar with theme toggle and editor/landing page context awareness.
 * 
 * HCI Rationale: Persistent navigation supports orientation (Nielsen H1).
 * Theme toggle enables accessibility (WCAG). Context-aware links reduce
 * navigation friction (Nielsen H7).
 */

import { useDesign } from '@/contexts/DesignContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Box, Grid2x2, Moon, Sun } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const { currentDesign, closeDesign, saveCurrentDesign, viewMode, setViewMode } = useDesign();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditor = location.pathname === '/editor';
  const isLanding = location.pathname === '/';
  const { theme, setTheme } = useTheme();

  const handleBack = () => {
    closeDesign();
    navigate('/dashboard');
  };

  return (
    <header className="h-14 border-b bg-card/80 backdrop-blur-md toolbar-shadow flex items-center px-4 md:px-6 gap-3 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {isEditor ? (
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Box className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="font-display text-lg font-semibold tracking-tight">RoomForge</h1>
          </Link>
        )}
      </div>

      {isEditor && currentDesign && (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-display text-base font-medium truncate max-w-[300px]">
            {currentDesign.name}
          </span>
          <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
            {currentDesign.room.width}m × {currentDesign.room.length}m
          </span>
        </div>
      )}

      {!isEditor && (
        <div className="flex-1 flex items-center justify-center">
          {isLanding && (
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            </nav>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {isLanding && (
          <Button size="sm" className="h-8 px-4 text-xs rounded-lg" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        )}

        {isEditor && currentDesign && (
          <>
            <div className="flex items-center bg-secondary rounded-lg p-0.5">
              <Button variant={viewMode === '2d' ? 'default' : 'ghost'} size="sm" className="h-7 px-3 text-xs" onClick={() => setViewMode('2d')}>
                <Grid2x2 className="h-3.5 w-3.5 mr-1" /> 2D
              </Button>
              <Button variant={viewMode === '3d' ? 'default' : 'ghost'} size="sm" className="h-7 px-3 text-xs" onClick={() => setViewMode('3d')}>
                <Box className="h-3.5 w-3.5 mr-1" /> 3D
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => saveCurrentDesign()} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
