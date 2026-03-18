/**
 * HeroSection — Premium SaaS hero with split layout, animated typography, and floating UI elements.
 * 
 * HCI Rationale:
 * - Visual hierarchy guides attention (Gestalt: Figure-Ground)
 * - Progressive disclosure: Hero → CTA → secondary info (Nielsen H8: Aesthetic & Minimalist)
 * - Animated entrance reduces perceived load time (Norman: Emotional Design)
 * - Split layout balances information density (Shneiderman: Overview first)
 */

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroRoom from '@/assets/hero-room-3d.jpg';
import heroFloorplan from '@/assets/hero-floorplan.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[100px]" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Professional Interior Design Platform
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6"
            >
              Design Rooms That
              <span className="relative inline-block ml-2">
                <span className="text-primary">Inspire</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary/40 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              Drag-and-drop furniture into precise 2D layouts, then visualize in stunning 3D 
              with realistic lighting and materials. Built for designers, architects, and anyone 
              reimagining their space.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-sm font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                onClick={() => navigate('/dashboard')}
              >
                Start Designing Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm font-semibold rounded-xl gap-2"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="h-4 w-4" />
                See How It Works
              </Button>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary"
                  >
                    {['JD', 'KS', 'ML', 'AR'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground text-xs">Loved by 2,000+ designers</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Visual showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Main 3D render image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10 border border-border/50">
              <img
                src={heroRoom}
                alt="RoomForge 3D interior design visualization showing a modern living room"
                className="w-full h-auto object-cover"
                loading="eager"
              />
              {/* Overlay badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-lg border border-border/50 text-xs font-semibold flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                3D Preview
              </div>
            </div>

            {/* Floating floorplan card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 w-36 md:w-44 rounded-xl overflow-hidden shadow-xl border border-border/50 bg-card"
            >
              <img
                src={heroFloorplan}
                alt="2D floor plan layout view"
                className="w-full h-auto"
                loading="eager"
              />
              <div className="px-3 py-2 text-[10px] font-medium text-muted-foreground">
                2D Layout View
              </div>
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -top-4 -right-4 md:right-4 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-md border border-border/50 shadow-lg"
            >
              <div className="text-[10px] text-muted-foreground mb-1">Render Quality</div>
              <div className="text-sm font-bold text-primary">Ultra HD</div>
              <div className="flex gap-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1 w-5 rounded-full bg-primary" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
