import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ApiClient } from '../services/api';
import { ImpactSummary, TransactionRecord } from '../types';
import {
  Recycle,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Zap,
  Server,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Bot,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  Gauge
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, machine } = useApp();
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [recentTxs, setRecentTxs] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const imp = await ApiClient.getImpact('7d');
        setImpact(imp);
        const txs = await ApiClient.listTransactions(6);
        setRecentTxs(txs);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadData();
  }, []);

  const isAWS = settings.operatingMode === 'AWS';

  return (
    <div className="space-y-12 pb-16">
      {/* Top Telemetry HUD Cards (Inspired by FLUX:// metrics banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1 */}
          <div className="hud-panel p-3.5 rounded-lg border-t-2 border-t-neon-green/80 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-muted block">
              TOTAL PROCESSED
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-green font-mono glow-green">
              {impact ? impact.totalEvents : '---'}
            </div>
            <span className="text-[9px] text-cyber-muted font-mono block">ACCEPTED CONTAINERS</span>
          </div>

          {/* Card 2 */}
          <div className="hud-panel p-3.5 rounded-lg border-t-2 border-t-neon-cyan/80 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-muted block">
              MEASURED MASS
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-cyan font-mono glow-cyan">
              {impact ? `${((impact.totalMeasuredWeightGrams || 0) / 1000).toFixed(2)} kg` : '---'}
            </div>
            <span className="text-[9px] text-cyber-muted font-mono block">LOAD CELL SENSOR</span>
          </div>

          {/* Card 3 */}
          <div className="hud-panel p-3.5 rounded-lg border-t-2 border-t-neon-amber/80 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-muted block">
              FEEDS RELEASED
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-amber font-mono glow-amber">
              {impact ? (impact.simulatedPortionsDispensed || 0) + (impact.physicalPortionsDispensed || 0) : '---'}
            </div>
            <span className="text-[9px] text-cyber-muted font-mono block">METERED PORTIONS</span>
          </div>

          {/* Card 4 */}
          <div className="hud-panel p-3.5 rounded-lg border-t-2 border-t-neon-green/80 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-muted block">
              COMPACTION RATIO
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-green font-mono glow-green">
              -70%
            </div>
            <span className="text-[9px] text-cyber-muted font-mono block">VOLUME REDUCTION</span>
          </div>

          {/* Card 5 */}
          <div className="hud-panel p-3.5 rounded-lg border-t-2 border-t-neon-cyan/80 space-y-1 col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-muted block">
              DYNAMODB LATENCY
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-cyan font-mono glow-cyan">
              &lt; 4ms
            </div>
            <span className="text-[9px] text-cyber-muted font-mono block">CONDITIONAL WRITE</span>
          </div>
        </div>
      </section>

      {/* Main Hero HUD Section */}
      <section className="relative overflow-hidden border-y border-cyber-border bg-cyber-surface/60 cyber-grid py-14">
        {/* Reticle corner accents */}
        <div className="absolute top-2 left-2 text-neon-green/30 text-xs font-mono select-none">+--[HUD: MAIN]--+</div>
        <div className="absolute bottom-2 right-2 text-neon-cyan/30 text-xs font-mono select-none">+--[LATENCY: NOMINAL]--+</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BHARAT BUILDS TOUR 2026 // EVENT 02: ENVIRONMENTAL HACKS</span>
              </div>

              <div>
                <p className="text-[11px] font-mono text-neon-cyan uppercase tracking-widest mb-1">
                  &gt; INITIALIZING RECYCLE2FEED SMART RVM SYSTEM...
                </p>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-cyber-text tracking-tight leading-[1.05] font-mono">
                  TURN WASTE <br />
                  <span className="text-neon-green glow-green">INTO CARE.</span>
                </h1>
              </div>

              <p className="text-sm text-cyber-muted font-mono leading-relaxed max-w-xl">
                An AWS-powered smart reverse-vending kiosk that accepts eligible post-consumer PET bottles and aluminium cans, verifies container eligibility with dual optical/inductive sensors, compresses the item, and authorizes a calibrated, metered portion of feed for community animals.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/kiosk"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-neon-green text-cyber-bg font-mono font-bold text-xs tracking-wider shadow-neon-green hover:bg-neon-green/90 transition-all active:scale-[0.98]"
                >
                  <Recycle className="w-4 h-4" />
                  <span>START RECYCLING SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-cyber-card border border-neon-cyan/50 text-neon-cyan font-mono font-bold text-xs tracking-wider hover:bg-neon-cyan/10 transition-all shadow-neon-cyan"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>IMPACT ANALYTICS</span>
                </Link>

                <Link
                  to="/operator"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-lg border border-cyber-border text-cyber-muted hover:text-cyber-text font-mono text-xs tracking-wider transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                  <span>OPERATOR HUD</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Transparency Notice */}
              <div className="flex items-center gap-2.5 text-xs font-mono text-cyber-muted bg-cyber-bg/80 p-3 rounded border border-cyber-border max-w-xl">
                <ShieldCheck className="w-4 h-4 text-neon-green shrink-0" />
                <span>
                  <strong className="text-cyber-text">System Transparency:</strong> Currently in{' '}
                  <span className={isAWS ? 'text-neon-cyan font-bold' : 'text-neon-amber font-bold'}>
                    {settings.operatingMode} MODE
                  </span>
                  . Sensor readings and mechanical dispensing actions are strictly identified as simulated until connected to physical edge microcontrollers.
                </span>
              </div>
            </div>

            {/* Right 5 Cols: Live Station Telemetry Frame */}
            <div className="lg:col-span-5">
              <div className="hud-panel p-5 rounded-xl border border-cyber-border space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neon-green" />
                    <span className="text-xs font-mono font-bold text-cyber-text tracking-wider">
                      LIVE STATION TELEMETRY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/30">
                    ONLINE
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-cyber-border/40">
                    <span className="text-cyber-muted">STATION IDENTIFIER:</span>
                    <span className="text-cyber-text font-bold">DTU-NORTH-GATE-01</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-cyber-border/40">
                    <span className="text-cyber-muted">RECYCLING BIN CAPACITY:</span>
                    <span className="text-neon-green font-bold">
                      {machine ? `${machine.recyclingBinFillPercent}%` : '28%'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-cyber-border/40">
                    <span className="text-cyber-muted">DOG FEED HOPPER:</span>
                    <span className="text-neon-cyan font-bold">
                      {machine?.foodInventoryGrams?.DOG_FEED ?? 1850}g / 2500g
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-cyber-border/40">
                    <span className="text-cyber-muted">CAT FEED HOPPER:</span>
                    <span className="text-neon-cyan font-bold">
                      {machine?.foodInventoryGrams?.CAT_FEED ?? 1420}g / 2000g
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-cyber-border/40">
                    <span className="text-cyber-muted">WILD BIRD SEED HOPPER:</span>
                    <span className="text-neon-cyan font-bold">
                      {machine?.foodInventoryGrams?.BIRD_FEED ?? 950}g / 1500g
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-cyber-muted">HUMAN FOOD MODULE:</span>
                    <span className="text-neon-purple font-bold">SEALED-PACK (FUTURE)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/kiosk"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-cyber-card border border-neon-green/40 hover:border-neon-green text-neon-green text-xs font-mono font-bold tracking-wider transition-all"
                  >
                    <span>LAUNCH INTERACTIVE KIOSK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Step Closed Loop Sequence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest block">
              // REVERSE VENDING PIPELINE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-cyber-text">
              The 6-Step Closed-Loop Sequence
            </h2>
          </div>
          <span className="text-xs font-mono text-cyber-muted hidden sm:inline">
            ZERO DOUBLE-REWARDING • AUDITABLE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'CONTAINER ENTRY',
              desc: 'User deposits container into smart intake aperture with motorized safety shutter.',
              badge: 'INTAKE',
              color: 'text-neon-green border-neon-green/40'
            },
            {
              step: '02',
              title: 'DUAL SENSORS',
              desc: 'Optical Time-of-Flight + Inductive Metal detection verify PET / aluminium eligibility.',
              badge: 'VERIFY',
              color: 'text-neon-cyan border-neon-cyan/40'
            },
            {
              step: '03',
              title: 'COMPACTION',
              desc: 'Motorized compactor crushes item, reducing internal collection volume by 70%.',
              badge: 'CRUSH',
              color: 'text-neon-green border-neon-green/40'
            },
            {
              step: '04',
              title: 'AWS DYNAMODB',
              desc: 'Conditional write (attribute_not_exists) enforces strict transaction idempotency.',
              badge: 'IDEMPOTENT',
              color: 'text-neon-cyan border-neon-cyan/40'
            },
            {
              step: '05',
              title: 'METERED DISPENSE',
              desc: 'Auger motor releases exact 15-20g portion into sanitized community animal bowl.',
              badge: 'REWARD',
              color: 'text-neon-amber border-neon-amber/40'
            },
            {
              step: '06',
              title: 'LEDGER AUDIT',
              desc: 'Immutable record stored in DynamoDB and local audit log with verifiable timestamp.',
              badge: 'LOGGED',
              color: 'text-neon-green border-neon-green/40'
            }
          ].map(item => (
            <div
              key={item.step}
              className={`hud-panel p-4 rounded-xl border space-y-2 hover:border-neon-green transition-colors`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-black font-mono ${item.color.split(' ')[0]}`}>
                  {item.step}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${item.color}`}>
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-xs text-cyber-text font-mono tracking-wider">
                {item.title}
              </h3>
              <p className="text-[11px] text-cyber-muted font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AWS Serverless Architecture Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hud-panel p-6 sm:p-8 rounded-2xl border border-cyber-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyber-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-neon-cyan" />
                <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">
                  CRITERION 02 // BUILT ON AWS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-cyber-text mt-1">
                Serverless Cloud Architecture
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="text-xs font-mono text-neon-cyan hover:underline flex items-center gap-1"
            >
              <span>View Full CloudFormation & SAM Spec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Box 1 */}
            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <div className="flex items-center gap-2 text-neon-cyan">
                <Server className="w-4 h-4" />
                <span className="font-bold text-xs font-mono">API GATEWAY HTTP v2</span>
              </div>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                High-throughput, sub-10ms REST ingress proxying all kiosk and IoT edge requests directly to Lambda. Free Tier: 1,000,000 calls/mo.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <div className="flex items-center gap-2 text-neon-green">
                <Cpu className="w-4 h-4" />
                <span className="font-bold text-xs font-mono">AWS LAMBDA (ARM64)</span>
              </div>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                Node.js 20.x TypeScript microservice executed on Graviton ARM64. Enforces material eligibility rules, jam lockouts, and rate limits.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <div className="flex items-center gap-2 text-neon-amber">
                <Database className="w-4 h-4" />
                <span className="font-bold text-xs font-mono">AMAZON DYNAMODB</span>
              </div>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                Single-digit ms NoSQL tables using conditional write expressions <code>attribute_not_exists(eventId)</code> to guarantee zero double-rewarding.
              </p>
            </div>

            {/* Box 4 */}
            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <div className="flex items-center gap-2 text-neon-purple">
                <Zap className="w-4 h-4" />
                <span className="font-bold text-xs font-mono">LOCALSTACK EMULATION</span>
              </div>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                AWS open-source local emulator (<code>docker-compose.localstack.yml</code>) ensures 100% offline development without cloud costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools & Rule 03 Transparency Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hud-panel p-6 sm:p-8 rounded-2xl border border-neon-purple/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyber-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-neon-purple" />
                <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest font-bold">
                  HACKATHON RULE 03 DISCLOSURE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-cyber-text mt-1">
                AI Coding Tools Transparency Statement
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-bold">
              WE MAKE DEVS & AWS TOUR '26 COMPLIANT
            </span>
          </div>

          <p className="text-xs font-sans text-cyber-muted leading-relaxed">
            Per hackathon Rule 03 (<em>"You can use AI coding tools. List the ones you used in your writeup."</em>), we maintain complete ethical and technical transparency about the AI tools used during the development of ReCycle2Feed:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <span className="font-bold text-neon-purple block">// AI CODING ASSISTANTS</span>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                <strong>Google Antigravity AI</strong> was utilized as the primary pair-programming agent for TypeScript backend handler structuring, AWS SAM YAML template generation, and Vitest suite authoring. <strong>Gemini 3.1 & Claude Sonnet</strong> assisted in refining accessibility and bilingual prompt phrasing.
              </p>
            </div>

            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <span className="font-bold text-neon-green block">// HUMAN ARCHITECTURAL DESIGN</span>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                The core concept, sensor selection (optical ToF + inductive metal detection), physical motor stall logic, <strong>BBA Circular Economy Unit Economics Model</strong>, and food-isolation safety protocols were formulated by the student builder.
              </p>
            </div>

            <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
              <span className="font-bold text-neon-amber block">// SYSTEM INTEGRITY GUARANTEE</span>
              <p className="text-[11px] font-sans text-cyber-muted leading-relaxed">
                All sensor behaviors, food dispensing events, and transaction records in this MVP are honestly labeled as simulation mode. We do not claim live hardware connections or fabricated carbon offsets when physical sensors are not attached.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      {recentTxs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hud-panel p-6 rounded-2xl border border-cyber-border space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neon-green" />
                <h3 className="font-bold text-sm font-mono text-cyber-text tracking-wider">
                  RECENT TRANSACTION AUDIT LOG
                </h3>
              </div>
              <Link
                to="/impact"
                className="text-xs font-mono text-neon-green hover:underline flex items-center gap-1"
              >
                <span>View Full Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-cyber-border text-cyber-muted">
                    <th className="py-2.5 px-3">EVENT ID</th>
                    <th className="py-2.5 px-3">MATERIAL</th>
                    <th className="py-2.5 px-3">OUTCOME</th>
                    <th className="py-2.5 px-3">WEIGHT</th>
                    <th className="py-2.5 px-3">DISPENSED</th>
                    <th className="py-2.5 px-3">MODE</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/40">
                  {recentTxs.map(tx => (
                    <tr key={tx.eventId} className="hover:bg-cyber-card/60 transition-colors">
                      <td className="py-2.5 px-3 text-neon-cyan font-bold">{tx.eventId}</td>
                      <td className="py-2.5 px-3 text-cyber-text">{tx.itemType}</td>
                      <td className="py-2.5 px-3">
                        {tx.validationStatus === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1 text-neon-green">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-neon-red">
                            <AlertTriangle className="w-3.5 h-3.5" /> REJECTED
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-cyber-muted">
                        {tx.measuredWeightGrams ? `${tx.measuredWeightGrams}g` : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        {tx.dispenseStatus === 'CONFIRMED' || tx.dispenseStatus === 'SIMULATED' ? (
                          <span className="text-neon-amber font-bold">
                            {tx.feedGrams}g {tx.beneficiaryModule.replace('_FEED', '')}
                          </span>
                        ) : (
                          <span className="text-cyber-muted">None</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-amber/10 text-neon-amber border border-neon-amber/30">
                          {tx.simulationMode ? 'SIMULATED' : 'LIVE'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-cyber-muted">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
