import React from 'react';
import { useApp } from '../context/AppContext';
import { Cloud, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModeBadge: React.FC = () => {
  const { settings, backendHealth } = useApp();
  const isSim = settings.operatingMode === 'SIMULATION';

  return (
    <Link
      to="/settings"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all hover:shadow-sm"
      style={{
        backgroundColor: isSim ? '#FEF3C7' : backendHealth.reachable ? '#ECFDF5' : '#FEE2E2',
        borderColor: isSim ? '#F59E0B' : backendHealth.reachable ? '#10B981' : '#EF4444',
        color: isSim ? '#92400E' : backendHealth.reachable ? '#065F46' : '#991B1B'
      }}
      title={`Click to configure. Status: ${backendHealth.statusText}`}
    >
      {isSim ? (
        <>
          <Cpu className="w-3.5 h-3.5 animate-pulse text-amber-600" />
          <span className="font-semibold uppercase tracking-wider">SIMULATION MODE</span>
          <span className="text-[10px] hidden sm:inline opacity-75">(In-Browser / Local)</span>
        </>
      ) : (
        <>
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold uppercase tracking-wider">AWS CLOUD MODE</span>
          {backendHealth.reachable ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          )}
        </>
      )}
    </Link>
  );
};
