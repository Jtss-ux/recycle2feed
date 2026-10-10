import React from 'react';
import { Cloud, Server, Database, Activity, ShieldCheck, Radio, ArrowRight } from 'lucide-react';

export const CloudDiagram: React.FC = () => {
  return (
    <div className="bg-white border border-charcoal-border rounded-xl shadow-sm p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <Cloud className="w-5 h-5 text-forest-deep" />
            AWS Serverless Cloud Architecture
          </h3>
          <p className="text-xs text-charcoal-muted mt-1">
            End-to-end data pipeline configured via AWS SAM (CloudFormation) for infinite scalability and zero idle cost.
          </p>
        </div>
        <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full w-fit">
          AWS SAM Template: /infrastructure/template.yaml
        </span>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Step 1: Client / Edge */}
        <div className="border border-charcoal-border rounded-xl p-4 bg-paper-50 space-y-3 relative group hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-paper-200 text-charcoal-muted px-2 py-0.5 rounded">Layer 1</span>
            <Radio className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-charcoal">Client & Edge</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Touchscreen Kiosk (React + TypeScript) + ESP32 field devices communicate via authenticated HTTPS & MQTT TLS 1.3.
          </p>
          <div className="pt-2 text-[11px] font-mono text-forest-deep space-y-1">
            <p>• AWS Amplify / CloudFront</p>
            <p>• Local Simulation Mode</p>
          </div>
        </div>

        {/* Step 2: API Gateway */}
        <div className="border border-charcoal-border rounded-xl p-4 bg-paper-50 space-y-3 relative group hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-paper-200 text-charcoal-muted px-2 py-0.5 rounded">Layer 2</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-charcoal">API Gateway HTTP API</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Ultra low-latency HTTP API v2 route handler. Handles CORS preflight, SSL offloading, rate limiting, and request routing.
          </p>
          <div className="pt-2 text-[11px] font-mono text-forest-deep space-y-1">
            <p>• GET /api/health</p>
            <p>• POST /api/transactions</p>
            <p>• GET /api/impact</p>
          </div>
        </div>

        {/* Step 3: Serverless Compute */}
        <div className="border border-charcoal-border rounded-xl p-4 bg-paper-50 space-y-3 relative group hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-paper-200 text-charcoal-muted px-2 py-0.5 rounded">Layer 3</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-charcoal">AWS Lambda Functions</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Stateless Node.js 20.x runtime (ARM64 Graviton). Enforces idempotency rules, material validation, inventory decrement, and safety locks.
          </p>
          <div className="pt-2 text-[11px] font-mono text-forest-deep space-y-1">
            <p>• Idempotent event check</p>
            <p>• Inventory decrement</p>
            <p>• Cooldown enforcement</p>
          </div>
        </div>

        {/* Step 4: DynamoDB & Observability */}
        <div className="border border-charcoal-border rounded-xl p-4 bg-paper-50 space-y-3 relative group hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-paper-200 text-charcoal-muted px-2 py-0.5 rounded">Layer 4</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-charcoal">Amazon DynamoDB</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Single-digit millisecond NoSQL storage. ConditionExpression prevents duplicate writes. GSIs support fast date and machine aggregations.
          </p>
          <div className="pt-2 text-[11px] font-mono text-forest-deep space-y-1">
            <p>• Transactions Table (GSI)</p>
            <p>• Machines Table (State)</p>
            <p>• CloudWatch Audit Logs</p>
          </div>
        </div>
      </div>

      {/* Cloud Security & Idempotency Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-emerald-900">Guaranteed Idempotency & Zero Double-Rewarding:</span>
            <p className="mt-0.5 text-emerald-900 leading-relaxed">
              DynamoDB writes utilize <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">ConditionExpression: attribute_not_exists(eventId)</code>.
              Even if a browser refreshes or a mobile network retries the request 10 times, exactly one transaction record is created and no secondary food reward can ever be released.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
