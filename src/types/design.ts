/**
 * Core domain types for RoomForge furniture visualization system.
 * 
 * HCI Rationale: Clear data models ensure consistent state representation
 * across 2D and 3D views, supporting the principle of consistency (Nielsen H4).
 * Room types and shapes support recognition over recall (Nielsen H6).
 */

export interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  x: number;       // meters from room left edge
  y: number;       // meters from room top edge (2D) / front edge (3D)
  width: number;   // meters (x-axis)
  depth: number;   // meters (z-axis in 3D, y-axis in 2D)
  height: number;  // meters (y-axis in 3D)
  rotation: number; // degrees
  color: string;
  opacity: number; // 0-1 (0 = fully transparent, 1 = fully opaque)
  locked?: boolean; // prevents accidental movement (error prevention — Nielsen H5)
}

export interface Room {
  width: number;   // meters
  length: number;  // meters
  height: number;  // meters
  wallColor: string;
  floorColor: string;
  ceilingColor?: string;
  shape: 'rectangular' | 'l-shaped' | 'u-shaped' | 'square';
  roomType?: string; // e.g. 'bedroom', 'living-room', etc.
}

export interface Design {
  id: string;
  name: string;
  room: Room;
  furniture: FurnitureItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FurnitureCatalogItem {
  type: string;
  name: string;
  category: string;
  width: number;
  depth: number;
  height: number;
  color: string;
  icon: string;
}

/**
 * Room types for guided creation — supports recognition (Nielsen H6)
 * and progressive disclosure for novice users.
 */
export const ROOM_TYPES = [
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', desc: 'Personal sleeping space' },
  { id: 'living-room', name: 'Living Room', icon: '🛋️', desc: 'Main social area' },
  { id: 'office', name: 'Office', icon: '🖥️', desc: 'Work or study space' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳', desc: 'Cooking and prep area' },
  { id: 'dining-room', name: 'Dining Room', icon: '🍽️', desc: 'Formal dining area' },
  { id: 'entertainment', name: 'TV / Entertainment', icon: '📺', desc: 'Media and leisure' },
  { id: 'custom', name: 'Custom', icon: '✏️', desc: 'Define your own type' },
];

export const ROOM_SHAPES: { id: Room['shape']; name: string; icon: string }[] = [
  { id: 'rectangular', name: 'Rectangle', icon: '▬' },
  { id: 'square', name: 'Square', icon: '⬜' },
  { id: 'l-shaped', name: 'L-Shape', icon: '⌐' },
  { id: 'u-shaped', name: 'U-Shape', icon: '⊔' },
];

/** 
 * Furniture catalog with real-world proportions.
 * Categories support filtering for task efficiency (Nielsen H7: Flexibility).
 */
export const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  { type: 'sofa', name: 'Sofa', category: 'Seating', width: 2.0, depth: 0.9, height: 0.85, color: '#8B7355', icon: '🛋️' },
  { type: 'armchair', name: 'Armchair', category: 'Seating', width: 0.85, depth: 0.85, height: 0.8, color: '#A0522D', icon: '💺' },
  { type: 'dining-chair', name: 'Dining Chair', category: 'Seating', width: 0.45, depth: 0.45, height: 0.85, color: '#A0522D', icon: '🪑' },
  { type: 'coffee-table', name: 'Coffee Table', category: 'Tables', width: 1.2, depth: 0.6, height: 0.45, color: '#DEB887', icon: '☕' },
  { type: 'dining-table', name: 'Dining Table', category: 'Tables', width: 1.6, depth: 0.9, height: 0.75, color: '#D2B48C', icon: '🍽️' },
  { type: 'side-table', name: 'Side Table', category: 'Tables', width: 0.5, depth: 0.5, height: 0.55, color: '#CD853F', icon: '🔲' },
  { type: 'desk', name: 'Office Desk', category: 'Tables', width: 1.4, depth: 0.7, height: 0.75, color: '#DEB887', icon: '🖥️' },
  { type: 'bookshelf', name: 'Bookshelf', category: 'Storage', width: 1.2, depth: 0.35, height: 1.8, color: '#8B4513', icon: '📚' },
  { type: 'tv-stand', name: 'TV Stand', category: 'Storage', width: 1.5, depth: 0.4, height: 0.5, color: '#4A5568', icon: '📺' },
  { type: 'wardrobe', name: 'Wardrobe', category: 'Storage', width: 1.2, depth: 0.6, height: 2.0, color: '#6B4423', icon: '🚪' },
  { type: 'bed-single', name: 'Single Bed', category: 'Beds', width: 0.9, depth: 2.0, height: 0.5, color: '#F5DEB3', icon: '🛏️' },
  { type: 'bed-double', name: 'Double Bed', category: 'Beds', width: 1.4, depth: 2.0, height: 0.5, color: '#F5DEB3', icon: '🛏️' },
  { type: 'bed-king', name: 'King Bed', category: 'Beds', width: 1.8, depth: 2.0, height: 0.5, color: '#F5DEB3', icon: '🛏️' },
  { type: 'rug-small', name: 'Small Rug', category: 'Decor', width: 1.2, depth: 0.8, height: 0.02, color: '#B8860B', icon: '🟫' },
  { type: 'rug-large', name: 'Large Rug', category: 'Decor', width: 2.5, depth: 1.5, height: 0.02, color: '#8B6914', icon: '🟫' },
  { type: 'plant-pot', name: 'Plant Pot', category: 'Decor', width: 0.4, depth: 0.4, height: 0.8, color: '#228B22', icon: '🪴' },
  { type: 'floor-lamp', name: 'Floor Lamp', category: 'Decor', width: 0.35, depth: 0.35, height: 1.6, color: '#2F2F2F', icon: '🪔' },
];

/**
 * Room presets for quick start — supports recognition over recall (Nielsen H6).
 */
export const ROOM_PRESETS = [
  { name: 'Small Bedroom', width: 3, length: 4, height: 2.7, roomType: 'bedroom' },
  { name: 'Living Room', width: 5, length: 4, height: 2.7, roomType: 'living-room' },
  { name: 'Home Office', width: 3.5, length: 3, height: 2.7, roomType: 'office' },
  { name: 'Dining Room', width: 4, length: 3.5, height: 2.7, roomType: 'dining-room' },
  { name: 'Master Bedroom', width: 5, length: 4.5, height: 2.7, roomType: 'bedroom' },
  { name: 'Open Studio', width: 7, length: 5, height: 3.0, roomType: 'living-room' },
  { name: 'Kitchen', width: 4, length: 3, height: 2.7, roomType: 'kitchen' },
  { name: 'Entertainment Room', width: 5.5, length: 4, height: 2.8, roomType: 'entertainment' },
];

/**
 * Design templates with pre-placed furniture — supports novice users
 * and demonstrates real-world usage patterns.
 */
export interface DesignTemplate {
  name: string;
  roomType: string;
  room: Room;
  furniture: Omit<FurnitureItem, 'id'>[];
  icon: string;
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    name: 'Cosy Bedroom',
    roomType: 'bedroom',
    icon: '🛏️',
    room: { width: 4, length: 4.5, height: 2.7, wallColor: '#F5F0E8', floorColor: '#D4A574', shape: 'rectangular', roomType: 'bedroom' },
    furniture: [
      { type: 'bed-double', name: 'Double Bed', x: 1.3, y: 0.3, width: 1.4, depth: 2.0, height: 0.5, rotation: 0, color: '#F5DEB3' },
      { type: 'side-table', name: 'Side Table', x: 0.3, y: 0.5, width: 0.5, depth: 0.5, height: 0.55, rotation: 0, color: '#CD853F' },
      { type: 'wardrobe', name: 'Wardrobe', x: 0.1, y: 3.2, width: 1.2, depth: 0.6, height: 2.0, rotation: 0, color: '#6B4423' },
    ],
  },
  {
    name: 'Modern Office',
    roomType: 'office',
    icon: '🖥️',
    room: { width: 3.5, length: 3, height: 2.7, wallColor: '#E8E6E3', floorColor: '#A8A8A0', shape: 'rectangular', roomType: 'office' },
    furniture: [
      { type: 'desk', name: 'Office Desk', x: 0.5, y: 0.2, width: 1.4, depth: 0.7, height: 0.75, rotation: 0, color: '#DEB887' },
      { type: 'dining-chair', name: 'Office Chair', x: 0.9, y: 1.0, width: 0.45, depth: 0.45, height: 0.85, rotation: 0, color: '#4A4A4A' },
      { type: 'bookshelf', name: 'Bookshelf', x: 2.2, y: 0.1, width: 1.2, depth: 0.35, height: 1.8, rotation: 0, color: '#8B4513' },
    ],
  },
  {
    name: 'Living Room Setup',
    roomType: 'living-room',
    icon: '🛋️',
    room: { width: 5, length: 4, height: 2.7, wallColor: '#FAFAF8', floorColor: '#C8A96E', shape: 'rectangular', roomType: 'living-room' },
    furniture: [
      { type: 'sofa', name: 'Sofa', x: 1.5, y: 2.8, width: 2.0, depth: 0.9, height: 0.85, rotation: 0, color: '#8B7355' },
      { type: 'coffee-table', name: 'Coffee Table', x: 1.9, y: 2.0, width: 1.2, depth: 0.6, height: 0.45, rotation: 0, color: '#DEB887' },
      { type: 'tv-stand', name: 'TV Stand', x: 1.75, y: 0.1, width: 1.5, depth: 0.4, height: 0.5, rotation: 0, color: '#4A5568' },
      { type: 'armchair', name: 'Armchair', x: 0.2, y: 2.5, width: 0.85, depth: 0.85, height: 0.8, rotation: 45, color: '#A0522D' },
    ],
  },
];

export const WALL_COLORS = [
  { name: 'White', value: '#FAFAF8' },
  { name: 'Warm White', value: '#F5F0E8' },
  { name: 'Light Grey', value: '#E8E6E3' },
  { name: 'Sage', value: '#D4DDD2' },
  { name: 'Sky Blue', value: '#D6E4ED' },
  { name: 'Blush', value: '#F0E0DC' },
  { name: 'Cream', value: '#F2E8D5' },
  { name: 'Slate', value: '#A8B0B8' },
];

export const FLOOR_COLORS = [
  { name: 'Light Oak', value: '#D4A574' },
  { name: 'Walnut', value: '#6B4423' },
  { name: 'Maple', value: '#C8A96E' },
  { name: 'Grey Tile', value: '#A8A8A0' },
  { name: 'White Tile', value: '#E8E6E0' },
  { name: 'Dark Wood', value: '#4A3728' },
];

export const FURNITURE_COLORS = [
  { name: 'Natural Wood', value: '#DEB887' },
  { name: 'Dark Walnut', value: '#6B4423' },
  { name: 'White', value: '#F5F5F0' },
  { name: 'Charcoal', value: '#4A4A4A' },
  { name: 'Navy', value: '#2C3E50' },
  { name: 'Olive', value: '#6B7B3A' },
  { name: 'Terracotta', value: '#C0674A' },
  { name: 'Cream', value: '#F5DEB3' },
];

/**
 * Lighting presets for 3D view — supports different visualization contexts.
 * HCI Rationale: Presets reduce configuration burden (Nielsen H7: Flexibility and efficiency).
 */
export interface LightingPreset {
  name: string;
  icon: string;
  ambient: number;
  directionalIntensity: number;
  directionalColor: string;
  directionalPosition: [number, number, number];
  pointIntensity: number;
  pointColor: string;
  shadowsEnabled: boolean;
}

export const LIGHTING_PRESETS: LightingPreset[] = [
  { name: 'Morning', icon: '🌅', ambient: 0.5, directionalIntensity: 0.8, directionalColor: '#FFE4B5', directionalPosition: [3, 6, 5], pointIntensity: 0.2, pointColor: '#FFF8DC', shadowsEnabled: true },
  { name: 'Afternoon', icon: '☀️', ambient: 0.55, directionalIntensity: 1.0, directionalColor: '#FFFAF0', directionalPosition: [5, 8, 5], pointIntensity: 0.3, pointColor: '#FFFFFF', shadowsEnabled: true },
  { name: 'Evening', icon: '🌇', ambient: 0.3, directionalIntensity: 0.6, directionalColor: '#FFB347', directionalPosition: [2, 4, 3], pointIntensity: 0.5, pointColor: '#FFD700', shadowsEnabled: true },
  { name: 'Studio', icon: '💡', ambient: 0.6, directionalIntensity: 0.7, directionalColor: '#FFFFFF', directionalPosition: [5, 10, 5], pointIntensity: 0.4, pointColor: '#FFFFFF', shadowsEnabled: false },
];
