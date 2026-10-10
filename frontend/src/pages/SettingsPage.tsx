import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApiClient } from '../services/api';
import { OperatingMode } from '../types';
import {
  Settings,
  Cloud,
  Cpu,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Save,
  ShieldAlert
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData, refreshData } = useApp();

  const [mode, setMode] = useState<OperatingMode>(settings.operatingMode);
  const [baseUrl, setBaseUrl] = useState<string>(settings.apiBaseUrl);
  const [machineId, setMachineId] = useState<string>(settings.defaultMachineId);

  const [testResult, setTestResult] = useState<{ testing: boolean; message: string | null; ok: boolean | null }>({
    testing: false,
    message: null,
    ok: null
  });

  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      operatingMode: mode,
      apiBaseUrl: baseUrl.trim(),
      defaultMachineId: machineId.trim()
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
    refreshData();
  };

  const handleTestConnection = async () => {
    setTestResult({ testing: true, message: 'Pinging backend /api/health...', ok: null });
    try {
      // Temporarily test the typed URL if testing AWS mode
      if (mode === 'AWS') {
        const res = await fetch(`${baseUrl.trim()}/api/health`);
        if (!res.ok) {
          setTestResult({
            testing: false,
            message: `HTTP Error ${res.status}: ${res.statusText}`,
            ok: false
          });
          return;
        }
        const data = await res.json();
        setTestResult({
          testing: false,
          message: `Success! Health endpoint responded: ${JSON.stringify(data.status)} (v${data.version}, mode: ${data.mode})`,
          ok: true
        });
      } else {
        setTestResult({
          testing: false,
          message: 'Simulation Mode: Local in-browser storage engine is active and functional.',
          ok: true
        });
      }
    } catch (err: any) {
      setTestResult({
        testing: false,
        message: `Connection Failed: ${err.message}. If testing local backend, ensure "npm start" is running on port 4000.`,
        ok: false
      });
    }
  };

  const handleResetDemo = async () => {
    if (confirm('Reset all demo transactions, machine capacities, and maintenance records to initial seed state?')) {
      await resetDemoData();
      alert('Demo data has been reset to baseline.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-charcoal-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-forest-deep bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
            Configuration
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
          System & Cloud Runtime Settings
        </h2>
        <p className="text-sm text-charcoal-muted">
          Configure operating modes, switch between in-browser simulation and live AWS API Gateway endpoints, and manage demo state.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Settings saved successfully. Configuration updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-charcoal-border rounded-xl p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Operating Mode Selector */}
        <div className="space-y-4">
          <label className="block text-xs font-mono uppercase font-bold text-charcoal">
            Operating Mode
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('SIMULATION')}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === 'SIMULATION'
                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-white border-charcoal-border hover:bg-paper-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-charcoal flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  SIMULATION MODE
                </span>
                {mode === 'SIMULATION' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Runs locally inside browser localStorage. Deterministic emulation of sensors, motor progress, and audit logs. Zero cloud setup required.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('AWS')}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === 'AWS'
                  ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600'
                  : 'bg-white border-charcoal-border hover:bg-paper-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-charcoal flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-700" />
                  AWS CLOUD MODE
                </span>
                {mode === 'AWS' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Connects to live backend API Gateway & AWS Lambda microservice. Records transactions directly into Amazon DynamoDB tables.
              </p>
            </button>
          </div>
        </div>

        {/* Backend API Base URL */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase font-bold text-charcoal">
            Backend API Base URL
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            placeholder="http://localhost:4000 or https://xyz.execute-api.ap-south-1.amazonaws.com"
            className="w-full p-2.5 rounded-lg border border-charcoal-border bg-paper-50 text-xs font-mono focus:outline-none focus:border-forest-deep"
            required
          />
          <p className="text-[11px] text-charcoal-muted">
            Used when in AWS Cloud Mode, or when testing the local Express Node.js server.
          </p>
        </div>

        {/* Machine ID */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase font-bold text-charcoal">
            Default Machine ID
          </label>
          <input
            type="text"
            value={machineId}
            onChange={e => setMachineId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-charcoal-border bg-paper-50 text-xs font-mono focus:outline-none focus:border-forest-deep"
            required
          />
        </div>

        {/* Test Connection Button & Result */}
        <div className="pt-2 border-t border-charcoal-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-muted">Verify backend connectivity before saving:</span>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testResult.testing}
              className="px-3.5 py-1.5 rounded-lg border border-charcoal-border bg-paper-100 hover:bg-paper-200 text-xs font-mono text-charcoal font-semibold transition-colors"
            >
              {testResult.testing ? 'Testing...' : 'Test Health Endpoint'}
            </button>
          </div>

          {testResult.message && (
            <div
              className={`p-3 rounded-lg text-xs font-mono border ${
                testResult.ok
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-charcoal-border flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-deep text-white font-bold text-xs shadow-sm hover:bg-forest-card transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-forest-deep" />
              Reset Demonstration State
            </h4>
            <p className="text-xs text-charcoal-muted mt-1">
              Restores initial seed transactions, resets recycling bin capacity to 28%, and replenishes test food hoppers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-mono font-bold transition-colors"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </div>
  );
};
