# CozySpace Designer

A browser-based room planning tool that lets customers design, visualise, and customise furniture layouts in both 2D and 3D — before moving day.

---

## Features

| Feature | Description |
|---|---|
| Room setup | Define room size (width, length, height), shape (rectangular, square, L-shaped, U-shaped), wall colour, and floor colour |
| New design | Create a blank design or start from a pre-built template (Cosy Bedroom, Modern Office, Living Room Setup) |
| 2D canvas | Drag-and-drop furniture onto a scaled grid with snapping, zoom, rotation, and room boundary enforcement |
| 3D view | Switch to a Three.js rendered 3D scene with orbit controls, camera presets (top, front, side, eye-level, isometric), and lighting presets (Morning, Afternoon, Evening, Studio) |
| Furniture catalogue | 17 items across 5 categories — Seating, Tables, Storage, Beds, Decor — with real-world metric dimensions |
| Colour picker | Per-item colour customisation with preset swatches and a full colour wheel |
| Shade control | Per-item opacity slider (10 %–100 %) applied in both 2D and 3D views |
| Scale / dimensions | Manually adjust width, depth, and height of any placed item |
| Rotation | Slider (0°–360°) and quick-set buttons (0°, 90°, 180°, 270°) |
| Lock | Lock individual items to prevent accidental movement |
| Duplicate | Clone a selected furniture item with a single click |
| Delete | Remove selected items from the canvas |
| Undo / Redo | Up to 50-step history with Ctrl+Z / Ctrl+Shift+Z keyboard shortcuts |
| Save | Persist designs to localStorage; auto-saved on every change |
| Dashboard | Browse, open, and delete all saved designs |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI primitives) |
| 3D rendering | Three.js r160 via `@react-three/fiber` + `@react-three/drei` |
| Routing | React Router DOM v6 |
| State | React Context API + localStorage persistence |
| Animation | Framer Motion |
| Testing | Vitest + Testing Library |
| Linting | ESLint + TypeScript ESLint |

---

## Project Structure

```
src/
├── components/
│   ├── editor/
│   │   ├── Canvas2D.tsx          # 2D drag-and-drop room canvas
│   │   ├── FurnitureCatalog.tsx  # Left-panel item browser
│   │   ├── FurnitureModels.tsx   # 3D mesh models (sofa, bed, wardrobe, etc.)
│   │   ├── PropertiesPanel.tsx   # Right-panel item/room properties
│   │   └── Scene3D.tsx           # Three.js scene, lighting, camera controls
│   ├── dashboard/
│   │   ├── DesignCard.tsx        # Saved design card with open/delete
│   │   └── NewDesignDialog.tsx   # Multi-step room setup dialog
│   ├── landing/                  # Marketing page sections
│   ├── layout/
│   │   └── Navbar.tsx            # Top bar with save, view toggle, undo/redo
│   └── ui/                       # shadcn/ui base components
├── contexts/
│   └── DesignContext.tsx         # Global state: designs, furniture, undo history
├── pages/
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── Editor.tsx
│   └── NotFound.tsx
└── types/
    └── design.ts                 # Core types: FurnitureItem, Room, Design, templates
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/rizad-mohamed/cozyspace-designer.git
cd cozyspace-designer

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build

```bash
npm run build
```

Output is written to `dist/`. Preview the production build with:

```bash
npm run preview
```

### Tests

```bash
# Run once
npm test

# Watch mode
npm run test:watch
```

### Lint

```bash
npm run lint
```

---

## Key Design Decisions

**Metric units throughout** — all room and furniture dimensions are stored in metres and rendered proportionally, so a 1.4 m wide bed looks correct relative to a 4 m wide room in both 2D and 3D.

**Shade as opacity** — the `shade` property on `FurnitureItem` (0.1–1.0) is applied as CSS `opacity` in the 2D canvas and as `MeshStandardMaterial.opacity` with `transparent: true` in the 3D scene, keeping the effect consistent across views.

**Undo/redo is furniture-only** — the 50-step undo stack tracks furniture array snapshots. Room dimension and colour changes are intentionally excluded to keep the history focused on placement decisions.

**localStorage persistence** — designs are serialised to JSON and stored under the key `roomforge-designs` on every state change, so work is never lost on a page refresh.

**L-shaped and U-shaped rooms** — rendered in 2D using CSS `clip-path` polygons and a hatched SVG overlay for the cut-out area; in 3D, wall segments are individually placed to match the shape.

---

## Room Shapes

| Shape | Description |
|---|---|
| Rectangular | Standard rectangle — most common |
| Square | Equal width and length |
| L-shaped | Top-right corner cut out (40 % × 40 %) |
| U-shaped | Bottom-centre notch removed |

---

## Furniture Catalogue

| Category | Items |
|---|---|
| Seating | Sofa, Armchair, Dining Chair |
| Tables | Coffee Table, Dining Table, Side Table, Office Desk |
| Storage | Bookshelf, TV Stand, Wardrobe |
| Beds | Single Bed, Double Bed, King Bed |
| Decor | Small Rug, Large Rug, Plant Pot, Floor Lamp |

---

## Lighting Presets (3D)

| Preset | Ambient | Feel |
|---|---|---|
| Morning | 0.50 | Warm golden, soft shadows |
| Afternoon | 0.55 | Bright neutral, sharp shadows |
| Evening | 0.30 | Warm amber, point light glow |
| Studio | 0.60 | Cool white, no shadows |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + Y` | Redo (alternative) |

---

## Browser Support

Modern evergreen browsers with WebGL support (Chrome, Firefox, Edge, Safari 16+). The 3D view requires a GPU-accelerated context.

---

## License

This project is for academic and demonstration purposes.
