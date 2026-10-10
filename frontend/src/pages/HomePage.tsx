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
  Heart,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  ChevronRight
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
        const txs = await ApiClient.listTransactions(5);
        setRecentTxs(txs);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-charcoal-border bg-gradient-to-b from-paper-100 to-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-forest-50 text-forest-deep border border-forest-200">
              <Sparkles className="w-3.5 h-3.5 text-forest-deep" />
              <span>Bharat Builds Tour 2026 • Event 02: Environmental Hacks</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.08]">
              Turn Waste <br />
              <span className="text-forest-deep">Into Care.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl">
              Recycle an eligible bottle or can. Help build a cleaner, litter-free campus and support responsible, measured community animal feeding through intelligent IoT automation and AWS serverless verification.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/kiosk"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-forest-deep text-white font-medium text-sm shadow-md hover:bg-forest-card transition-all active:scale-[0.98]"
              >
                <Recycle className="w-5 h-5 text-emerald-300" />
                <span>Start Recycling Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/impact"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-charcoal-border text-charcoal font-medium text-sm hover:bg-paper-100 transition-all shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-forest-deep" />
                <span>Explore Impact Dashboard</span>
              </Link>

              <Link
                to="/operator"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-charcoal-muted hover:text-charcoal text-sm transition-colors"
              >
                <span>Operator Console</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Simulation honesty banner */}
            <div className="pt-4 flex items-center gap-2 text-xs text-charcoal-muted font-mono bg-paper-200/60 p-3 rounded-lg border border-charcoal-border max-w-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>System Transparency:</strong> Currently operating in{' '}
                <span className="text-forest-deep font-bold">{settings.operatingMode} MODE</span>. All simulated sensors and dispensing mechanics are strictly identified as simulation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            How The Closed Loop Operates
          </h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Every deposited recyclable goes through verifiable physical or simulated checks to guarantee zero fraud and zero food waste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              step: '01',
              title: 'Item Insertion',
              desc: 'User deposits container into the smart entry intake aperture.',
              icon: Recycle
            },
            {
              step: '02',
              title: 'Sensor Validation',
              desc: 'Optical profile & inductive metal detection verify eligible PET/Aluminium.',
              icon: Cpu
            },
            {
              step: '03',
              title: 'Compaction & Bin',
              desc: 'Item enters secure collection compartment; internal fill gauge updates.',
              icon: Layers
            },
            {
              step: '04',
              title: 'AWS Auth',
              desc: 'Serverless Lambda verifies unique eventId; prevents duplicate rewards.',
              icon: ShieldCheck
            },
            {
              step: '05',
              title: 'Targeted Dispense',
              desc: 'Calibrated portion released into designated, clean feeding bowl.',
              icon: Heart
            },
            {
              step: '06',
              title: 'Auditable Receipt',
              desc: 'Transaction receipt generated with transparent simulation/live tags.',
              icon: CheckCircle2
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-charcoal-border rounded-xl p-5 space-y-3 shadow-xs hover:border-forest-deep transition-all"
              >
                <div className="flex items-center justify-between text-xs font-mono text-emerald-800">
                  <span className="font-bold text-sm">{item.step}</span>
                  <Icon className="w-4 h-4 text-forest-deep" />
                </div>
                <h3 className="font-bold text-sm text-charcoal">{item.title}</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live System Metric Tickers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-deep text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-card pb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-300">
                  System Telemetry Snapshot
                </span>
                <h3 className="text-2xl font-bold tracking-tight mt-1">
                  Active Station: {machine?.displayName || 'DTU Campus North Gate Kiosk'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono bg-forest-card px-3 py-1.5 rounded-lg w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>STATUS: {machine?.onlineStatus || 'ONLINE'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-emerald-200">Total Recorded Events</p>
                <p className="text-3xl font-extrabold tracking-tight font-mono">
                  {impact?.totalEvents ?? 0}
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  {impact?.simulatedCollections ?? 0} simulated • {impact?.physicalCollections ?? 0} physical
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-emerald-200">Accepted Recyclables</p>
                <p className="text-3xl font-extrabold tracking-tight font-mono text-emerald-300">
                  {impact?.acceptedItems ?? 0}
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  {impact?.totalMeasuredWeightGrams ?? 0}g measured mass
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-emerald-200">Portions Dispensed</p>
                <p className="text-3xl font-extrabold tracking-tight font-mono text-emerald-300">
                  {(impact?.simulatedPortionsDispensed ?? 0) + (impact?.physicalPortionsDispensed ?? 0)}
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  Controlled animal feeds
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-emerald-200">Current Bin Fill</p>
                <p className="text-3xl font-extrabold tracking-tight font-mono">
                  {machine?.recyclingBinFillPercent ?? 28}%
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  Compactor active (Safety lock at 95%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-charcoal-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-4">
            <div>
              <h3 className="text-lg font-bold text-charcoal">Recent Activity Log</h3>
              <p className="text-xs text-charcoal-muted">Live audit records from DynamoDB / local simulation storage</p>
            </div>
            <Link
              to="/impact"
              className="text-xs font-semibold text-forest-deep hover:underline flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-charcoal-border">
            {recentTxs.map(tx => (
              <div key={tx.eventId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      tx.validationStatus === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.validationStatus === 'ACCEPTED' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal block">
                      {tx.itemType.replace('_', ' ')} • {tx.beneficiaryModule.replace('_', ' ')}
                    </span>
                    <span className="text-charcoal-muted font-mono text-[11px]">Ref: {tx.eventId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                      tx.dispenseStatus === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-900'
                        : tx.dispenseStatus === 'SIMULATED'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tx.dispenseStatus} ({tx.feedGrams}g)
                  </span>
                  <span className="text-charcoal-muted font-mono text-[11px]">
                    {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
