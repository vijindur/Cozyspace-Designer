/**
 * Editor page — main workspace for room design.
 * 
 * Layout: [FurnitureCatalog | Canvas2D/Scene3D | PropertiesPanel]
 * 
 * HCI Rationale: Three-panel layout follows established patterns from
 * professional design tools (familiarity — Nielsen H4). The persistent
 * toolbar provides system status (H1) and supports undo/redo (H3).
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDesign } from '@/contexts/DesignContext';
import Navbar from '@/components/layout/Navbar';
import FurnitureCatalog from '@/components/editor/FurnitureCatalog';
import Canvas2D from '@/components/editor/Canvas2D';
import Scene3D from '@/components/editor/Scene3D';
import PropertiesPanel from '@/components/editor/PropertiesPanel';

const Editor = () => {
  const { currentDesign, viewMode } = useDesign();
  const navigate = useNavigate();

  // Redirect to dashboard if no design loaded
  useEffect(() => {
    if (!currentDesign) {
      navigate('/');
    }
  }, [currentDesign, navigate]);

  if (!currentDesign) return null;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Furniture catalog (only in 2D mode for focus) */}
        {viewMode === '2d' && <FurnitureCatalog />}

        {/* Center: Canvas */}
        {viewMode === '2d' ? <Canvas2D /> : <Scene3D />}

        {/* Right: Properties */}
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default Editor;
