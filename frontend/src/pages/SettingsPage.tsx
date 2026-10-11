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
  ShieldAlert,
  Terminal,
  Zap
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-cyber-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-2.5 py-0.5 rounded border border-neon-cyan/30">
            // RUNTIME CONFIGURATION
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-cyber-text tracking-tight font-mono">
          System & Cloud Runtime Settings
        </h2>
        <p className="text-xs text-cyber-muted font-mono">
          Configure operating modes, switch between in-browser simulation and live AWS API Gateway endpoints, and manage demo state.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/40 text-neon-green text-xs font-mono flex items-center gap-2 shadow-neon-green">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully. Runtime configuration updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="hud-panel rounded-xl p-6 sm:p-8 space-y-8 border border-cyber-border">
        {/* Operating Mode Selector */}
        <div className="space-y-4">
          <label className="block text-xs font-mono uppercase font-bold text-cyber-text tracking-wider">
            // OPERATING MODE SELECTION
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('SIMULATION')}
              className={`p-4 rounded-xl border text-left transition-all font-mono ${
                mode === 'SIMULATION'
                  ? 'bg-neon-amber/10 border-neon-amber shadow-neon-amber text-cyber-text'
                  : 'bg-cyber-card border-cyber-border text-cyber-muted hover:text-cyber-text hover:border-cyber-border/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-neon-amber flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-neon-amber" />
                  SIMULATION MODE
                </span>
                {mode === 'SIMULATION' && <CheckCircle2 className="w-4 h-4 text-neon-amber" />}
              </div>
              <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                Runs locally inside browser localStorage. Deterministic emulation of sensors, motor progress, and audit logs. Zero cloud credentials required.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('AWS')}
              className={`p-4 rounded-xl border text-left transition-all font-mono ${
                mode === 'AWS'
                  ? 'bg-neon-cyan/10 border-neon-cyan shadow-neon-cyan text-cyber-text'
                  : 'bg-cyber-card border-cyber-border text-cyber-muted hover:text-cyber-text hover:border-cyber-border/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-neon-cyan flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-neon-cyan" />
                  AWS CLOUD MODE
                </span>
                {mode === 'AWS' && <CheckCircle2 className="w-4 h-4 text-neon-cyan" />}
              </div>
              <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                Connects to live backend API Gateway & AWS Lambda microservice. Records transactions directly into Amazon DynamoDB tables.
              </p>
            </button>
          </div>
        </div>

        {/* Backend API Base URL */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase font-bold text-cyber-text tracking-wider">
            BACKEND API BASE URL
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            placeholder="http://localhost:4000 or https://xyz.execute-api.ap-south-1.amazonaws.com"
            className="w-full p-2.5 rounded-lg border border-cyber-border bg-cyber-card text-xs font-mono text-cyber-text focus:outline-none focus:border-neon-cyan"
            required
          />
          <p className="text-[11px] text-cyber-muted font-mono">
            Used when in AWS Cloud Mode, or when testing the local Express Node.js server on port 4000.
          </p>
        </div>

        {/* Machine ID */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase font-bold text-cyber-text tracking-wider">
            DEFAULT MACHINE IDENTIFIER
          </label>
          <input
            type="text"
            value={machineId}
            onChange={e => setMachineId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-cyber-border bg-cyber-card text-xs font-mono text-cyber-text focus:outline-none focus:border-neon-cyan"
            required
          />
        </div>

        {/* Test Connection Button & Result */}
        <div className="pt-2 border-t border-cyber-border space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-muted">Verify backend connectivity before saving:</span>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testResult.testing}
              className="px-3.5 py-1.5 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-xs font-mono text-neon-cyan font-bold transition-all"
            >
              {testResult.testing ? 'TESTING...' : '[ TEST HEALTH ENDPOINT ]'}
            </button>
          </div>

          {testResult.message && (
            <div
              className={`p-3 rounded-lg text-xs font-mono border ${
                testResult.ok
                  ? 'bg-neon-green/10 border-neon-green/40 text-neon-green'
                  : 'bg-neon-red/10 border-neon-red/40 text-neon-red'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-cyber-border flex items-center justify-between font-mono">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-green text-cyber-bg font-bold text-xs tracking-wider shadow-neon-green hover:bg-neon-green/90 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>[ SAVE CONFIGURATION ]</span>
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="hud-panel rounded-xl p-6 space-y-4 border border-cyber-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-cyber-text font-mono flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neon-red" />
              Reset Demonstration State
            </h4>
            <p className="text-xs text-cyber-muted font-mono mt-1">
              Restores initial seed transactions, resets recycling bin capacity to 28%, and replenishes test food hoppers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2 rounded-lg bg-neon-red/10 hover:bg-neon-red/20 border border-neon-red/40 text-neon-red text-xs font-mono font-bold transition-colors"
          >
            [ RESET SEED DATA ]
          </button>
        </div>
      </div>
    </div>
  );
};
