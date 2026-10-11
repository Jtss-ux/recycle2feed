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
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Bot,
  Cpu,
  Database,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'KIOSK', path: '/kiosk', icon: Recycle, highlight: true },
    { label: 'IMPACT LEDGER', path: '/impact', icon: BarChart3 },
    { label: 'OPERATOR HUD', path: '/operator', icon: Wrench },
    { label: 'ARCHITECTURE', path: '/how-it-works', icon: HelpCircle },
    { label: 'CONFIG', path: '/settings', icon: Settings }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-cyber-bg/95 backdrop-blur-md border-b border-cyber-border">
        {/* Top telemetry status ticker */}
        <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-cyber-surface/90 border-b border-cyber-border text-[10px] font-mono tracking-widest text-cyber-muted">
          <div className="flex items-center gap-4">
            <span className="text-neon-green flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping inline-block" />
              SYSTEM: ONLINE
            </span>
            <span className="text-cyber-border">|</span>
            <span>NODE: DTU-CAMPUS-01</span>
            <span className="text-cyber-border">|</span>
            <span className="text-neon-cyan">AWS SERVERLESS: AP-SOUTH-1</span>
            <span className="text-cyber-border">|</span>
            <span>IDEMPOTENCY: DYNAMODB CONDITIONAL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neon-amber">TOUR '26: EVENT 02 (OCT 8–11)</span>
            <span className="text-cyber-border">|</span>
            <span>TRACK: WASTE & ENERGY</span>
            <span className="text-cyber-border">|</span>
            <button
              onClick={() => setShowAiModal(true)}
              className="text-neon-purple hover:underline flex items-center gap-1 font-bold"
            >
              <Bot className="w-3 h-3" />
              AI ASSISTANCE DISCLOSED
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Tagline */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-cyber-card border border-neon-green/40 flex items-center justify-center shadow-neon-green group-hover:border-neon-green transition-all">
                <Recycle className="w-5 h-5 text-neon-green group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg text-cyber-text tracking-wider font-mono glow-green">
                    ReCycle2Feed
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/30 font-semibold tracking-wider">
                    v2.0 HUD
                  </span>
                </div>
                <p className="text-[10px] text-cyber-muted font-mono tracking-widest uppercase">
                  Turn Waste Into Care // AWS Smart RVM
                </p>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium tracking-wider transition-all border ${
                      link.highlight
                        ? active
                          ? 'bg-neon-green/20 text-neon-green border-neon-green shadow-neon-green'
                          : 'bg-neon-green/10 text-neon-green border-neon-green/40 hover:bg-neon-green/20'
                        : active
                          ? 'bg-cyber-card text-neon-cyan border-neon-cyan/50 shadow-neon-cyan'
                          : 'text-cyber-muted border-transparent hover:text-cyber-text hover:bg-cyber-surface hover:border-cyber-border'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mode Badge & Action buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={() => setShowAiModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neon-purple/40 bg-neon-purple/10 hover:bg-neon-purple/20 text-xs font-mono font-bold text-neon-purple transition-all"
                title="View Rule 03 AI Tools & Development Disclosure"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">AI Disclosure</span>
              </button>
              <button
                onClick={() => setShowJudgeModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neon-green/40 bg-neon-green/10 hover:bg-neon-green/20 text-xs font-mono font-bold text-neon-green transition-all shadow-neon-green"
                title="Review project alignment against the 5 judging criteria"
              >
                <Award className="w-3.5 h-3.5 text-neon-green" />
                <span className="hidden xl:inline">Judges' Review</span>
              </button>
              <ModeBadge />
            </div>

            {/* Mobile hamburger button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setShowJudgeModal(true)}
                className="p-1.5 rounded border border-neon-green/40 bg-neon-green/10 text-neon-green"
                aria-label="Judges review"
              >
                <Award className="w-4 h-4" />
              </button>
              <ModeBadge />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded text-cyber-muted hover:text-cyber-text hover:bg-cyber-card focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-cyber-border bg-cyber-surface px-4 pt-2 pb-4 space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-mono font-medium tracking-wider ${
                    active
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/40'
                      : 'text-cyber-muted hover:bg-cyber-card hover:text-cyber-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowAiModal(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-mono font-medium tracking-wider text-neon-purple hover:bg-neon-purple/10"
            >
              <Bot className="w-4 h-4" />
              <span>AI TOOLS DISCLOSURE</span>
            </button>
          </div>
        )}
      </header>

      {/* Judges' 5 Criteria Alignment Review Modal */}
      {showJudgeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="hud-panel rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-neon-green/40 shadow-neon-green">
            <div className="flex items-start justify-between border-b border-cyber-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-neon-green/10 text-neon-green font-bold px-2 py-0.5 rounded border border-neon-green/30 uppercase tracking-widest">
                    CRITERIA EVALUATION MATRIX
                  </span>
                  <span className="text-[10px] font-mono text-cyber-muted">WASTE & ENERGY TRACK</span>
                </div>
                <h3 className="text-xl font-bold text-cyber-text mt-1 flex items-center gap-2 font-mono glow-green">
                  <Award className="w-5 h-5 text-neon-green" />
                  How ReCycle2Feed Aligns With the 5 Judging Criteria
                </h3>
              </div>
              <button
                onClick={() => setShowJudgeModal(false)}
                className="text-cyber-muted hover:text-neon-red p-1 text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Criterion 1 */}
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-neon-green/40 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text flex items-center gap-1.5 text-neon-green">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    01. Idea and Impact (A small problem solved well)
                  </span>
                  <Link
                    to="/impact"
                    onClick={() => setShowJudgeModal(false)}
                    className="text-neon-cyan font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-cyber-muted leading-relaxed font-sans">
                  Solves acute campus & urban PET/can littering by offering a direct, tangible reward: calibrated community animal feeding. Includes an explicit <strong>Unit Economics & Scrap Recovery Feasibility Model</strong> (crushed PET at ₹38/kg vs feed at ₹1.70/portion).
                </p>
              </div>

              {/* Criterion 2 */}
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-neon-cyan/40 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text flex items-center gap-1.5 text-neon-cyan">
                    <CheckCircle2 className="w-4 h-4 text-neon-cyan" />
                    02. Built on AWS (Free Tier & Open-Source Tools)
                  </span>
                  <Link
                    to="/how-it-works"
                    onClick={() => setShowJudgeModal(false)}
                    className="text-neon-cyan font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-cyber-muted leading-relaxed font-sans">
                  Configured via AWS SAM (<code>infrastructure/template.yaml</code>) deploying API Gateway HTTP API v2, Node.js 20.x Lambda on ARM64 Graviton, Amazon DynamoDB (3 tables with conditional idempotency writes), and LocalStack open-source configuration for offline testing.
                </p>
              </div>

              {/* Criterion 3 */}
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-neon-green/40 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text flex items-center gap-1.5 text-neon-green">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    03. Design & Usability (Intuitive for Anyone)
                  </span>
                  <Link
                    to="/kiosk"
                    onClick={() => setShowJudgeModal(false)}
                    className="text-neon-cyan font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Open Kiosk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-cyber-muted leading-relaxed font-sans">
                  Public kiosk is completely self-guiding with clear visual steps, bilingual English & Hindi prompts (<em>बोतल डालें</em>), large accessible touch targets, and instant plain-English explanations when an unsupported item is inserted.
                </p>
              </div>

              {/* Criterion 4 */}
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-neon-green/40 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text flex items-center gap-1.5 text-neon-green">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    04. The Execution (Working Software, Not Slides)
                  </span>
                  <Link
                    to="/operator"
                    onClick={() => setShowJudgeModal(false)}
                    className="text-neon-cyan font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Operator Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-cyber-muted leading-relaxed font-sans">
                  <strong>14 out of 14 automated unit tests passing.</strong> The complete end-to-end loop executes deterministically: deposit container → sensor validation → volume compaction → DynamoDB deduplication → metered dispensing → receipt logging → operator maintenance alerts.
                </p>
              </div>

              {/* Criterion 5 */}
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-neon-amber/40 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text flex items-center gap-1.5 text-neon-amber">
                    <CheckCircle2 className="w-4 h-4 text-neon-amber" />
                    05. The Demo Video (Recorded, 2m 48s, under 3-min rule)
                  </span>
                  <a
                    href="https://youtu.be/KCqz4FkRvRI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-amber font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Watch Video</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-cyber-muted leading-relaxed font-sans">
                  Official 2-minute 48-second Full HD video uploaded to YouTube demonstrating what it does, who it is for, and where AWS fits into the system.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowJudgeModal(false)}
              className="w-full py-3 rounded-xl bg-neon-green/10 border border-neon-green text-neon-green font-bold text-xs shadow-neon-green hover:bg-neon-green/20 transition-all font-mono tracking-widest uppercase"
            >
              [ CLOSE EVALUATION MATRIX ]
            </button>
          </div>
        </div>
      )}

      {/* AI Tools & Rule 03 Transparency Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="hud-panel rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-neon-purple/50 shadow-neon-cyan">
            <div className="flex items-start justify-between border-b border-cyber-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-neon-purple/10 text-neon-purple font-bold px-2 py-0.5 rounded border border-neon-purple/30 uppercase tracking-widest">
                    HACKATHON RULE 03 COMPLIANCE
                  </span>
                  <span className="text-[10px] font-mono text-cyber-muted">WE MAKE DEVS & AWS TOUR '26</span>
                </div>
                <h3 className="text-xl font-bold text-cyber-text mt-1 flex items-center gap-2 font-mono glow-purple">
                  <Bot className="w-5 h-5 text-neon-purple" />
                  AI Tools & Assistance Disclosure
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-cyber-muted hover:text-neon-red p-1 text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                <span className="text-neon-purple font-bold text-sm block">
                  Rule 03 Requirement:
                </span>
                <p className="text-cyber-muted leading-relaxed font-sans">
                  <em>"You can use AI coding tools. List the ones you used in your writeup."</em>
                  — Official Tour Rulebook. We disclose all tools transparently below:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-cyber-card border border-neon-purple/30 space-y-1">
                  <span className="text-neon-purple font-bold text-xs block">
                    🤖 Antigravity AI (Google DeepMind)
                  </span>
                  <p className="text-cyber-muted text-[11px] font-sans">
                    Primary coding agent used for architecture scaffolding, SAM template authoring, and test generation.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-cyber-card border border-neon-cyan/30 space-y-1">
                  <span className="text-neon-cyan font-bold text-xs block">
                    ⚡ Gemini 3.1 Pro & Flash
                  </span>
                  <p className="text-cyber-muted text-[11px] font-sans">
                    Assisted with dual-repository TypeScript interfaces and unit economics formulation.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-cyber-card border border-neon-green/30 space-y-1">
                  <span className="text-neon-green font-bold text-xs block">
                    🧠 Claude Sonnet 4.6
                  </span>
                  <p className="text-cyber-muted text-[11px] font-sans">
                    Assisted with UX accessibility review and bilingual English/Hindi wording.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-cyber-card border border-neon-amber/30 space-y-1">
                  <span className="text-neon-amber font-bold text-xs block">
                    🛡️ Human Student Authorship
                  </span>
                  <p className="text-cyber-muted text-[11px] font-sans">
                    All problem selection, circuit decisions, business analytics model, and ethical disclosures designed by team.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-neon-green/5 border border-neon-green/20 text-cyber-muted text-[11px] font-sans">
                <strong className="text-neon-green">System Honesty Guarantee:</strong> AI tools were used for code generation and test orchestration. No telemetry, physical sensors, animal feeding records, or carbon statistics are simulated as live when they are not.
              </div>
            </div>

            <button
              onClick={() => setShowAiModal(false)}
              className="w-full py-3 rounded-xl bg-neon-purple/10 border border-neon-purple text-neon-purple font-bold text-xs hover:bg-neon-purple/20 transition-all font-mono tracking-widest uppercase"
            >
              [ ACKNOWLEDGE DISCLOSURE ]
            </button>
          </div>
        </div>
      )}
    </>
  );
};
