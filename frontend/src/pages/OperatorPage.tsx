import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiClient } from '../services/api';
import { MaintenanceRecord, MaintenanceActionType } from '../types';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  PackagePlus,
  Sparkles,
  Cpu,
  RotateCcw,
  Clock,
  ShieldCheck,
  Activity,
  Heart,
  Terminal,
  Layers,
  Settings
} from 'lucide-react';

export const OperatorPage: React.FC = () => {
  const { settings, machine, refreshData } = useApp();
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceRecord[]>([]);
  const [actionType, setActionType] = useState<MaintenanceActionType>('BIN_EMPTYING');
  const [operatorNote, setOperatorNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      const logs = await ApiClient.listMaintenance();
      setMaintenanceLogs(logs);
    } catch (err) {
      console.error('Failed to load maintenance logs:', err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleRecordMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorNote.trim()) {
      alert('Please enter an operator note describing the maintenance action.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const resetBin = actionType === 'BIN_EMPTYING';
      const adjustInv = actionType === 'FEED_REPLENISHMENT' ? 1500 : 0;

      await ApiClient.recordMaintenance(actionType, operatorNote.trim(), resetBin, adjustInv);
      setSuccessMessage(`Maintenance record saved successfully: ${actionType.replace('_', ' ')}`);
      setOperatorNote('');
      await refreshData();
      await loadLogs();
    } catch (err: any) {
      console.error('Failed to record maintenance:', err);
      alert(`Error saving maintenance: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-cyber-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neon-amber bg-neon-amber/10 px-2.5 py-0.5 rounded border border-neon-amber/30">
              // FIELD OPERATIONS HUD
            </span>
            <span className="text-xs font-mono text-cyber-muted">
              STATION ID: <strong className="text-neon-cyan">{settings.defaultMachineId}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cyber-text tracking-tight mt-1 font-mono">
            Operator & Caretaker Console
          </h2>
          <p className="text-xs text-cyber-muted font-mono mt-1">
            Manage kiosk physical health, monitor compartment capacities, replenish animal feed, and log field servicing.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-xs font-mono text-neon-cyan font-bold transition-all shadow-neon-cyan self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>[ REFRESH TELEMETRY ]</span>
        </button>
      </div>

      {/* Active Fault Alerts */}
      {machine && machine.activeFaults.length > 0 && (
        <div className="bg-neon-red/10 border-2 border-neon-red/50 rounded-xl p-5 flex items-start gap-4 text-cyber-text font-mono text-xs">
          <AlertTriangle className="w-6 h-6 text-neon-red shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-neon-red">Critical Machine Faults Detected</h4>
            <p className="text-xs leading-relaxed text-cyber-muted font-sans">
              Fault Code: <code className="font-mono font-bold text-neon-red">{machine.activeFaults.join(', ')}</code>. The intake slot compactor shutter is mechanically locked to prevent hazard. Please inspect and record a "JAM RESOLUTION" action below to clear the safety lock.
            </p>
          </div>
        </div>
      )}

      {/* Machine Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Machine Core Telemetry */}
        <div className="hud-panel rounded-xl p-6 space-y-4 border-t-2 border-t-neon-green/80">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <span className="font-bold text-sm text-cyber-text font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon-green" />
              Machine Telemetry
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                machine?.onlineStatus === 'ONLINE'
                  ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                  : 'bg-neon-red/10 text-neon-red border-neon-red/30'
              }`}
            >
              {machine?.onlineStatus ?? 'ONLINE'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-cyber-border/40">
              <span className="text-cyber-muted">Operating Mode:</span>
              <span className="font-bold text-neon-cyan">{settings.operatingMode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-cyber-border/40">
              <span className="text-cyber-muted">Last Heartbeat:</span>
              <span className="text-cyber-text">
                {machine ? new Date(machine.lastHeartbeatAt).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-cyber-border/40">
              <span className="text-cyber-muted">Last Maintenance:</span>
              <span className="text-cyber-text">
                {machine ? new Date(machine.lastMaintenanceAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-cyber-muted">Safety Cooldown:</span>
              <span className="text-neon-amber font-bold">{machine?.cooldownSeconds ?? 5} seconds</span>
            </div>
          </div>
        </div>

        {/* Card 2: Recycling Bin Capacity */}
        <div className="hud-panel rounded-xl p-6 space-y-4 border-t-2 border-t-neon-cyan/80">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <span className="font-bold text-sm text-cyber-text font-mono flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-neon-cyan" />
              Recycling Bin Capacity
            </span>
            <span className="text-xs font-mono font-bold text-neon-cyan">
              {machine?.recyclingBinFillPercent ?? 28}% Full
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-cyber-card h-4 rounded-full overflow-hidden border border-cyber-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (machine?.recyclingBinFillPercent ?? 0) >= 90
                    ? 'bg-neon-red shadow-neon-red'
                    : (machine?.recyclingBinFillPercent ?? 0) >= 70
                      ? 'bg-neon-amber shadow-neon-amber'
                      : 'bg-neon-green shadow-neon-green'
                }`}
                style={{ width: `${machine?.recyclingBinFillPercent ?? 28}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-cyber-muted font-mono pt-1">
              <span>0% (EMPTY)</span>
              <span className="text-neon-amber">LOCKOUT THRESHOLD: 95%</span>
            </div>
            {(machine?.recyclingBinFillPercent ?? 0) >= 90 && (
              <p className="text-xs text-neon-red font-mono pt-1">
                ⚠️ Warning: Bin nearing full capacity. Schedule municipal emptying soon.
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Food Hopper Inventory Gauges */}
        <div className="hud-panel rounded-xl p-6 space-y-4 border-t-2 border-t-neon-amber/80">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <span className="font-bold text-sm text-cyber-text font-mono flex items-center gap-2">
              <Heart className="w-4 h-4 text-neon-amber" />
              Food Hoppers
            </span>
            <span className="text-xs font-mono text-cyber-muted">Remaining (Grams)</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-cyber-muted">Dog Kibble Hopper</span>
                <span className="font-bold text-neon-green">{machine?.foodInventoryGrams.DOG_FEED ?? 1850}g / 3000g</span>
              </div>
              <div className="w-full bg-cyber-card h-2 rounded-full overflow-hidden border border-cyber-border">
                <div
                  className="bg-neon-green h-full rounded-full"
                  style={{ width: `${Math.min(100, ((machine?.foodInventoryGrams.DOG_FEED ?? 1850) / 3000) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-cyber-muted">Cat Food Hopper</span>
                <span className="font-bold text-neon-cyan">{machine?.foodInventoryGrams.CAT_FEED ?? 900}g / 2000g</span>
              </div>
              <div className="w-full bg-cyber-card h-2 rounded-full overflow-hidden border border-cyber-border">
                <div
                  className="bg-neon-cyan h-full rounded-full"
                  style={{ width: `${Math.min(100, ((machine?.foodInventoryGrams.CAT_FEED ?? 900) / 2000) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-cyber-muted">Wild Bird Grain</span>
                <span className="font-bold text-neon-amber">{machine?.foodInventoryGrams.BIRD_FEED ?? 600}g / 1000g</span>
              </div>
              <div className="w-full bg-cyber-card h-2 rounded-full overflow-hidden border border-cyber-border">
                <div
                  className="bg-neon-amber h-full rounded-full"
                  style={{ width: `${Math.min(100, ((machine?.foodInventoryGrams.BIRD_FEED ?? 600) / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operator Servicing Action Form */}
      <div className="hud-panel rounded-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-cyber-border pb-4">
          <h3 className="text-lg font-bold text-cyber-text font-mono flex items-center gap-2">
            <Wrench className="w-5 h-5 text-neon-green" />
            Log Field Maintenance & Servicing Action
          </h3>
          <p className="text-xs text-cyber-muted font-mono mt-1">
            Recorded directly to DynamoDB / Local Maintenance Audit Ledger with caretaker attribution.
          </p>
        </div>

        {successMessage && (
          <div className="bg-neon-green/10 border border-neon-green/40 rounded-lg p-4 flex items-center gap-3 text-neon-green text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRecordMaintenance} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-bold text-cyber-text block uppercase">Action Category</label>
              <select
                value={actionType}
                onChange={e => setActionType(e.target.value as MaintenanceActionType)}
                className="w-full p-2.5 rounded-lg border border-cyber-border bg-cyber-card text-cyber-text focus:outline-none focus:border-neon-green font-mono"
              >
                <option value="BIN_EMPTYING">Bin Emptying (Resets capacity to 0%)</option>
                <option value="FEED_REPLENISHMENT">Feed Replenishment (+1500g kibble inventory)</option>
                <option value="SANITIZATION">Sanitization & Disinfection</option>
                <option value="JAM_CLEARANCE">Clear Compactor / Dispenser Jam</option>
                <option value="INSPECTION">General Mechanical Inspection</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-cyber-text block uppercase">Operator / Caretaker Identifier</label>
              <input
                type="text"
                disabled
                value="Caretaker-DTU-Zone-North"
                className="w-full p-2.5 rounded-lg border border-cyber-border bg-cyber-surface text-cyber-muted font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-cyber-text block uppercase">Servicing Notes & Observations</label>
            <textarea
              rows={3}
              value={operatorNote}
              onChange={e => setOperatorNote(e.target.value)}
              placeholder="e.g. Cleared 14.2kg crushed PET from bin. Inspected auger gears. Replenished 1.5kg pedigree kibble into dog hopper."
              className="w-full p-3 rounded-lg border border-cyber-border bg-cyber-card text-cyber-text focus:outline-none focus:border-neon-green font-mono text-xs placeholder:text-cyber-muted"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-neon-green text-cyber-bg font-bold font-mono text-xs tracking-wider shadow-neon-green hover:bg-neon-green/90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'RECORDING AUDIT ENTRY...' : '[ COMMIT MAINTENANCE RECORD TO LEDGER ]'}
          </button>
        </form>
      </div>

      {/* Maintenance History Audit Log */}
      <div className="hud-panel rounded-xl overflow-hidden p-6 space-y-4">
        <div className="border-b border-cyber-border pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm font-mono text-cyber-text tracking-wider">
            // FIELD MAINTENANCE AUDIT HISTORY
          </h3>
          <span className="text-xs font-mono text-cyber-muted">{maintenanceLogs.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-cyber-surface text-cyber-muted uppercase tracking-wider text-[11px] border-b border-cyber-border">
                <th className="py-2.5 px-3">Log Ref</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Operator Notes</th>
                <th className="py-2.5 px-3">Operator ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40">
              {maintenanceLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-cyber-muted">
                    No maintenance records found. Submit a servicing action above.
                  </td>
                </tr>
              ) : (
                maintenanceLogs.map(log => (
                  <tr key={log.maintenanceId} className="hover:bg-cyber-card/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-neon-cyan">{log.maintenanceId}</td>
                    <td className="py-2.5 px-3 text-neon-green font-bold">{log.actionType.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 text-cyber-text font-sans">{log.operatorNote}</td>
                    <td className="py-2.5 px-3 text-cyber-muted">{log.machineId}</td>
                    <td className="py-2.5 px-3 text-cyber-muted">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
