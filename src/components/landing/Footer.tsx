/**
 * Footer — Professional SaaS footer with brand, links, and legal.
 * 
 * HCI Rationale:
 * - Consistent footer supports navigation orientation (Nielsen H1)
 * - Link grouping reduces search time (Gestalt: Proximity)
 * - Brand reinforcement supports recall (Nielsen H6)
 */

import { Box } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-card/50 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Box className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">RoomForge</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Professional interior design and furniture visualization platform for designers, architects, and homeowners.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3">Product</div>
            <ul className="space-y-2">
              {['Features', 'Templates', '2D Editor', '3D View', 'Lighting Studio'].map(item => (
                <li key={item}>
                  <a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3">Resources</div>
            <ul className="space-y-2">
              {['Documentation', 'Tutorials', 'FAQ', 'Blog', 'Changelog'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3">Company</div>
            <ul className="space-y-2">
              {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RoomForge. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Professional Interior Design & Furniture Visualisation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
