import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeBadge } from './ModeBadge';
import {
  Recycle,
  BarChart3,
  Wrench,
  HelpCircle,
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Kiosk', path: '/kiosk', icon: Recycle, highlight: true },
    { label: 'Impact Analytics', path: '/impact', icon: BarChart3 },
    { label: 'Operator Console', path: '/operator', icon: Wrench },
    { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-charcoal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-forest-deep text-white flex items-center justify-center shadow-sm group-hover:bg-forest-card transition-colors">
              <Recycle className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-charcoal tracking-tight">ReCycle2Feed</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  AWS Tour '26
                </span>
              </div>
              <p className="text-xs text-charcoal-muted tracking-tight">Turn Waste Into Care</p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    link.highlight
                      ? active
                        ? 'bg-forest-deep text-white shadow-sm'
                        : 'bg-forest-deep/10 text-forest-deep hover:bg-forest-deep hover:text-white'
                      : active
                        ? 'bg-paper-200 text-charcoal font-semibold border border-charcoal-border'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-paper-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mode Badge & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <ModeBadge />
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeBadge />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-paper-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-charcoal-border bg-paper px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-forest-deep text-white'
                    : 'text-charcoal-muted hover:bg-paper-200 hover:text-charcoal'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
