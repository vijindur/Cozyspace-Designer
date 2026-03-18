/**
 * TestimonialsSection — User testimonial cards with avatar, role, and quote.
 * 
 * HCI Rationale:
 * - Social proof supports decision-making (Cialdini: Authority + Social Proof)
 * - Personal quotes build emotional connection (Norman: Emotional Design)
 * - Card layout supports scanability (Gestalt: Proximity & Similarity)
 */

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Interior Designer',
    company: 'Studio Nine Design',
    avatar: 'SM',
    quote: 'RoomForge has completely transformed how I present concepts to clients. The 3D visualization is stunning and the drag-and-drop editor is incredibly intuitive.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Architect',
    company: 'Chen & Associates',
    avatar: 'DC',
    quote: 'The real-world dimensions feature is a game-changer. I can plan furniture layouts with absolute precision and clients love the interactive previews.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Homeowner',
    company: '',
    avatar: 'ER',
    quote: 'I redesigned my entire apartment before buying a single piece of furniture. Saved me thousands by getting the layout right the first time.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 block">Testimonials</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See what designers, architects, and homeowners say about their experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-muted-foreground italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
