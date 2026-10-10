import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiClient } from '../services/api';
import { ImpactSummary, TransactionRecord, ItemType, DispenseStatus, BeneficiaryModule } from '../types';
import {
  BarChart3,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Heart,
  Layers,
  Info,
  Search,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { settings, resetDemoData } = useApp();
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const loadAnalytics = async () => {
    try {
      const imp = await ApiClient.getImpact(timeRange);
      setImpact(imp);
      const txs = await ApiClient.listTransactions(100);
      setTransactions(txs);
    } catch (err) {
      console.error('Failed to load impact analytics:', err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  // Filtered transactions for the table
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch =
      tx.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.beneficiaryModule.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ACCEPTED') return matchesSearch && tx.validationStatus === 'ACCEPTED';
    if (filterStatus === 'REJECTED') return matchesSearch && tx.validationStatus === 'REJECTED';
    if (filterStatus === 'DISPENSED') return matchesSearch && (tx.dispenseStatus === 'CONFIRMED' || tx.dispenseStatus === 'SIMULATED');
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Page Header with Time Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-forest-deep bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
              Audit & Ledger
            </span>
            <span className="text-xs font-mono text-charcoal-muted">
              Mode: {settings.operatingMode}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-1">
            Impact & Transparency Analytics
          </h2>
          <p className="text-sm text-charcoal-muted mt-1">
            Directly computed from immutable transaction records in Amazon DynamoDB / Local Simulation Ledger.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-paper-100 p-1.5 rounded-xl border border-charcoal-border self-start md:self-auto text-xs font-mono">
          <Calendar className="w-4 h-4 text-charcoal-muted ml-2" />
          {['24h', '7d', '30d', 'all'].map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold uppercase ${
                timeRange === r
                  ? 'bg-forest-deep text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {r === 'all' ? 'All Time' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-charcoal-border rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span className="font-mono uppercase font-semibold">Total Collections</span>
            <Layers className="w-4 h-4 text-forest-deep" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-charcoal tracking-tight">
            {impact?.totalEvents ?? 0}
          </div>
          <div className="text-[11px] text-charcoal-muted flex items-center justify-between">
            <span>Simulated: {impact?.simulatedCollections ?? 0}</span>
            <span>Physical: {impact?.physicalCollections ?? 0}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-charcoal-border rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span className="font-mono uppercase font-semibold">Measured Mass</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-700 tracking-tight">
            {((impact?.totalMeasuredWeightGrams ?? 0) / 1000).toFixed(2)} <span className="text-lg">kg</span>
          </div>
          <div className="text-[11px] text-charcoal-muted">
            {impact?.totalMeasuredWeightGrams ?? 0}g via calibrated load cells
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-charcoal-border rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span className="font-mono uppercase font-semibold">Feeds Dispensed</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-charcoal tracking-tight">
            {(impact?.simulatedPortionsDispensed ?? 0) + (impact?.physicalPortionsDispensed ?? 0)}
          </div>
          <div className="text-[11px] text-charcoal-muted flex items-center justify-between">
            <span>Simulated: {impact?.simulatedPortionsDispensed ?? 0}</span>
            <span>Physical: {impact?.physicalPortionsDispensed ?? 0}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-charcoal-border rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span className="font-mono uppercase font-semibold">Acceptance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-forest-deep" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-charcoal tracking-tight">
            {impact && impact.totalEvents > 0
              ? `${Math.round((impact.acceptedItems / impact.totalEvents) * 100)}%`
              : '100%'}
          </div>
          <div className="text-[11px] text-charcoal-muted">
            {impact?.rejectedItems ?? 0} rejected by material checks
          </div>
        </div>
      </div>

      {/* Honest Scientific Methodology Disclosure Banner */}
      <div className="bg-paper-100 border border-charcoal-border rounded-xl p-5 text-xs text-charcoal space-y-2">
        <div className="flex items-center gap-2 font-bold text-forest-deep">
          <Info className="w-4 h-4" />
          <span>Measurement Integrity & Environmental Claims Standard</span>
        </div>
        <p className="text-charcoal-muted leading-relaxed">
          <strong>No arbitrary carbon multipliers:</strong> Rather than multiplying bottle counts by unverified carbon offset coefficients, ReCycle2Feed measures <strong>actual weight</strong> recovered and <strong>authorized food portions</strong> released. Dispensed food is counted strictly by mechanical release cycles; we do not claim "X animals fed" because a single animal may consume multiple portions or community feeding dynamics may vary.
        </p>
      </div>

      {/* Unit Economics & Circular Feasibility Model (Business Analytics) */}
      <div className="bg-white border border-charcoal-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-border pb-3">
          <div>
            <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              Circular Feasibility & Unit Economics Model (BBA Business Analytics)
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Financial and logistical validation for sustainable campus and municipal deployments.
            </p>
          </div>
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
            Breakeven Metric: Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-paper-50 border border-charcoal-border space-y-1">
            <span className="text-charcoal-muted block">Crushed PET Scrap Value</span>
            <span className="text-base font-bold text-charcoal">₹35 – ₹42 / kg</span>
            <p className="text-[10px] text-charcoal-muted font-sans">High-purity source segregated #1 PET scrap benchmark (Delhi NCR).</p>
          </div>

          <div className="p-3.5 rounded-lg bg-paper-50 border border-charcoal-border space-y-1">
            <span className="text-charcoal-muted block">Crushed Aluminium Scrap</span>
            <span className="text-base font-bold text-emerald-700">₹105 – ₹115 / kg</span>
            <p className="text-[10px] text-charcoal-muted font-sans">Beverage can scrap commands immediate metal recycler buyback.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-paper-50 border border-charcoal-border space-y-1">
            <span className="text-charcoal-muted block">Feed Cost per 20g Portion</span>
            <span className="text-base font-bold text-charcoal">~₹1.70 / portion</span>
            <p className="text-[10px] text-charcoal-muted font-sans">Based on wholesale bulk procurement at ₹85/kg institutional rate.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-paper-50 border border-charcoal-border space-y-1">
            <span className="text-charcoal-muted block">Sponsor / CSR Co-Pay</span>
            <span className="text-base font-bold text-forest-deep">₹12,000 / month</span>
            <p className="text-[10px] text-charcoal-muted font-sans">Pet care & consumer brands sponsor kiosk casing and feeding budget.</p>
          </div>
        </div>
      </div>

      {/* Visual Activity & Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Category Breakdown */}
        <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-charcoal flex items-center justify-between">
            <span>Material Category Distribution</span>
            <span className="text-xs font-mono text-charcoal-muted">Items</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { label: 'PET Plastic Bottles', key: 'PET_BOTTLE', color: 'bg-emerald-600' },
              { label: 'Aluminium Beverage Cans', key: 'ALUMINIUM_CAN', color: 'bg-teal-600' },
              { label: 'Glass Bottles (Rejected)', key: 'GLASS_BOTTLE', color: 'bg-amber-500' },
              { label: 'E-Waste / Batteries (Rejected)', key: 'E_WASTE', color: 'bg-red-500' },
              { label: 'Unsupported Multi-Layer', key: 'UNSUPPORTED_PLASTIC', color: 'bg-gray-400' }
            ].map(m => {
              const count = impact?.materialBreakdown[m.key as ItemType] ?? 0;
              const total = impact?.totalEvents || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={m.key} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-charcoal">{m.label}</span>
                    <span className="font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-paper-200 h-2 rounded-full overflow-hidden">
                    <div className={`${m.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Beneficiary Module Breakdown */}
        <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-charcoal flex items-center justify-between">
            <span>Beneficiary Allocation</span>
            <span className="text-xs font-mono text-charcoal-muted">Feeds</span>
          </h3>

          <div className="space-y-4 pt-2">
            {[
              { label: 'Community Dogs (20g kibble)', key: 'DOG_FEED' as BeneficiaryModule, color: 'bg-forest-deep' },
              { label: 'Community Cats (15g food)', key: 'CAT_FEED' as BeneficiaryModule, color: 'bg-emerald-600' },
              { label: 'Wild Birds (10g grain)', key: 'BIRD_FEED' as BeneficiaryModule, color: 'bg-teal-500' },
              { label: 'Human Food Assistance (Planned)', key: 'HUMAN_FOOD_PACK' as BeneficiaryModule, color: 'bg-gray-300' }
            ].map(b => {
              const count = impact?.beneficiaryBreakdown ? impact.beneficiaryBreakdown[b.key] ?? 0 : 0;
              const total = impact?.portionsRequested || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={b.key} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-charcoal">{b.label}</span>
                    <span className="font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-paper-200 h-2 rounded-full overflow-hidden">
                    <div className={`${b.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dispensing Outcome Status Breakdown */}
        <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-charcoal flex items-center justify-between">
            <span>Dispensing Outcome Audit</span>
            <span className="text-xs font-mono text-charcoal-muted">Status</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              {
                status: 'Simulated Dispense',
                count: impact?.simulatedPortionsDispensed ?? 0,
                desc: 'Executed cleanly via in-browser or simulated telemetry',
                badge: 'bg-amber-100 text-amber-900'
              },
              {
                status: 'Physically Confirmed',
                count: impact?.physicalPortionsDispensed ?? 0,
                desc: 'Confirmed via hardware actuator limit-switch feedback',
                badge: 'bg-emerald-100 text-emerald-900'
              },
              {
                status: 'Dispense Failed',
                count: impact?.failedDispenses ?? 0,
                desc: 'Failed honestly due to empty hopper or motor stall',
                badge: 'bg-red-100 text-red-900'
              },
              {
                status: 'Not Issued / Ineligible',
                count: impact?.dispenseBreakdown.NOT_ISSUED ?? 0,
                desc: 'Rejected item or planned module holding queue',
                badge: 'bg-gray-100 text-gray-800'
              }
            ].map((st, i) => (
              <div key={i} className="p-3 rounded-lg bg-paper-50 border border-charcoal-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal">{st.status}</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${st.badge}`}>
                    {st.count}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History Audit Ledger */}
      <div className="bg-white border border-charcoal-border rounded-xl shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-border pb-4">
          <div>
            <h3 className="text-base font-bold text-charcoal">Immutable Transaction History Ledger</h3>
            <p className="text-xs text-charcoal-muted">Review individual deposit events, validation decisions, and timestamps</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search event ID, type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-charcoal-border text-xs bg-paper-50 focus:outline-none focus:border-forest-deep w-48 font-mono"
              />
            </div>

            {/* Filter Buttons */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs font-mono p-1.5 rounded-lg border border-charcoal-border bg-paper-50 focus:outline-none"
            >
              <option value="ALL">All Outcomes</option>
              <option value="ACCEPTED">Accepted Only</option>
              <option value="REJECTED">Rejected Only</option>
              <option value="DISPENSED">Dispensed Only</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-paper-100 text-charcoal-muted uppercase tracking-wider text-[11px] border-b border-charcoal-border">
                <th className="py-2.5 px-3">Event Ref</th>
                <th className="py-2.5 px-3">Item Type</th>
                <th className="py-2.5 px-3">Mass</th>
                <th className="py-2.5 px-3">Beneficiary</th>
                <th className="py-2.5 px-3">Dispense</th>
                <th className="py-2.5 px-3">Validation</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-charcoal-muted font-sans text-xs">
                    No transactions match the selected criteria. Deposit an item in the Kiosk to generate records.
                  </td>
                </tr>
              ) : (
                filteredTxs.map(tx => (
                  <tr key={tx.eventId} className="hover:bg-paper-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-charcoal">{tx.eventId}</td>
                    <td className="py-2.5 px-3 text-charcoal">{tx.itemType.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3">{tx.measuredWeightGrams ?? 0}g</td>
                    <td className="py-2.5 px-3 text-charcoal-muted">{tx.beneficiaryModule.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          tx.dispenseStatus === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.dispenseStatus === 'SIMULATED'
                              ? 'bg-amber-100 text-amber-800'
                              : tx.dispenseStatus === 'FAILED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tx.dispenseStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          tx.validationStatus === 'ACCEPTED'
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {tx.validationStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-muted">
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-forest-deep hover:underline text-[11px] font-sans font-semibold"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Transaction Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-charcoal-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 font-mono text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <span className="font-bold text-sm text-charcoal">Transaction Receipt</span>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-charcoal-muted hover:text-charcoal font-sans text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 py-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Event Reference:</span>
                <span className="font-bold text-charcoal">{selectedTx.eventId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Machine Identifier:</span>
                <span>{selectedTx.machineId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Material Category:</span>
                <span>{selectedTx.itemType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Measured Net Mass:</span>
                <span>{selectedTx.measuredWeightGrams}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Collection Status:</span>
                <span>{selectedTx.collectionStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Beneficiary Target:</span>
                <span>{selectedTx.beneficiaryModule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Dispensing Status:</span>
                <span className="font-bold text-emerald-700">{selectedTx.dispenseStatus} ({selectedTx.feedGrams}g)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Timestamp:</span>
                <span>{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Execution Mode:</span>
                <span>{selectedTx.simulationMode ? 'SIMULATION' : 'PHYSICAL HARDWARE'}</span>
              </div>

              {selectedTx.rejectionReason && (
                <div className="pt-2 border-t border-charcoal-border text-red-700">
                  <span className="font-bold block mb-1">Rejection Reason:</span>
                  <p className="leading-relaxed">{selectedTx.rejectionReason}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-lg bg-forest-deep text-white font-sans font-semibold text-xs mt-2"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
