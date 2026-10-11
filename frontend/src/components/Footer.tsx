import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Heart, ExternalLink, Bot, Cpu, Terminal, GitBranch } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cyber-surface border-t border-cyber-border mt-20 pt-10 pb-12 text-xs font-mono text-cyber-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top telemetry bar */}
        <div className="border border-cyber-border bg-cyber-bg p-3 rounded-lg mb-10 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-neon-green font-bold">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              STATUS: NOMINAL
            </span>
            <span className="text-cyber-border">/</span>
            <span className="text-neon-cyan">AWS DYNAMODB: CONDITIONAL IDEMPOTENCY</span>
            <span className="text-cyber-border">/</span>
            <span className="text-neon-amber">14/14 UNIT TESTS PASSING</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Jtss-ux/recycle2feed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-muted hover:text-neon-green flex items-center gap-1 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GH: Jtss-ux/recycle2feed</span>
            </a>
            <span className="text-cyber-border">/</span>
            <a
              href="https://youtu.be/KCqz4FkRvRI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-amber hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>DEMO VIDEO (2m 48s)</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-cyber-card border border-neon-green/40 flex items-center justify-center">
                <Recycle className="w-4 h-4 text-neon-green" />
              </div>
              <span className="font-bold text-base text-cyber-text tracking-wider">ReCycle2Feed // HUD</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-md font-sans text-cyber-muted">
              An intelligent, closed-loop smart reverse-vending system bridging urban source-segregation with responsible, measured community animal feeding through AWS Serverless and IoT telemetry.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green text-[10px]">
                EVENT 02: ENVIRONMENTAL HACKS
              </span>
              <span className="px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px]">
                WASTE & ENERGY TRACK
              </span>
              <span className="px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-[10px]">
                RULE 03 AI DISCLOSED
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-cyber-text mb-3 text-neon-green">
              // TELEMETRY SCREENS
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/kiosk" className="hover:text-neon-green transition-colors flex items-center gap-1.5"><Terminal className="w-3 h-3 text-neon-green" /> Smart Kiosk (Bilingual)</Link></li>
              <li><Link to="/impact" className="hover:text-neon-cyan transition-colors flex items-center gap-1.5"><Terminal className="w-3 h-3 text-neon-cyan" /> Impact & Ledger Audit</Link></li>
              <li><Link to="/operator" className="hover:text-neon-amber transition-colors flex items-center gap-1.5"><Terminal className="w-3 h-3 text-neon-amber" /> Operator Console</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyber-text transition-colors flex items-center gap-1.5"><Terminal className="w-3 h-3 text-cyber-muted" /> Cloud & IoT Architecture</Link></li>
              <li><Link to="/settings" className="hover:text-cyber-text transition-colors flex items-center gap-1.5"><Terminal className="w-3 h-3 text-cyber-muted" /> Config & Health Check</Link></li>
            </ul>
          </div>

          {/* Col 3: Ethical & Safety Disclosure */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-cyber-text mb-3 text-neon-cyan">
              // INTEGRITY PROTOCOLS
            </h4>
            <p className="text-[11px] leading-relaxed font-sans text-cyber-muted">
              <strong className="text-neon-amber">Honesty Disclosure:</strong> In this prototype, hardware dispensing is simulated unless connected to verified IoT sensors. Human food assistance is a planned future sealed-pack module and is never commingled with animal hoppers.
            </p>
          </div>
        </div>

        <div className="border-t border-cyber-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <p>© 2026 ReCycle2Feed Builders. Bharat Builds Tour 2026 (WeMakeDevs & AWS). Open-source under MIT.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-neon-green">
              <Heart className="w-3 h-3 text-neon-green fill-current" /> Zero Waste + Community Animal Welfare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
