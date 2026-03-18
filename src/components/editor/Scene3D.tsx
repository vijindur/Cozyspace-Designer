/**
 * 3D Room Visualization with camera presets, lighting presets, FPS overlay,
 * and realistic furniture models.
 * 
 * HCI Rationale: Camera presets support recognition over recall (Nielsen H6).
 * FPS overlay provides system status transparency (Nielsen H1). Realistic
 * furniture models improve spatial understanding (Norman's conceptual model).
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useDesign } from '@/contexts/DesignContext';
import { LIGHTING_PRESETS } from '@/types/design';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import FurnitureModel3D from './FurnitureModels';
import * as THREE from 'three';
import {
  Camera, RotateCcw, Sun, Eye, ArrowUp, ArrowRight
} from 'lucide-react';

/** FPS counter component rendered inside Canvas */
const FPSCounter = ({ onFps }: { onFps: (fps: number) => void }) => {
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      onFps(frames.current);
      frames.current = 0;
      lastTime.current = now;
    }
  });

  return null;
};

/** Camera preset controller */
const CameraController = ({ preset, room }: { preset: string | null; room: { width: number; length: number; height: number } }) => {
  const { camera } = useThree();
  const dist = Math.max(room.width, room.length) * 1.2;

  useEffect(() => {
    if (!preset) return;
    const positions: Record<string, [number, number, number]> = {
      front: [0, room.height * 0.5, dist * 1.2],
      top: [0, dist * 1.5, 0.01],
      side: [dist * 1.2, room.height * 0.5, 0],
      'eye-level': [0, 1.65, dist * 0.8],
      isometric: [dist * 0.7, dist * 0.7, dist * 0.7],
    };
    const pos = positions[preset];
    if (pos) {
      camera.position.set(...pos);
      camera.lookAt(0, room.height * 0.3, 0);
      camera.updateProjectionMatrix();
    }
  }, [preset, camera, room, dist]);

  return null;
};

/** Wall component */
const Wall = ({ position, args, color }: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
}) => (
  <mesh position={position}>
    <boxGeometry args={args} />
    <meshStandardMaterial color={color} side={THREE.DoubleSide} />
  </mesh>
);

/** Build walls based on room shape */
const RoomWalls = ({ room }: { room: { width: number; length: number; height: number; wallColor: string; shape: string } }) => {
  const { width, length, height, wallColor, shape } = room;
  const t = 0.08; // wall thickness

  if (shape === 'l-shaped') {
    const cutW = width * 0.4;
    const cutL = length * 0.4;
    return (
      <>
        {/* Back wall full */}
        <Wall position={[0, height / 2, -length / 2]} args={[width, height, t]} color={wallColor} />
        {/* Left wall full */}
        <Wall position={[-width / 2, height / 2, 0]} args={[t, height, length]} color={wallColor} />
        {/* Right wall bottom portion */}
        <Wall position={[width / 2, height / 2, (length / 2 - (length - cutL) / 2)]} args={[t, height, length - cutL]} color={wallColor} />
        {/* Front wall left portion */}
        <Wall position={[(-width / 2 + (width - cutW) / 2) / 1, height / 2, length / 2]} args={[width - cutW, height, t]} color={wallColor} />
        {/* Inner L walls */}
        <Wall position={[width / 2 - cutW, height / 2, -length / 2 + (length - cutL) / 2 + 0.02]} args={[t, height, cutL]} color={wallColor} />
        <Wall position={[width / 2 - cutW / 2, height / 2, -length / 2 + (length - cutL)]} args={[cutW, height, t]} color={wallColor} />
      </>
    );
  }

  if (shape === 'u-shaped') {
    const cutW = width * 0.5;
    const cutL = length * 0.35;
    return (
      <>
        <Wall position={[0, height / 2, -length / 2]} args={[width, height, t]} color={wallColor} />
        <Wall position={[-width / 2, height / 2, 0]} args={[t, height, length]} color={wallColor} />
        <Wall position={[width / 2, height / 2, 0]} args={[t, height, length]} color={wallColor} />
        {/* Front left */}
        <Wall position={[-width / 2 + (width - cutW) / 4, height / 2, length / 2]} args={[(width - cutW) / 2, height, t]} color={wallColor} />
        {/* Front right */}
        <Wall position={[width / 2 - (width - cutW) / 4, height / 2, length / 2]} args={[(width - cutW) / 2, height, t]} color={wallColor} />
        {/* Inner U walls */}
        <Wall position={[-cutW / 2, height / 2, length / 2 - cutL / 2]} args={[t, height, cutL]} color={wallColor} />
        <Wall position={[cutW / 2, height / 2, length / 2 - cutL / 2]} args={[t, height, cutL]} color={wallColor} />
        <Wall position={[0, height / 2, length / 2 - cutL]} args={[cutW, height, t]} color={wallColor} />
      </>
    );
  }

  // rectangular / square: 3 walls (open front)
  return (
    <>
      <Wall position={[0, height / 2, -length / 2]} args={[width, height, t]} color={wallColor} />
      <Wall position={[-width / 2, height / 2, 0]} args={[t, height, length]} color={wallColor} />
      <Wall position={[width / 2, height / 2, 0]} args={[t, height, length]} color={wallColor} />
    </>
  );
};

const RoomScene = () => {
  const { currentDesign, selectedFurnitureId, lightingPreset } = useDesign();
  if (!currentDesign) return null;

  const { room, furniture } = currentDesign;

  return (
    <>
      <ambientLight intensity={lightingPreset.ambient} />
      <directionalLight
        position={lightingPreset.directionalPosition}
        intensity={lightingPreset.directionalIntensity}
        color={lightingPreset.directionalColor}
        castShadow={lightingPreset.shadowsEnabled}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-2, 4, -2]} intensity={lightingPreset.pointIntensity} color={lightingPreset.pointColor} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[room.width, room.length]} />
        <meshStandardMaterial color={room.floorColor} roughness={0.8} />
      </mesh>

      {/* Walls */}
      <RoomWalls room={room} />

      {/* Furniture — realistic models */}
      {furniture.map(item => (
        <FurnitureModel3D
          key={item.id}
          item={item}
          roomWidth={room.width}
          roomLength={room.length}
          isSelected={selectedFurnitureId === item.id}
        />
      ))}
    </>
  );
};

const Scene3D = () => {
  const { currentDesign, lightingPreset, setLightingPreset } = useDesign();
  const [fps, setFps] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<string | null>(null);

  const handleCameraPreset = useCallback((preset: string) => {
    setCameraPreset(preset);
    setTimeout(() => setCameraPreset(null), 100);
  }, []);

  if (!currentDesign) return null;
  const { room } = currentDesign;
  const camDist = Math.max(room.width, room.length) * 1.2;

  const cameraButtons = [
    { id: 'front', label: 'Front', icon: <Camera className="h-3 w-3" /> },
    { id: 'top', label: 'Top', icon: <ArrowUp className="h-3 w-3" /> },
    { id: 'side', label: 'Side', icon: <ArrowRight className="h-3 w-3" /> },
    { id: 'eye-level', label: 'Eye Level', icon: <Eye className="h-3 w-3" /> },
    { id: 'isometric', label: 'Isometric', icon: <RotateCcw className="h-3 w-3" /> },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'hsl(var(--canvas-bg))' }}>
      <div className="h-10 border-b bg-card flex items-center px-2 gap-1 shrink-0">
        {cameraButtons.map(cb => (
          <Tooltip key={cb.id}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1" onClick={() => handleCameraPreset(cb.id)}>
                {cb.icon}
                <span className="hidden md:inline">{cb.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">{cb.label} View</TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-5 bg-border mx-1" />

        {LIGHTING_PRESETS.map(lp => (
          <Tooltip key={lp.name}>
            <TooltipTrigger asChild>
              <Button
                variant={lightingPreset.name === lp.name ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2 text-[10px] gap-1"
                onClick={() => setLightingPreset(lp)}
              >
                <span>{lp.icon}</span>
                <span className="hidden lg:inline">{lp.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">{lp.name} Lighting</TooltipContent>
          </Tooltip>
        ))}

        <div className="flex-1" />
        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {fps} FPS
        </span>
      </div>

      <div className="flex-1">
        <Canvas
          shadows
          camera={{
            position: [camDist * 0.7, camDist * 0.6, camDist * 0.9],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
        >
          <FPSCounter onFps={setFps} />
          <CameraController preset={cameraPreset} room={room} />
          <RoomScene />
          <gridHelper
            args={[Math.max(room.width, room.length) * 2, Math.max(room.width, room.length) * 4, '#ccc', '#e8e8e8']}
            position={[0, -0.01, 0]}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.1}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={1}
            maxDistance={20}
            target={[0, room.height * 0.3, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Scene3D;
