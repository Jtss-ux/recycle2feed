import React from 'react';
import { MachineDiagram } from '../components/MachineDiagram';
import { CloudDiagram } from '../components/CloudDiagram';
import {
  Recycle,
  ShieldCheck,
  Heart,
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-cyber-border pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon-green bg-neon-green/10 px-2.5 py-0.5 rounded border border-neon-green/30">
            // SYSTEM DESIGN & ENGINEERING
          </span>
          <span className="text-xs font-mono text-cyber-muted">
            TRACK: WASTE & ENERGY
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight font-mono">
          How ReCycle2Feed Works
        </h2>
        <p className="text-sm text-cyber-muted max-w-3xl leading-relaxed font-sans">
          From the moment a beverage container enters the intake slot to the controlled release of animal feed and cloud telemetry recording in AWS DynamoDB.
        </p>
      </div>

      {/* Part 1: Interactive Physical Hardware Architecture */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/30">
            SECTION 01 • PHYSICAL HARDWARE
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-cyber-text tracking-tight mt-2 font-mono">
            The Smart Reverse Vending Machine (RVM)
          </h3>
          <p className="text-xs text-cyber-muted mt-1 max-w-2xl leading-relaxed font-sans">
            Designed for outdoor or campus deployment. Explore the interactive sensor and motor subsystems below to understand physical safety interlocks.
          </p>
        </div>

        <MachineDiagram />
      </section>

      {/* Part 2: Interactive AWS Serverless Cloud Architecture */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/30">
            SECTION 02 • CLOUD ARCHITECTURE
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-cyber-text tracking-tight mt-2 font-mono">
            AWS Serverless Data & Telemetry Platform
          </h3>
          <p className="text-xs text-cyber-muted mt-1 max-w-2xl leading-relaxed font-sans">
            High-availability, zero-maintenance architecture deployed via AWS SAM. Uses Amazon API Gateway, AWS Lambda, Amazon DynamoDB, and CloudWatch.
          </p>
        </div>

        <CloudDiagram />
      </section>

      {/* Part 3: Food Safety & Ethical Deployment Protocols */}
      <section className="hud-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-cyber-border">
        <div className="border-b border-cyber-border pb-4">
          <h3 className="text-xl font-bold text-cyber-text font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-neon-green" />
            Food Safety, Hygiene & Ethical Deployment Protocols
          </h3>
          <p className="text-xs text-cyber-muted font-mono mt-1">
            Responsible engineering principles governing public community animal feeding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed font-mono">
          {/* Protocol 1 */}
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
            <div className="flex items-center gap-2 font-bold text-neon-green">
              <Lock className="w-4 h-4 text-neon-green" />
              <span>Strict Species Hopper Isolation</span>
            </div>
            <p className="text-cyber-muted font-sans text-xs">
              Dog food, cat food, and bird grains possess distinct nutritional profiles and scent markers. Each feed type is held in physically sealed polypropylene hoppers with airtight gaskets to prevent pest intrusion, mold from ambient monsoon humidity, and cross-species contamination.
            </p>
          </div>

          {/* Protocol 2 */}
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
            <div className="flex items-center gap-2 font-bold text-neon-cyan">
              <Heart className="w-4 h-4 text-neon-cyan" />
              <span>Controlled Calibrated Portions</span>
            </div>
            <p className="text-cyber-muted font-sans text-xs">
              Uncontrolled free-feeding causes food spoiling, attracting pests or stray rodent colonies. ReCycle2Feed meters calibrated portions (10g–20g per item) enforced with a 5-second mechanical cooldown to discourage feed hoarding and encourage active consumption.
            </p>
          </div>

          {/* Protocol 3 */}
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
            <div className="flex items-center gap-2 font-bold text-neon-amber">
              <AlertTriangle className="w-4 h-4 text-neon-amber" />
              <span>Human Food Module Distinction</span>
            </div>
            <p className="text-cyber-muted font-sans text-xs">
              <strong className="text-cyber-text">Crucial Design Rule:</strong> Human food assistance is <em>never</em> dispensed through an animal feed hopper or chute. The planned future human food module operates as a temperature-controlled locker dispensing factory-sealed nutritious meal packs in collaboration with verified food banking NGOs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
