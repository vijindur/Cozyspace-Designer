/**
 * FeaturesSection — Bento-grid feature showcase with visual icons and descriptions.
 * 
 * HCI Rationale:
 * - Card-based layout supports recognition over recall (Nielsen H6)
 * - Bento grid creates visual interest while maintaining scanability (Gestalt: Proximity)
 * - Icon + text pairing improves comprehension speed (Dual Coding Theory)
 * - Staggered animations guide eye flow (Fitts's Law: attention guidance)
 */

import { motion } from 'framer-motion';
import { Layers, Eye, Ruler, Box, Palette, Sun, Download, MousePointer2 } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: '2D Layout Editor',
    desc: 'Precision drag-and-drop with grid snapping, axis gizmos, and object locking for pixel-perfect furniture placement.',
    size: 'large' as const,
  },
  {
    icon: Eye,
    title: '3D Visualisation',
    desc: 'Real-time rendering with adjustable camera angles, lighting presets, and realistic material mapping.',
    size: 'large' as const,
  },
  {
    icon: Ruler,
    title: 'Real-World Dimensions',
    desc: 'All furniture scaled to actual proportions — plan with confidence.',
    size: 'small' as const,
  },
  {
    icon: Palette,
    title: 'Full Colour Control',
    desc: 'Colour wheel for walls, floors, ceilings, and individual furniture pieces.',
    size: 'small' as const,
  },
  {
    icon: Sun,
    title: 'Lighting Studio',
    desc: 'Professional lighting presets from morning sun to studio setups.',
    size: 'small' as const,
  },
  {
    icon: MousePointer2,
    title: 'Direct Manipulation',
    desc: 'Rotate, scale, duplicate, and customise any object with intuitive handles.',
    size: 'small' as const,
  },
  {
    icon: Box,
    title: 'Room Templates',
    desc: 'Start from pre-configured bedroom, kitchen, office, or living room layouts.',
    size: 'small' as const,
  },
  {
    icon: Download,
    title: 'Export & Share',
    desc: 'Render in PNG, JPG, or web-ready formats at custom resolutions.',
    size: 'small' as const,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-muted/30" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 block">Features</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Design
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit built for interior designers, architects, and homeowners
            who demand professional-grade results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`group relative p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                f.size === 'large' ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
