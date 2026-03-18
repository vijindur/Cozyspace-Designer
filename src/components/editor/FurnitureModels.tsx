/**
 * Realistic 3D furniture models using Three.js primitives.
 * 
 * HCI Rationale: Realistic representations improve spatial understanding
 * and support accurate mental models (Norman's conceptual model principle).
 * Users can better judge proportions and aesthetics with recognizable shapes
 * versus abstract boxes.
 */

import * as THREE from 'three';

interface FurnitureModelProps {
  item: {
    type: string;
    width: number;
    depth: number;
    height: number;
    color: string;
    rotation: number;
    x: number;
    y: number;
    name: string;
    opacity?: number;
  };
  roomWidth: number;
  roomLength: number;
  isSelected?: boolean;
}

const mat = (color: string, roughness = 0.7, metalness = 0.1, opacity = 1) => (
  <meshStandardMaterial 
    color={color} 
    roughness={roughness} 
    metalness={metalness}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

const darken = (hex: string, amount = 0.15): string => {
  const c = hex.replace('#', '');
  const r = Math.max(0, Math.round(parseInt(c.substring(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(c.substring(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(c.substring(4, 6), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const lighten = (hex: string, amount = 0.2): string => {
  const c = hex.replace('#', '');
  const r = Math.min(255, Math.round(parseInt(c.substring(0, 2), 16) + (255 - parseInt(c.substring(0, 2), 16)) * amount));
  const g = Math.min(255, Math.round(parseInt(c.substring(2, 4), 16) + (255 - parseInt(c.substring(2, 4), 16)) * amount));
  const b = Math.min(255, Math.round(parseInt(c.substring(4, 6), 16) + (255 - parseInt(c.substring(4, 6), 16)) * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/** Sofa: seat base + back cushion + two armrests */
const SofaModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const seatH = h * 0.4;
  const backH = h * 0.55;
  const armW = d * 0.15;
  const cushionColor = lighten(color, 0.1);

  return (
    <group>
      {/* Legs */}
      {[[-w/2 + 0.05, 0.05, -d/2 + 0.05], [w/2 - 0.05, 0.05, -d/2 + 0.05], [-w/2 + 0.05, 0.05, d/2 - 0.05], [w/2 - 0.05, 0.05, d/2 - 0.05]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          {mat(darken(color, 0.3), 0.5, 0.2, opacity)}
        </mesh>
      ))}
      {/* Seat */}
      <mesh position={[0, seatH / 2 + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, seatH, d]} />
        {mat(cushionColor, 0.85, 0.05, opacity)}
      </mesh>
      {/* Back */}
      <mesh position={[0, seatH + backH / 2 + 0.1, -d / 2 + 0.08]} castShadow>
        <boxGeometry args={[w - armW * 2, backH, 0.16]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
      {/* Left arm */}
      <mesh position={[-w / 2 + armW / 2, seatH / 2 + 0.2, 0]} castShadow>
        <boxGeometry args={[armW, seatH + 0.15, d]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
      {/* Right arm */}
      <mesh position={[w / 2 - armW / 2, seatH / 2 + 0.2, 0]} castShadow>
        <boxGeometry args={[armW, seatH + 0.15, d]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
    </group>
  );
};

/** Armchair: similar to sofa but rounder arms */
const ArmchairModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const seatH = h * 0.38;
  return (
    <group>
      {/* Legs */}
      {[[-w/2 + 0.05, 0.04, -d/2 + 0.05], [w/2 - 0.05, 0.04, -d/2 + 0.05], [-w/2 + 0.05, 0.04, d/2 - 0.05], [w/2 - 0.05, 0.04, d/2 - 0.05]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.08, 8]} />
          {mat(darken(color, 0.3), 0.5, 0.2, opacity)}
        </mesh>
      ))}
      {/* Seat cushion */}
      <mesh position={[0, seatH / 2 + 0.08, 0.03]} castShadow>
        <boxGeometry args={[w * 0.75, seatH, d * 0.7]} />
        {mat(lighten(color, 0.1), 0.9, 0.02, opacity)}
      </mesh>
      {/* Back */}
      <mesh position={[0, h * 0.55, -d / 2 + 0.08]} castShadow>
        <boxGeometry args={[w * 0.8, h * 0.5, 0.14]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
      {/* Arms */}
      <mesh position={[-w / 2 + 0.08, seatH / 2 + 0.15, 0]} castShadow>
        <boxGeometry args={[0.14, seatH + 0.08, d * 0.9]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
      <mesh position={[w / 2 - 0.08, seatH / 2 + 0.15, 0]} castShadow>
        <boxGeometry args={[0.14, seatH + 0.08, d * 0.9]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
    </group>
  );
};

/** Chair: 4 legs + seat + back */
const ChairModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const legH = h * 0.5;
  const seatThick = 0.04;
  return (
    <group>
      {/* 4 Legs */}
      {[
        [-w / 2 + 0.04, legH / 2, -d / 2 + 0.04],
        [w / 2 - 0.04, legH / 2, -d / 2 + 0.04],
        [-w / 2 + 0.04, legH / 2, d / 2 - 0.04],
        [w / 2 - 0.04, legH / 2, d / 2 - 0.04],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, legH, 8]} />
          {mat(darken(color, 0.2), 0.6, 0.15, opacity)}
        </mesh>
      ))}
      {/* Seat */}
      <mesh position={[0, legH + seatThick / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, seatThick, d]} />
        {mat(color, 0.7, 0.1, opacity)}
      </mesh>
      {/* Backrest */}
      <mesh position={[0, legH + (h - legH) / 2 + seatThick, -d / 2 + 0.02]} castShadow>
        <boxGeometry args={[w * 0.9, h - legH - seatThick, 0.03]} />
        {mat(color, 0.7, 0.1, opacity)}
      </mesh>
    </group>
  );
};

/** Table: 4 legs + tabletop */
const TableModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const topThick = 0.04;
  const legH = h - topThick;
  return (
    <group>
      {/* Legs */}
      {[
        [-w / 2 + 0.05, legH / 2, -d / 2 + 0.05],
        [w / 2 - 0.05, legH / 2, -d / 2 + 0.05],
        [-w / 2 + 0.05, legH / 2, d / 2 - 0.05],
        [w / 2 - 0.05, legH / 2, d / 2 - 0.05],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, legH, 0.05]} />
          {mat(darken(color, 0.15), 0.6, 0.1, opacity)}
        </mesh>
      ))}
      {/* Tabletop */}
      <mesh position={[0, h - topThick / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThick, d]} />
        {mat(color, 0.5, 0.15, opacity)}
      </mesh>
    </group>
  );
};

/** Coffee table: shorter, with shelf */
const CoffeeTableModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const topThick = 0.03;
  const legH = h - topThick;
  return (
    <group>
      {/* Legs */}
      {[
        [-w / 2 + 0.04, legH / 2, -d / 2 + 0.04],
        [w / 2 - 0.04, legH / 2, -d / 2 + 0.04],
        [-w / 2 + 0.04, legH / 2, d / 2 - 0.04],
        [w / 2 - 0.04, legH / 2, d / 2 - 0.04],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, legH, 8]} />
          {mat(darken(color, 0.15), 0.5, 0.2, opacity)}
        </mesh>
      ))}
      {/* Top */}
      <mesh position={[0, h - topThick / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThick, d]} />
        {mat(color, 0.5, 0.15, opacity)}
      </mesh>
      {/* Lower shelf */}
      <mesh position={[0, legH * 0.3, 0]} castShadow>
        <boxGeometry args={[w * 0.85, 0.02, d * 0.7]} />
        {mat(lighten(color, 0.1), 0.6, 0.1, opacity)}
      </mesh>
    </group>
  );
};

/** Bed: frame + mattress + headboard + pillows */
/** Bed: frame + mattress + headboard + pillows */
const BedModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const frameH = h * 0.35;
  const mattressH = h * 0.3;
  return (
    <group>
      {/* Frame / base */}
      <mesh position={[0, frameH / 2, 0]} castShadow>
        <boxGeometry args={[w, frameH, d]} />
        {mat(darken(color, 0.25), 0.7, 0.1, opacity)}
      </mesh>
      {/* Mattress */}
      <mesh position={[0, frameH + mattressH / 2, 0]} castShadow>
        <boxGeometry args={[w - 0.06, mattressH, d - 0.04]} />
        {mat(color, 0.9, 0.02, opacity)}
      </mesh>
      {/* Headboard */}
      <mesh position={[0, frameH + mattressH + 0.2, -d / 2 + 0.04]} castShadow>
        <boxGeometry args={[w, 0.45, 0.06]} />
        {mat(darken(color, 0.3), 0.6, 0.1, opacity)}
      </mesh>
      {/* Pillows */}
      {Array.from({ length: Math.max(1, Math.round(w / 0.55)) }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (i - (Math.max(1, Math.round(w / 0.55)) - 1) / 2) * 0.5,
            frameH + mattressH + 0.08,
            -d / 2 + 0.35
          ]}
          castShadow
        >
          <boxGeometry args={[0.4, 0.1, 0.3]} />
          {mat('#F8F8F0', 0.95, 0.01, opacity)}
        </mesh>
      ))}
    </group>
  );
};

/** Bookshelf: frame with shelves and books */
const BookshelfModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const shelfCount = Math.round(h / 0.4);
  const bookColors = ['#8B0000', '#00008B', '#006400', '#4A0E4E', '#8B4513', '#333333'];
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, h / 2, -d / 2 + 0.01]} castShadow>
        <boxGeometry args={[w, h, 0.02]} />
        {mat(darken(color, 0.1), 0.7, 0.1, opacity)}
      </mesh>
      {/* Side panels */}
      <mesh position={[-w / 2 + 0.02, h / 2, 0]} castShadow>
        <boxGeometry args={[0.04, h, d]} />
        {mat(color, 0.7, 0.1, opacity)}
      </mesh>
      <mesh position={[w / 2 - 0.02, h / 2, 0]} castShadow>
        <boxGeometry args={[0.04, h, d]} />
        {mat(color, 0.7, 0.1, opacity)}
      </mesh>
      {/* Shelves + books */}
      {Array.from({ length: shelfCount + 1 }).map((_, i) => {
        const y = (i / shelfCount) * h;
        return (
          <group key={i}>
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[w - 0.04, 0.03, d]} />
              {mat(color, 0.7, 0.1, opacity)}
            </mesh>
            {/* Books on shelf (except top) */}
            {i < shelfCount && Array.from({ length: Math.floor((w - 0.1) / 0.06) }).map((_, bi) => (
              <mesh
                key={bi}
                position={[
                  -w / 2 + 0.08 + bi * 0.06,
                  y + (h / shelfCount) * 0.4 + 0.02,
                  0
                ]}
                castShadow
              >
                <boxGeometry args={[0.04, (h / shelfCount) * 0.7, d * 0.7]} />
                {mat(bookColors[bi % bookColors.length], 0.8, 0.05, opacity)}
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

/** Wardrobe: tall cabinet with doors */
const WardrobeModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => (
  <group>
    {/* Main body */}
    <mesh position={[0, h / 2, 0]} castShadow>
      <boxGeometry args={[w, h, d]} />
      {mat(color, 0.6, 0.1, opacity)}
    </mesh>
    {/* Door line (center seam) */}
    <mesh position={[0, h / 2, d / 2 + 0.005]}>
      <boxGeometry args={[0.01, h - 0.1, 0.005]} />
      {mat(darken(color, 0.2), 0.7, 0.1, opacity)}
    </mesh>
    {/* Handles */}
    <mesh position={[-0.06, h / 2, d / 2 + 0.02]} castShadow>
      <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
      {mat('#C0C0C0', 0.3, 0.8, opacity)}
    </mesh>
    <mesh position={[0.06, h / 2, d / 2 + 0.02]} castShadow>
      <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
      {mat('#C0C0C0', 0.3, 0.8, opacity)}
    </mesh>
  </group>
);

/** TV Stand: low cabinet with TV */
const TVStandModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => (
  <group>
    {/* Cabinet */}
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      {mat(color, 0.5, 0.15, opacity)}
    </mesh>
    {/* TV Screen */}
    <mesh position={[0, h + 0.4, -d / 2 + 0.04]}>
      <boxGeometry args={[w * 0.85, 0.55, 0.04]} />
      {mat('#111111', 0.3, 0.5, opacity)}
    </mesh>
    {/* Screen face */}
    <mesh position={[0, h + 0.4, -d / 2 + 0.065]}>
      <planeGeometry args={[w * 0.8, 0.48]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.1} metalness={0.3} transparent={opacity < 1} opacity={opacity} />
    </mesh>
    {/* Stand */}
    <mesh position={[0, h + 0.1, -d / 2 + 0.06]}>
      <boxGeometry args={[0.15, 0.06, 0.08]} />
      {mat('#333333', 0.4, 0.6, opacity)}
    </mesh>
  </group>
);

/** Desk: tabletop with side panel / drawer unit */
const DeskModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const topThick = 0.04;
  const legH = h - topThick;
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, h - topThick / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThick, d]} />
        {mat(color, 0.5, 0.15, opacity)}
      </mesh>
      {/* Left panel */}
      <mesh position={[-w / 2 + 0.03, legH / 2, 0]} castShadow>
        <boxGeometry args={[0.04, legH, d - 0.04]} />
        {mat(darken(color, 0.1), 0.6, 0.1, opacity)}
      </mesh>
      {/* Right drawer unit */}
      <mesh position={[w / 2 - 0.15, legH * 0.35, 0]} castShadow>
        <boxGeometry args={[0.28, legH * 0.65, d - 0.04]} />
        {mat(darken(color, 0.1), 0.6, 0.1, opacity)}
      </mesh>
      {/* Drawer handles */}
      {[0.15, 0.35, 0.55].map((yf, i) => (
        <mesh key={i} position={[w / 2 - 0.15, legH * yf, d / 2 - 0.01]}>
          <boxGeometry args={[0.08, 0.015, 0.02]} />
          {mat('#C0C0C0', 0.3, 0.7, opacity)}
        </mesh>
      ))}
    </group>
  );
};

/** Rug: flat rectangle with slight elevation */
const RugModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => (
  <mesh position={[0, h / 2, 0]} receiveShadow>
    <boxGeometry args={[w, h, d]} />
    {mat(color, 0.95, 0.0, opacity)}
  </mesh>
);

/** Plant pot: cylinder pot + green sphere foliage */
const PlantModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const potH = h * 0.35;
  const radius = Math.min(w, d) / 2;
  return (
    <group>
      {/* Pot */}
      <mesh position={[0, potH / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius * 0.8, potH, 12]} />
        {mat('#8B4513', 0.8, 0.05, opacity)}
      </mesh>
      {/* Soil */}
      <mesh position={[0, potH, 0]}>
        <cylinderGeometry args={[radius - 0.02, radius - 0.02, 0.03, 12]} />
        {mat('#3E2723', 0.9, 0.0, opacity)}
      </mesh>
      {/* Foliage */}
      <mesh position={[0, potH + (h - potH) * 0.5, 0]} castShadow>
        <sphereGeometry args={[radius * 1.5, 12, 10]} />
        {mat(color, 0.85, 0.05, opacity)}
      </mesh>
      <mesh position={[radius * 0.4, potH + (h - potH) * 0.65, radius * 0.3]} castShadow>
        <sphereGeometry args={[radius * 1.0, 10, 8]} />
        {mat(lighten(color, 0.15), 0.85, 0.05, opacity)}
      </mesh>
    </group>
  );
};

/** Floor lamp: thin pole + shade */
const FloorLampModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => (
  <group>
    {/* Base */}
    <mesh position={[0, 0.02, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
      {mat(color, 0.4, 0.5, opacity)}
    </mesh>
    {/* Pole */}
    <mesh position={[0, h * 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.015, 0.015, h - 0.2, 8]} />
      {mat(color, 0.4, 0.5, opacity)}
    </mesh>
    {/* Shade */}
    <mesh position={[0, h - 0.12, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.15, 0.22, 12, 1, true]} />
      {mat('#F5F5DC', 0.9, 0.0, opacity)}
    </mesh>
    {/* Light glow */}
    <pointLight position={[0, h - 0.1, 0]} intensity={0.3 * opacity} color="#FFF8DC" distance={2} />
  </group>
);

/** Side table: round top with single pedestal */
const SideTableModel = ({ w, d, h, color, opacity = 1 }: { w: number; d: number; h: number; color: string; opacity?: number }) => {
  const radius = Math.min(w, d) / 2;
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.5, radius * 0.6, 0.03, 12]} />
        {mat(darken(color, 0.15), 0.5, 0.15, opacity)}
      </mesh>
      {/* Pedestal */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, h - 0.06, 8]} />
        {mat(darken(color, 0.1), 0.5, 0.15, opacity)}
      </mesh>
      {/* Top */}
      <mesh position={[0, h - 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.04, 16]} />
        {mat(color, 0.5, 0.15, opacity)}
      </mesh>
    </group>
  );
};

/** Main component — dispatches to the correct model */
const FurnitureModel3D = ({ item, roomWidth, roomLength, isSelected }: FurnitureModelProps) => {
  const x3d = item.x + item.width / 2 - roomWidth / 2;
  const z3d = item.y + item.depth / 2 - roomLength / 2;

  const getModel = () => {
    const props = { w: item.width, d: item.depth, h: item.height, color: item.color, opacity: item.opacity ?? 1 };

    switch (item.type) {
      case 'sofa': return <SofaModel {...props} />;
      case 'armchair': return <ArmchairModel {...props} />;
      case 'dining-chair': return <ChairModel {...props} />;
      case 'coffee-table': return <CoffeeTableModel {...props} />;
      case 'dining-table':
      case 'desk': return item.type === 'desk' ? <DeskModel {...props} /> : <TableModel {...props} />;
      case 'side-table': return <SideTableModel {...props} />;
      case 'bookshelf': return <BookshelfModel {...props} />;
      case 'wardrobe': return <WardrobeModel {...props} />;
      case 'tv-stand': return <TVStandModel {...props} />;
      case 'bed-single':
      case 'bed-double':
      case 'bed-king': return <BedModel {...props} />;
      case 'rug-small':
      case 'rug-large': return <RugModel {...props} />;
      case 'plant-pot': return <PlantModel {...props} />;
      case 'floor-lamp': return <FloorLampModel {...props} />;
      default:
        // Fallback: simple box
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[item.width, item.height, item.depth]} />
            <meshStandardMaterial color={item.color} roughness={0.7} metalness={0.1} transparent={item.opacity !== undefined && item.opacity < 1} opacity={item.opacity ?? 1} />
          </mesh>
        );
    }
  };

  return (
    <group
      position={[x3d, 0, z3d]}
      rotation={[0, (item.rotation * Math.PI) / 180, 0]}
    >
      {getModel()}
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(item.width, item.depth) * 0.6, Math.max(item.width, item.depth) * 0.65, 32]} />
          <meshBasicMaterial color="#2A7B6F" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

export default FurnitureModel3D;
