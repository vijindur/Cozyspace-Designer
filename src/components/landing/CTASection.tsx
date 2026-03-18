/**
 * CTASection — Final conversion section with strong visual emphasis.
 * 
 * HCI Rationale:
 * - Clear call-to-action reduces decision friction (Hick's Law)
 * - Visual contrast draws attention to primary action (Gestalt: Figure-Ground)
 * - Repeated CTA at page bottom captures scroll-through users (Serial Position Effect)
 */

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/90 to-primary p-12 md:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-foreground/10 blur-2xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground text-xs font-medium mb-6">
              <Sparkles className="h-3 w-3" />
              Free to Start
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              Ready to Transform<br />Your Space?
            </h2>

            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 leading-relaxed">
              Join thousands of designers creating stunning room layouts. 
              No credit card required — start designing in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-sm font-semibold rounded-xl gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => navigate('/dashboard')}
              >
                Start Designing Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
