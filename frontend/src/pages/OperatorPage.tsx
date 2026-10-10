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
  Heart
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-charcoal-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-forest-deep bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
              Field Operations
            </span>
            <span className="text-xs font-mono text-charcoal-muted">
              Station ID: {settings.defaultMachineId}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-1">
            Operator & Caretaker Console
          </h2>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage kiosk physical health, monitor compartment capacities, replenish animal feed, and log field servicing.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-charcoal-border bg-white hover:bg-paper-100 text-xs font-mono text-charcoal transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-forest-deep" />
          <span>Refresh Live Telemetry</span>
        </button>
      </div>

      {/* Active Fault Alerts */}
      {machine && machine.activeFaults.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 flex items-start gap-4 text-red-950">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Critical Machine Faults Detected</h4>
            <p className="text-xs leading-relaxed">
              Fault Code: <code className="font-mono font-bold">{machine.activeFaults.join(', ')}</code>. The intake slot compactor shutter is mechanically locked to prevent hazard. Please inspect and record a "JAM RESOLUTION" action below to clear the safety lock.
            </p>
          </div>
        </div>
      )}

      {/* Machine Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Machine Core Telemetry */}
        <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <span className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Activity className="w-4 h-4 text-forest-deep" />
              Machine Telemetry
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                machine?.onlineStatus === 'ONLINE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {machine?.onlineStatus ?? 'ONLINE'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Operating Mode:</span>
              <span className="font-semibold text-charcoal">{settings.operatingMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Last Heartbeat:</span>
              <span className="text-charcoal">
                {machine ? new Date(machine.lastHeartbeatAt).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Last Maintenance:</span>
              <span className="text-charcoal">
                {machine ? new Date(machine.lastMaintenanceAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Safety Cooldown:</span>
              <span className="text-charcoal">{machine?.cooldownSeconds ?? 5} seconds</span>
            </div>
          </div>
        </div>

        {/* Card 2: Recycling Bin Capacity */}
        <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <span className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-emerald-600" />
              Recycling Bin Capacity
            </span>
            <span className="text-xs font-mono font-bold text-charcoal">
              {machine?.recyclingBinFillPercent ?? 28}% Full
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-paper-200 h-4 rounded-full overflow-hidden border border-charcoal-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (machine?.recyclingBinFillPercent ?? 0) >= 90
                    ? 'bg-red-500'
                    : (machine?.recyclingBinFillPercent ?? 0) >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                }`}
                style={{ width: `${machine?.recyclingBinFillPercent ?? 28}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-charcoal-muted font-mono pt-1">
              <span>0% (Empty)</span>
              <span>Lockout Threshold: 95%</span>
            </div>
            {(machine?.recyclingBinFillPercent ?? 0) >= 90 && (
              <p className="text-xs text-red-600 font-medium pt-1">
                ⚠️ Warning: Bin nearing full capacity. Schedule municipal emptying soon.
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Food Hopper Inventory Gauges */}
        <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <span className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              Food Hoppers
            </span>
            <span className="text-xs font-mono text-charcoal-muted">Remaining (Grams)</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Dog Kibble Hopper</span>
                <span className="font-bold">{machine?.foodInventoryGrams.DOG_FEED ?? 1850}g / 3000g</span>
              </div>
              <div className="w-full bg-paper-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-forest-deep h-full rounded-full"
                  style={{ width: `${Math.min(100, ((machine?.foodInventoryGrams.DOG_FEED ?? 1850) / 3000) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Cat Food Hopper</span>
                <span className="font-bold">{machine?.foodInventoryGrams.CAT_FEED ?? 900}g / 2000g</span>
              </div>
              <div className="w-full bg-paper-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, ((machine?.foodInventoryGrams.CAT_FEED ?? 900) / 2000) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Wild Bird Grain</span>
                <span className="font-bold">{machine?.foodInventoryGrams.BIRD_FEED ?? 600}g / 1000g</span>
              </div>
              <div className="w-full bg-paper-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, ((machine?.foodInventoryGrams.BIRD_FEED ?? 600) / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operator Servicing Action Form */}
      <div className="bg-white border border-charcoal-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-charcoal-border pb-4">
          <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <Wrench className="w-5 h-5 text-forest-deep" />
            Log Field Maintenance & Servicing Action
          </h3>
          <p className="text-xs text-charcoal-muted mt-1">
            Authorized record submitted by caretakers, cleaning staff, or technicians.
          </p>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRecordMaintenance} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-charcoal mb-2">
                Maintenance Action Type
              </label>
              <select
                value={actionType}
                onChange={e => setActionType(e.target.value as MaintenanceActionType)}
                className="w-full p-2.5 rounded-lg border border-charcoal-border bg-paper-50 text-xs font-sans focus:outline-none focus:border-forest-deep"
              >
                <option value="BIN_EMPTYING">Waste Bin Emptying (Resets Bin Fill to 0%)</option>
                <option value="FEED_REPLENISHMENT">Feed Replenishment (Restocks Food Hoppers)</option>
                <option value="JAM_RESOLUTION">Jam Resolution (Clears Motor Jam Fault)</option>
                <option value="CLEANING">Sanitization & Chute Cleaning</option>
                <option value="SENSOR_INSPECTION">Sensor Inspection & Calibration</option>
                <option value="DISPENSER_INSPECTION">Dispenser Mechanism Check</option>
                <option value="GENERAL_MAINTENANCE">General Scheduled Servicing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-charcoal mb-2">
                Operator Service Note
              </label>
              <input
                type="text"
                placeholder="e.g., Emptied 45 PET bottles, wiped down intake slot..."
                value={operatorNote}
                onChange={e => setOperatorNote(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-charcoal-border bg-paper-50 text-xs font-sans focus:outline-none focus:border-forest-deep"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-charcoal-muted">
              * Action will be immutably recorded in DynamoDB Maintenance table and update machine state.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-forest-deep text-white font-bold text-xs shadow-sm hover:bg-forest-card transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Action...' : 'Save Maintenance Log'}
            </button>
          </div>
        </form>
      </div>

      {/* Maintenance History Audit Log */}
      <div className="bg-white border border-charcoal-border rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-sm text-charcoal">Historical Maintenance Audit Trail</h3>

        <div className="divide-y divide-charcoal-border">
          {maintenanceLogs.length === 0 ? (
            <p className="py-4 text-xs text-charcoal-muted font-mono">No maintenance records logged yet.</p>
          ) : (
            maintenanceLogs.map(log => (
              <div key={log.maintenanceId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal font-mono uppercase bg-paper-200 px-2 py-0.5 rounded text-[10px]">
                      {log.actionType.replace('_', ' ')}
                    </span>
                    <span className="text-charcoal-muted text-[11px] font-mono">ID: {log.maintenanceId}</span>
                  </div>
                  <p className="text-charcoal leading-relaxed">{log.operatorNote}</p>
                </div>
                <div className="text-right text-[11px] text-charcoal-muted font-mono shrink-0">
                  <p>{new Date(log.createdAt).toLocaleDateString()}</p>
                  <p>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
