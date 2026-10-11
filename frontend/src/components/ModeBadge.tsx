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
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono border transition-all hover:scale-[1.02] ${
        isSim
          ? 'bg-neon-amber/10 border-neon-amber/50 text-neon-amber hover:shadow-neon-amber'
          : backendHealth.reachable
          ? 'bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan hover:shadow-neon-cyan'
          : 'bg-neon-red/10 border-neon-red/50 text-neon-red hover:shadow-neon-red'
      }`}
      title={`Click to configure. Status: ${backendHealth.statusText}`}
    >
      {isSim ? (
        <>
          <div className="w-2 h-2 rounded-full bg-neon-amber animate-pulse" />
          <Cpu className="w-3.5 h-3.5 text-neon-amber" />
          <span className="font-bold tracking-wider">SIMULATION</span>
          <span className="text-[10px] hidden sm:inline opacity-70 border-l border-neon-amber/30 pl-1.5">LOCAL</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <Cloud className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="font-bold tracking-wider">AWS CLOUD</span>
          {backendHealth.reachable ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-neon-red" />
          )}
        </>
      )}
    </Link>
  );
};
