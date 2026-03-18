/**
 * ShowcaseSection — Room gallery with hover effects and category labels.
 * 
 * HCI Rationale:
 * - Visual examples build user confidence (Norman: Gulf of Evaluation)
 * - Hover-reveal interaction rewards exploration (Shneiderman: Encourage Exploration)
 * - Category labels aid information scent (Information Foraging Theory)
 */

import { motion } from 'framer-motion';
import showcaseBedroom from '@/assets/showcase-bedroom.jpg';
import showcaseKitchen from '@/assets/showcase-kitchen.jpg';
import showcaseLiving from '@/assets/showcase-living.jpg';
import showcaseOffice from '@/assets/showcase-office.jpg';

const rooms = [
  { image: showcaseLiving, label: 'Living Room', dims: '6m × 5m' },
  { image: showcaseBedroom, label: 'Bedroom', dims: '4m × 4m' },
  { image: showcaseKitchen, label: 'Kitchen', dims: '5m × 4m' },
  { image: showcaseOffice, label: 'Home Office', dims: '3.5m × 3m' },
];

const ShowcaseSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 block">Showcase</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Designed with RoomForge
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See what's possible — from cozy bedrooms to expansive open-plan living spaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={r.image}
                alt={`${r.label} designed in RoomForge`}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-sm font-bold text-background">{r.label}</div>
                <div className="text-xs text-background/70">{r.dims}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
