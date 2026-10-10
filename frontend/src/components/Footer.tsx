import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-paper-100 border-t border-charcoal-border mt-20 pt-12 pb-16 text-sm text-charcoal-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-forest-deep text-white flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-bold text-base text-charcoal">ReCycle2Feed</span>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              An intelligent, closed-loop recycling kiosk platform designed to bridge urban source-segregation with responsible community animal feeding and food assistance programs.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono bg-paper-200 border border-charcoal-border px-3 py-2 rounded-md w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Event 02: Bharat Builds Tour 2026 | Environmental Hacks | Waste & Energy</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-charcoal mb-3">Application</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/kiosk" className="hover:text-forest-deep transition-colors">Smart Recycling Kiosk</Link></li>
              <li><Link to="/impact" className="hover:text-forest-deep transition-colors">Impact Analytics & Audit</Link></li>
              <li><Link to="/operator" className="hover:text-forest-deep transition-colors">Operator Maintenance Console</Link></li>
              <li><Link to="/how-it-works" className="hover:text-forest-deep transition-colors">Hardware & Cloud Architecture</Link></li>
              <li><Link to="/settings" className="hover:text-forest-deep transition-colors">Demo & Cloud Settings</Link></li>
            </ul>
          </div>

          {/* Col 3: Ethical & Safety Disclosure */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-charcoal mb-3">Integrity & Safety</h4>
            <p className="text-xs leading-relaxed text-charcoal-muted">
              <strong>Honesty Disclosure:</strong> In this prototype, hardware dispensing is simulated unless connected to verified IoT sensors. Human food assistance is a planned future sealed-pack module and is never commingled with animal hoppers.
            </p>
          </div>
        </div>

        <div className="border-t border-charcoal-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ReCycle2Feed Builders. Built with React, TypeScript, Tailwind & AWS Serverless.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700">
              <Heart className="w-3.5 h-3.5 fill-current" /> Community Animal Welfare & Zero Waste
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
