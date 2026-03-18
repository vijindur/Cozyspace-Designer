/**
 * Multi-step room creation wizard — guides users through room configuration.
 * 
 * HCI Rationale: Stepped workflow supports progressive disclosure (Norman),
 * reduces cognitive load by chunking decisions. Live preview before commitment
 * supports error prevention (Nielsen H5) and user confidence. Back navigation
 * enables error recovery (Nielsen H3).
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDesign } from '@/contexts/DesignContext';
import { useNavigate } from 'react-router-dom';
import { ROOM_PRESETS, WALL_COLORS, FLOOR_COLORS, ROOM_TYPES, ROOM_SHAPES, Room } from '@/types/design';
import ColorPicker from '@/components/ui/color-picker';
import { Plus, ChevronRight, ChevronLeft, Eye } from 'lucide-react';

const STEPS = ['Type', 'Shape & Size', 'Colours', 'Preview'];

const NewDesignDialog = () => {
  const { createDesign } = useDesign();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  // Form state
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState('living-room');
  const [customType, setCustomType] = useState('');
  const [shape, setShape] = useState<Room['shape']>('rectangular');
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [customWidth, setCustomWidth] = useState('5');
  const [customLength, setCustomLength] = useState('4');
  const [customHeight, setCustomHeight] = useState('2.7');
  const [wallColor, setWallColor] = useState(WALL_COLORS[0].value);
  const [floorColor, setFloorColor] = useState(FLOOR_COLORS[0].value);
  const [ceilingColor, setCeilingColor] = useState('#FFFFFF');
  const [usePreset, setUsePreset] = useState(true);

  const resetForm = () => {
    setStep(0);
    setName('');
    setRoomType('living-room');
    setCustomType('');
    setShape('rectangular');
    setSelectedPreset(1);
    setCustomWidth('5');
    setCustomLength('4');
    setCustomHeight('2.7');
    setWallColor(WALL_COLORS[0].value);
    setFloorColor(FLOOR_COLORS[0].value);
    setCeilingColor('#FFFFFF');
    setUsePreset(true);
  };

  const getRoom = (): Room => {
    const preset = ROOM_PRESETS[selectedPreset];
    return {
      width: usePreset ? preset.width : parseFloat(customWidth) || 5,
      length: usePreset ? preset.length : parseFloat(customLength) || 4,
      height: usePreset ? preset.height : parseFloat(customHeight) || 2.7,
      wallColor,
      floorColor,
      ceilingColor,
      shape,
      roomType: roomType === 'custom' ? customType || 'Custom' : roomType,
    };
  };

  const handleCreate = () => {
    const room = getRoom();
    const finalType = roomType === 'custom' ? customType : ROOM_TYPES.find(r => r.id === roomType)?.name || roomType;
    const designName = name.trim() || `${finalType} Design`;
    createDesign(designName, room);
    setOpen(false);
    resetForm();
    navigate('/editor');
  };

  const room = getRoom();

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <button className="group border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            New Design
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create New Design</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-all ${
                  i === step ? 'bg-primary text-primary-foreground' :
                  i < step ? 'bg-primary/20 text-primary cursor-pointer' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="space-y-4 mt-2">
          {/* Step 0: Room Type */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="design-name">Design Name</Label>
                <Input
                  id="design-name"
                  placeholder="e.g. Living Room Concept A"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Room Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ROOM_TYPES.map(rt => (
                    <button
                      key={rt.id}
                      onClick={() => setRoomType(rt.id)}
                      className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
                        roomType === rt.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{rt.icon}</span>
                        <div>
                          <div className="font-medium text-xs">{rt.name}</div>
                          <div className="text-muted-foreground text-[10px]">{rt.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {roomType === 'custom' && (
                  <Input
                    placeholder="Enter custom room type..."
                    value={customType}
                    onChange={e => setCustomType(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </>
          )}

          {/* Step 1: Shape & Dimensions */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Room Shape</Label>
                <div className="grid grid-cols-4 gap-2">
                  {ROOM_SHAPES.map(rs => (
                    <button
                      key={rs.id}
                      onClick={() => setShape(rs.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        shape === rs.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="text-xl mb-1">{rs.icon}</div>
                      <div className="text-[10px] font-medium">{rs.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Dimensions</Label>
                <div className="flex gap-2">
                  <Button variant={usePreset ? 'default' : 'outline'} size="sm" onClick={() => setUsePreset(true)}>Preset</Button>
                  <Button variant={!usePreset ? 'default' : 'outline'} size="sm" onClick={() => setUsePreset(false)}>Custom</Button>
                </div>

                {usePreset ? (
                  <div className="grid grid-cols-2 gap-2">
                    {ROOM_PRESETS.map((preset, i) => (
                      <button
                        key={preset.name}
                        onClick={() => setSelectedPreset(i)}
                        className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
                          selectedPreset === i
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="font-medium text-xs">{preset.name}</div>
                        <div className="text-muted-foreground text-[10px] mt-0.5">
                          {preset.width}m × {preset.length}m × {preset.height}m
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Width (m)</Label>
                      <Input value={customWidth} onChange={e => setCustomWidth(e.target.value)} type="number" min="2" max="20" step="0.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Length (m)</Label>
                      <Input value={customLength} onChange={e => setCustomLength(e.target.value)} type="number" min="2" max="20" step="0.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Height (m)</Label>
                      <Input value={customHeight} onChange={e => setCustomHeight(e.target.value)} type="number" min="2" max="5" step="0.1" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 2: Colours with colour wheel */}
          {step === 2 && (
            <>
              <ColorPicker
                label="Wall Colour"
                value={wallColor}
                onChange={setWallColor}
                presets={WALL_COLORS}
              />
              <ColorPicker
                label="Floor Colour"
                value={floorColor}
                onChange={setFloorColor}
                presets={FLOOR_COLORS}
              />
              <ColorPicker
                label="Ceiling Colour"
                value={ceilingColor}
                onChange={setCeilingColor}
                presets={[
                  { name: 'White', value: '#FFFFFF' },
                  { name: 'Off-White', value: '#FAF8F5' },
                  { name: 'Light Grey', value: '#ECECEC' },
                ]}
              />
            </>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 text-primary" /> Room Preview
              </div>
              <div className="rounded-xl border p-4 bg-muted/30">
                {/* Mini preview of the room */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="border-2 border-foreground/20 relative"
                    style={{
                      width: Math.min(room.width * 40, 280),
                      height: Math.min(room.length * 40, 200),
                      backgroundColor: room.floorColor,
                      clipPath: shape === 'l-shaped'
                        ? 'polygon(0% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 100%, 0% 100%)'
                        : shape === 'u-shaped'
                        ? 'polygon(0% 0%, 100% 0%, 100% 100%, 75% 100%, 75% 65%, 25% 65%, 25% 100%, 0% 100%)'
                        : undefined,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-medium bg-background/80 px-2 py-0.5 rounded text-foreground">
                        {room.width}m × {room.length}m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Type:</span> {roomType === 'custom' ? customType || 'Custom' : ROOM_TYPES.find(r => r.id === roomType)?.name}</div>
                  <div><span className="text-muted-foreground">Shape:</span> {ROOM_SHAPES.find(s => s.id === shape)?.name}</div>
                  <div><span className="text-muted-foreground">Height:</span> {room.height}m</div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Walls:</span>
                    <div className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: wallColor }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Floor:</span>
                    <div className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: floorColor }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Ceiling:</span>
                    <div className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: ceilingColor }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} className="gap-1">
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                Create Design
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewDesignDialog;
