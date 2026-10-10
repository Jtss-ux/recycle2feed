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
  Lock
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* Header */}
      <div className="border-b border-charcoal-border pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-forest-deep bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
            System Design & Engineering
          </span>
          <span className="text-xs font-mono text-charcoal-muted">
            Track: Waste & Energy
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          How ReCycle2Feed Works
        </h2>
        <p className="text-base text-charcoal-muted max-w-3xl leading-relaxed">
          From the moment a beverage container enters the intake slot to the controlled release of animal feed and cloud telemetry recording in AWS DynamoDB.
        </p>
      </div>

      {/* Part 1: Interactive Physical Hardware Architecture */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Section 01 • Physical Hardware
          </span>
          <h3 className="text-2xl font-bold text-charcoal tracking-tight mt-2">
            The Smart Reverse Vending Machine (RVM)
          </h3>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            Designed for outdoor or campus deployment. Explore the interactive sensor and motor subsystems below to understand physical safety interlocks.
          </p>
        </div>

        <MachineDiagram />
      </section>

      {/* Part 2: Interactive AWS Serverless Cloud Architecture */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Section 02 • Cloud Architecture
          </span>
          <h3 className="text-2xl font-bold text-charcoal tracking-tight mt-2">
            AWS Serverless Data & Telemetry Platform
          </h3>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            High-availability, zero-maintenance architecture deployed via AWS SAM. Uses Amazon API Gateway, AWS Lambda, Amazon DynamoDB, and CloudWatch.
          </p>
        </div>

        <CloudDiagram />
      </section>

      {/* Part 3: Food Safety & Ethical Deployment Protocols */}
      <section className="bg-white border border-charcoal-border rounded-xl p-8 space-y-8 shadow-sm">
        <div className="border-b border-charcoal-border pb-4">
          <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            Food Safety, Hygiene & Ethical Deployment Protocols
          </h3>
          <p className="text-xs text-charcoal-muted mt-1">
            Responsible engineering principles governing public community animal feeding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          {/* Protocol 1 */}
          <div className="p-5 rounded-xl bg-paper-100 border border-charcoal-border space-y-3">
            <div className="flex items-center gap-2 font-bold text-charcoal">
              <Lock className="w-4 h-4 text-forest-deep" />
              <span>Strict Species Hopper Isolation</span>
            </div>
            <p className="text-charcoal-muted">
              Dog food, cat food, and bird grains possess distinct nutritional profiles and scent markers. Each feed type is held in physically sealed polypropylene hoppers with airtight gaskets to prevent pest intrusion, mold from ambient monsoon humidity, and cross-species contamination.
            </p>
          </div>

          {/* Protocol 2 */}
          <div className="p-5 rounded-xl bg-paper-100 border border-charcoal-border space-y-3">
            <div className="flex items-center gap-2 font-bold text-charcoal">
              <Heart className="w-4 h-4 text-emerald-700" />
              <span>Controlled Calibrated Portions</span>
            </div>
            <p className="text-charcoal-muted">
              Uncontrolled free-feeding causes food spoiling, attracting pests or stray rodent colonies. ReCycle2Feed meters calibrated portions (10g–20g per item) enforced with a 5-second mechanical cooldown to discourage feed hoarding and encourage active consumption.
            </p>
          </div>

          {/* Protocol 3 */}
          <div className="p-5 rounded-xl bg-paper-100 border border-charcoal-border space-y-3">
            <div className="flex items-center gap-2 font-bold text-charcoal">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Human Food Module Distinction</span>
            </div>
            <p className="text-charcoal-muted">
              <strong>Crucial Design Rule:</strong> Human food assistance is <em>never</em> dispensed through an animal feed hopper or chute. The planned future human food module operates as a temperature-controlled locker dispensing factory-sealed nutritious meal packs in collaboration with verified food banking NGOs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
