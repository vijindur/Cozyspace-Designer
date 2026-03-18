/**
 * StatsSection — Key metrics strip to build credibility and trust.
 * 
 * HCI Rationale:
 * - Social proof reduces decision uncertainty (Cialdini: Social Proof)
 * - Quantified metrics build trust (Nielsen H1: Visibility of System Status)
 * - Counter animation draws attention without disruption (Preattentive Processing)
 */

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { value: 2000, suffix: '+', label: 'Designers Trust Us' },
  { value: 15, suffix: 'K+', label: 'Rooms Designed' },
  { value: 50, suffix: '+', label: 'Furniture Items' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/10 p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
