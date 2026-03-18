/**
 * Design state management with localStorage persistence, undo/redo history,
 * and theme management.
 * 
 * HCI Rationale: Centralized state ensures consistency across views (Nielsen H4).
 * Undo/redo supports error recovery (Nielsen H3/H5). Auto-save prevents data loss.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Design, FurnitureItem, Room, FurnitureCatalogItem, DesignTemplate, LightingPreset, LIGHTING_PRESETS } from '@/types/design';

/** Maximum undo history depth — balances memory with usability */
const MAX_HISTORY = 50;

interface DesignContextType {
  designs: Design[];
  currentDesign: Design | null;
  selectedFurnitureId: string | null;
  viewMode: '2d' | '3d';
  gridEnabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  lightingPreset: LightingPreset;
  setViewMode: (mode: '2d' | '3d') => void;
  setGridEnabled: (v: boolean) => void;
  createDesign: (name: string, room: Room) => string;
  createDesignFromTemplate: (template: DesignTemplate) => string;
  deleteDesign: (id: string) => void;
  loadDesign: (id: string) => void;
  closeDesign: () => void;
  addFurniture: (item: FurnitureCatalogItem) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;
  updateRoom: (updates: Partial<Room>) => void;
  saveCurrentDesign: () => void;
  duplicateFurniture: (id: string) => void;
  toggleLockFurniture: (id: string) => void;
  undo: () => void;
  redo: () => void;
  setLightingPreset: (preset: LightingPreset) => void;
  addCustomFurniture: (item: FurnitureCatalogItem) => void;
  customCatalog: FurnitureCatalogItem[];
}

const DesignContext = createContext<DesignContextType | null>(null);

const STORAGE_KEY = 'roomforge-designs';
const CUSTOM_CATALOG_KEY = 'roomforge-custom-catalog';

const loadDesignsFromStorage = (): Design[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const designs = JSON.parse(data) as Design[];
    // Migrate old designs to ensure opacity property exists
    return designs.map(design => ({
      ...design,
      furniture: design.furniture.map(item => ({
        ...item,
        opacity: item.opacity ?? 1,
      })),
    }));
  } catch {
    return [];
  }
};

const loadCustomCatalog = (): FurnitureCatalogItem[] => {
  try {
    const data = localStorage.getItem(CUSTOM_CATALOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const persistDesigns = (designs: Design[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
};

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designs, setDesigns] = useState<Design[]>(loadDesignsFromStorage);
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [gridEnabled, setGridEnabled] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(LIGHTING_PRESETS[1]);
  const [customCatalog, setCustomCatalog] = useState<FurnitureCatalogItem[]>(loadCustomCatalog);

  // Undo/redo history stacks for furniture state
  const [undoStack, setUndoStack] = useState<FurnitureItem[][]>([]);
  const [redoStack, setRedoStack] = useState<FurnitureItem[][]>([]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // Push current furniture state to undo stack before mutations
  const pushUndo = useCallback(() => {
    if (!currentDesign) return;
    setUndoStack(prev => [...prev.slice(-(MAX_HISTORY - 1)), currentDesign.furniture.map(f => ({ ...f }))]);
    setRedoStack([]);
  }, [currentDesign]);

  // Persist designs on change
  useEffect(() => {
    persistDesigns(designs);
  }, [designs]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_CATALOG_KEY, JSON.stringify(customCatalog));
  }, [customCatalog]);

  const createDesign = useCallback((name: string, room: Room): string => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const design: Design = { id, name, room, furniture: [], createdAt: now, updatedAt: now };
    setDesigns(prev => [...prev, design]);
    setCurrentDesign(design);
    setSelectedFurnitureId(null);
    setViewMode('2d');
    setUndoStack([]);
    setRedoStack([]);
    return id;
  }, []);

  const createDesignFromTemplate = useCallback((template: DesignTemplate): string => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const furniture = template.furniture.map(f => ({ ...f, id: crypto.randomUUID(), opacity: f.opacity ?? 1 }));
    const design: Design = { id, name: template.name, room: { ...template.room }, furniture, createdAt: now, updatedAt: now };
    setDesigns(prev => [...prev, design]);
    setCurrentDesign(design);
    setSelectedFurnitureId(null);
    setViewMode('2d');
    setUndoStack([]);
    setRedoStack([]);
    return id;
  }, []);

  const deleteDesign = useCallback((id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
    if (currentDesign?.id === id) {
      setCurrentDesign(null);
      setSelectedFurnitureId(null);
    }
  }, [currentDesign]);

  const loadDesign = useCallback((id: string) => {
    const found = designs.find(d => d.id === id);
    if (found) {
      setCurrentDesign({ ...found, furniture: found.furniture.map(f => ({ ...f })) });
      setSelectedFurnitureId(null);
      setViewMode('2d');
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [designs]);

  const closeDesign = useCallback(() => {
    if (currentDesign) {
      const updated = { ...currentDesign, updatedAt: new Date().toISOString() };
      setDesigns(prev => prev.map(d => d.id === updated.id ? updated : d));
    }
    setCurrentDesign(null);
    setSelectedFurnitureId(null);
  }, [currentDesign]);

  const addFurniture = useCallback((catalogItem: FurnitureCatalogItem) => {
    if (!currentDesign) return;
    pushUndo();
    const item: FurnitureItem = {
      id: crypto.randomUUID(),
      type: catalogItem.type,
      name: catalogItem.name,
      x: Math.max(0, (currentDesign.room.width - catalogItem.width) / 2),
      y: Math.max(0, (currentDesign.room.length - catalogItem.depth) / 2),
      width: catalogItem.width,
      depth: catalogItem.depth,
      height: catalogItem.height,
      rotation: 0,
      color: catalogItem.color,
      opacity: 1,
      locked: false,
    };
    setCurrentDesign(prev => prev ? {
      ...prev,
      furniture: [...prev.furniture, item],
      updatedAt: new Date().toISOString(),
    } : null);
    setSelectedFurnitureId(item.id);
  }, [currentDesign, pushUndo]);

  const updateFurniture = useCallback((id: string, updates: Partial<FurnitureItem>) => {
    setCurrentDesign(prev => prev ? {
      ...prev,
      furniture: prev.furniture.map(f => f.id === id ? { ...f, ...updates } : f),
    } : null);
  }, []);

  const removeFurniture = useCallback((id: string) => {
    pushUndo();
    setCurrentDesign(prev => prev ? {
      ...prev,
      furniture: prev.furniture.filter(f => f.id !== id),
      updatedAt: new Date().toISOString(),
    } : null);
    if (selectedFurnitureId === id) setSelectedFurnitureId(null);
  }, [selectedFurnitureId, pushUndo]);

  const selectFurniture = useCallback((id: string | null) => {
    setSelectedFurnitureId(id);
  }, []);

  const updateRoom = useCallback((updates: Partial<Room>) => {
    setCurrentDesign(prev => prev ? {
      ...prev,
      room: { ...prev.room, ...updates },
      updatedAt: new Date().toISOString(),
    } : null);
  }, []);

  const saveCurrentDesign = useCallback(() => {
    if (!currentDesign) return;
    const updated = { ...currentDesign, updatedAt: new Date().toISOString() };
    setDesigns(prev => prev.map(d => d.id === updated.id ? updated : d));
    setCurrentDesign(updated);
    
    // Download design as JSON file
    const dataStr = JSON.stringify(updated, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${updated.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentDesign]);

  const duplicateFurniture = useCallback((id: string) => {
    pushUndo();
    setCurrentDesign(prev => {
      if (!prev) return null;
      const item = prev.furniture.find(f => f.id === id);
      if (!item) return prev;
      const clone: FurnitureItem = {
        ...item,
        id: crypto.randomUUID(),
        x: Math.min(item.x + 0.3, prev.room.width - item.width),
        y: Math.min(item.y + 0.3, prev.room.length - item.depth),
        locked: false,
      };
      return { ...prev, furniture: [...prev.furniture, clone] };
    });
  }, [pushUndo]);

  const toggleLockFurniture = useCallback((id: string) => {
    setCurrentDesign(prev => prev ? {
      ...prev,
      furniture: prev.furniture.map(f => f.id === id ? { ...f, locked: !f.locked } : f),
    } : null);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0 || !currentDesign) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(rs => [...rs, currentDesign.furniture.map(f => ({ ...f }))]);
    setUndoStack(us => us.slice(0, -1));
    setCurrentDesign(d => d ? { ...d, furniture: prev } : null);
    setSelectedFurnitureId(null);
  }, [undoStack, currentDesign]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || !currentDesign) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(us => [...us, currentDesign.furniture.map(f => ({ ...f }))]);
    setRedoStack(rs => rs.slice(0, -1));
    setCurrentDesign(d => d ? { ...d, furniture: next } : null);
    setSelectedFurnitureId(null);
  }, [redoStack, currentDesign]);

  const addCustomFurniture = useCallback((item: FurnitureCatalogItem) => {
    setCustomCatalog(prev => [...prev, item]);
  }, []);

  return (
    <DesignContext.Provider value={{
      designs, currentDesign, selectedFurnitureId, viewMode, gridEnabled, canUndo, canRedo, lightingPreset,
      setViewMode, setGridEnabled,
      createDesign, createDesignFromTemplate, deleteDesign, loadDesign, closeDesign,
      addFurniture, updateFurniture, removeFurniture, selectFurniture,
      updateRoom, saveCurrentDesign, duplicateFurniture, toggleLockFurniture,
      undo, redo, setLightingPreset, addCustomFurniture, customCatalog,
    }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error('useDesign must be used within DesignProvider');
  return ctx;
};
