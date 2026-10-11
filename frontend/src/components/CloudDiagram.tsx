import React from 'react';
import { Cloud, Server, Database, Activity, ShieldCheck, Radio, ArrowRight, Lock, Zap } from 'lucide-react';

export const CloudDiagram: React.FC = () => {
  return (
    <div className="hud-panel rounded-xl shadow-hud-panel p-6 sm:p-8 space-y-8 border border-cyber-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-cyber-text font-mono flex items-center gap-2">
            <Cloud className="w-5 h-5 text-neon-cyan" />
            AWS Serverless Cloud Architecture
          </h3>
          <p className="text-xs text-cyber-muted font-mono mt-1">
            End-to-end data pipeline configured via AWS SAM (CloudFormation) for infinite scalability and zero idle cost.
          </p>
        </div>
        <span className="font-mono text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 px-3 py-1 rounded-full w-fit">
          AWS SAM TEMPLATE: /infrastructure/template.yaml
        </span>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Step 1: Client / Edge */}
        <div className="border border-cyber-border rounded-xl p-4 bg-cyber-card space-y-3 relative group hover:border-neon-green/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-cyber-surface text-neon-green px-2 py-0.5 rounded border border-neon-green/20">
              LAYER 1
            </span>
            <Radio className="w-4 h-4 text-neon-green" />
          </div>
          <h4 className="font-bold text-sm text-cyber-text font-mono">Client & Edge</h4>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Touchscreen Kiosk (React + TypeScript) + ESP32 field devices communicate via authenticated HTTPS & MQTT TLS 1.3.
          </p>
          <div className="pt-2 text-[11px] font-mono text-neon-green space-y-1">
            <p>• AWS Amplify / CloudFront</p>
            <p>• Local Simulation Mode</p>
          </div>
        </div>

        {/* Step 2: API Gateway */}
        <div className="border border-cyber-border rounded-xl p-4 bg-cyber-card space-y-3 relative group hover:border-neon-cyan/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-cyber-surface text-neon-cyan px-2 py-0.5 rounded border border-neon-cyan/20">
              LAYER 2
            </span>
            <Server className="w-4 h-4 text-neon-cyan" />
          </div>
          <h4 className="font-bold text-sm text-cyber-text font-mono">API Gateway HTTP v2</h4>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Ultra low-latency HTTP API v2 route handler. Handles CORS preflight, SSL offloading, rate limiting, and request routing.
          </p>
          <div className="pt-2 text-[11px] font-mono text-neon-cyan space-y-1">
            <p>• GET /api/health</p>
            <p>• POST /api/transactions</p>
            <p>• GET /api/impact</p>
          </div>
        </div>

        {/* Step 3: Serverless Compute */}
        <div className="border border-cyber-border rounded-xl p-4 bg-cyber-card space-y-3 relative group hover:border-neon-amber/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-cyber-surface text-neon-amber px-2 py-0.5 rounded border border-neon-amber/20">
              LAYER 3
            </span>
            <Activity className="w-4 h-4 text-neon-amber" />
          </div>
          <h4 className="font-bold text-sm text-cyber-text font-mono">AWS Lambda (ARM64)</h4>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Stateless Node.js 20.x runtime on Graviton ARM64. Enforces idempotency rules, material validation, inventory decrement, and safety locks.
          </p>
          <div className="pt-2 text-[11px] font-mono text-neon-amber space-y-1">
            <p>• Idempotent event check</p>
            <p>• Inventory decrement</p>
            <p>• Cooldown enforcement</p>
          </div>
        </div>

        {/* Step 4: DynamoDB & Observability */}
        <div className="border border-cyber-border rounded-xl p-4 bg-cyber-card space-y-3 relative group hover:border-neon-green/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-cyber-surface text-neon-green px-2 py-0.5 rounded border border-neon-green/20">
              LAYER 4
            </span>
            <Database className="w-4 h-4 text-neon-green" />
          </div>
          <h4 className="font-bold text-sm text-cyber-text font-mono">Amazon DynamoDB</h4>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Single-digit millisecond NoSQL storage. ConditionExpression prevents duplicate writes. GSIs support fast date and machine aggregations.
          </p>
          <div className="pt-2 text-[11px] font-mono text-neon-green space-y-1">
            <p>• Transactions Table (GSI)</p>
            <p>• Machines Table (State)</p>
            <p>• CloudWatch Audit Logs</p>
          </div>
        </div>
      </div>

      {/* Cloud Security & Idempotency Note */}
      <div className="bg-cyber-card border border-neon-green/40 rounded-xl p-5 text-xs font-mono text-cyber-text flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-neon-green">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-neon-green block text-sm">
              Guaranteed Idempotency & Zero Double-Rewarding:
            </span>
            <p className="mt-1 text-cyber-muted leading-relaxed font-sans">
              DynamoDB writes utilize <code className="font-mono text-neon-green bg-neon-green/10 px-1 py-0.5 rounded border border-neon-green/30">ConditionExpression: attribute_not_exists(eventId)</code>.
              Even if a browser refreshes or a mobile network retries the request 10 times, exactly one transaction record is created and no secondary food reward can ever be released.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
