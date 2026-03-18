/**
 * HowItWorksSection — Step-by-step visual workflow guide with numbered steps.
 * 
 * HCI Rationale:
 * - Sequential numbering supports procedural mental models (Norman: Conceptual Model)
 * - Progressive disclosure reduces cognitive load (Nielsen H8)
 * - Visual anchors (images) support recognition over recall (Nielsen H6)
 * - Clear step progression reduces user anxiety (Shneiderman: Informative Feedback)
 */

import { motion } from 'framer-motion';
import showcaseBedroom from '@/assets/showcase-bedroom.jpg';
import showcaseKitchen from '@/assets/showcase-kitchen.jpg';
import showcaseLiving from '@/assets/showcase-living.jpg';

const steps = [
  {
    step: '01',
    title: 'Choose Your Room',
    desc: 'Select a room type, shape, and dimensions. Set wall, floor, and ceiling colours with a full colour wheel.',
    image: showcaseBedroom,
    alt: 'Room configuration wizard showing bedroom setup',
  },
  {
    step: '02',
    title: 'Place Your Furniture',
    desc: 'Drag items from the catalogue onto your 2D canvas. Snap to grid, rotate, resize, and duplicate with precision controls.',
    image: showcaseKitchen,
    alt: 'Kitchen layout being designed in the 2D editor',
  },
  {
    step: '03',
    title: 'Visualize in 3D',
    desc: 'Switch to immersive 3D view with realistic lighting, multiple camera angles, and professional render quality.',
    image: showcaseLiving,
    alt: 'Living room rendered in photorealistic 3D view',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 block">How It Works</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Three Steps to Your Dream Space
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From blank canvas to photorealistic render in minutes — no design experience required.
          </p>
        </motion.div>

        <div className="space-y-20">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                i % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-display font-bold text-primary/20">{s.step}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
