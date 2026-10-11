import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ApiClient } from '../services/api';
import {
  ItemType,
  BeneficiaryModule,
  TransactionResponse,
  TransactionRecord
} from '../types';
import {
  Recycle,
  CheckCircle2,
  AlertTriangle,
  Heart,
  RotateCcw,
  BarChart3,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Info,
  Clock,
  Volume2,
  Terminal,
  Activity,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const KioskPage: React.FC = () => {
  const { settings, machine, refreshData } = useApp();

  // Kiosk Journey Step: 1 = Welcome, 2 = Select Item, 3 = Validating, 4 = Dispensing, 5 = Receipt
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<ItemType>('PET_BOTTLE');
  const [selectedModule, setSelectedModule] = useState<BeneficiaryModule>('DOG_FEED');
  const [measuredWeight, setMeasuredWeight] = useState<number>(28);

  // Animation & Execution States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dispenseProgress, setDispenseProgress] = useState<number>(0);
  const [dispenseStageText, setDispenseStageText] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<TransactionResponse | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(15);

  // Simulator Edge Case Override Panel
  const [showSimControls, setShowSimControls] = useState<boolean>(false);

  // Auto-reset countdown when reaching receipt screen
  useEffect(() => {
    let timer: any;
    if (currentStep === 5 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (currentStep === 5 && countdown === 0) {
      resetKiosk();
    }
    return () => clearTimeout(timer);
  }, [currentStep, countdown]);

  const resetKiosk = () => {
    setCurrentStep(1);
    setDispenseProgress(0);
    setDispenseStageText('');
    setLastResponse(null);
    setErrorNotice(null);
    setCountdown(15);
    setIsProcessing(false);
  };

  // Step 2 -> 3 -> 4: Submit item and run simulated dispensing sequence
  const handleStartRecycling = async () => {
    setIsProcessing(true);
    setCurrentStep(3);
    setErrorNotice(null);

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      // 1. Validation & API call
      setDispenseStageText('Checking optical profile & inductive material sensors...');
      await new Promise(r => setTimeout(r, 800));

      const response = await ApiClient.createTransaction({
        eventId,
        machineId: settings.defaultMachineId,
        itemType: selectedItem,
        beneficiaryModule: selectedModule,
        sensorSource: 'SIMULATOR',
        measuredWeightGrams: measuredWeight,
        simulationMode: settings.operatingMode === 'SIMULATION'
      });

      setLastResponse(response);

      // If item was rejected by validation check or machine full/jammed
      if (!response.accepted) {
        setIsProcessing(false);
        setCurrentStep(5); // Show rejection receipt immediately
        refreshData();
        return;
      }

      // 2. Collection confirmed, now execute multi-stage dispensing sequence
      setCurrentStep(4);
      setDispenseProgress(20);
      setDispenseStageText('Compactor engaged. Recyclable collected into secure compartment.');
      await new Promise(r => setTimeout(r, 900));

      setDispenseProgress(50);
      setDispenseStageText('Authorizing portion quota with AWS Serverless backend...');
      await new Promise(r => setTimeout(r, 800));

      setDispenseProgress(80);
      setDispenseStageText(`Actuating ${selectedModule.replace('_', ' ')} auger feeder mechanism...`);
      await new Promise(r => setTimeout(r, 1000));

      setDispenseProgress(100);
      setDispenseStageText(
        response.dispenseStatus === 'FAILED'
          ? 'Actuator check complete: Hopper inventory was exhausted. Logged for restock.'
          : 'Dispensing sequence complete. Portioned feed released into sheltered bowl.'
      );
      await new Promise(r => setTimeout(r, 700));

      setIsProcessing(false);
      setCurrentStep(5); // Receipt screen
      refreshData();
    } catch (err: any) {
      console.error('Kiosk transaction failed:', err);
      setIsProcessing(false);
      setErrorNotice(err.message || 'An unexpected error occurred communicating with the backend.');
      setCurrentStep(5);
    }
  };

  // Simulator Quick Toggles for testing edge cases
  const triggerSimFault = async (faultType: 'JAM' | 'FULL_BIN' | 'EMPTY_FEED' | 'OFFLINE' | 'RESTORE') => {
    try {
      const current = await ApiClient.getMachine();
      if (faultType === 'JAM') {
        current.activeFaults = ['DISPENSER_MOTOR_JAM'];
      } else if (faultType === 'FULL_BIN') {
        current.recyclingBinFillPercent = 98;
      } else if (faultType === 'EMPTY_FEED') {
        current.foodInventoryGrams.DOG_FEED = 0;
        current.foodInventoryGrams.CAT_FEED = 0;
        current.foodInventoryGrams.BIRD_FEED = 0;
      } else if (faultType === 'OFFLINE') {
        current.onlineStatus = 'OFFLINE';
      } else if (faultType === 'RESTORE') {
        current.activeFaults = [];
        current.recyclingBinFillPercent = 25;
        current.foodInventoryGrams.DOG_FEED = 2000;
        current.foodInventoryGrams.CAT_FEED = 1000;
        current.foodInventoryGrams.BIRD_FEED = 800;
        current.onlineStatus = 'ONLINE';
      }
      localStorage.setItem('recycle2feed_sim_machine', JSON.stringify(current));
      await refreshData();
      alert(`Simulator state updated: ${faultType}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner: Station Context & Simulation Controller Toggle */}
      <div className="hud-panel rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-cyber-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyber-card border border-neon-green/40 flex items-center justify-center font-bold text-neon-green shadow-neon-green">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyber-text text-sm font-mono tracking-wider">
                STATION KIOSK #01
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/30 uppercase tracking-widest">
                {machine?.displayName || 'DTU NORTH GATE STATION'}
              </span>
            </div>
            <p className="text-xs text-cyber-muted font-mono mt-0.5">
              BIN FILL: <span className="text-neon-green font-bold">{machine?.recyclingBinFillPercent ?? 28}%</span> • DOG FOOD: <span className="text-neon-cyan font-bold">{machine?.foodInventoryGrams?.DOG_FEED ?? 1850}g</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSimControls(!showSimControls)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neon-amber/50 bg-neon-amber/10 hover:bg-neon-amber/20 text-xs font-mono font-bold text-neon-amber transition-all shadow-neon-amber"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showSimControls ? '[ HIDE TEST CONTROLS ]' : '[ SIMULATE FAULTS & EDGE CASES ]'}</span>
        </button>
      </div>

      {/* Simulator Edge Case Controls Drawer */}
      {showSimControls && (
        <div className="hud-panel border border-neon-amber/50 rounded-xl p-5 space-y-4 animate-in fade-in duration-200 bg-cyber-surface">
          <div className="flex items-center justify-between border-b border-cyber-border pb-2">
            <span className="text-xs font-mono font-bold uppercase text-neon-amber flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-neon-amber" />
              EVALUATOR TEST BENCH (SIMULATE HARDWARE EDGE CASES)
            </span>
            <span className="text-[11px] text-cyber-muted font-mono">Simulates real sensor & actuator anomalies</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            <button
              onClick={() => triggerSimFault('FULL_BIN')}
              className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border hover:border-neon-amber text-cyber-text hover:text-neon-amber font-medium text-left transition-colors"
            >
              Simulate Full Bin (98%)
            </button>
            <button
              onClick={() => triggerSimFault('EMPTY_FEED')}
              className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border hover:border-neon-amber text-cyber-text hover:text-neon-amber font-medium text-left transition-colors"
            >
              Simulate Empty Food (0g)
            </button>
            <button
              onClick={() => triggerSimFault('JAM')}
              className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border hover:border-neon-red text-cyber-text hover:text-neon-red font-medium text-left transition-colors"
            >
              Simulate Motor Jam
            </button>
            <button
              onClick={() => triggerSimFault('OFFLINE')}
              className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border hover:border-neon-red text-cyber-text hover:text-neon-red font-medium text-left transition-colors"
            >
              Simulate Offline Mode
            </button>
            <button
              onClick={() => triggerSimFault('RESTORE')}
              className="p-2.5 rounded-lg bg-neon-green/10 border border-neon-green/50 text-neon-green font-bold hover:bg-neon-green/20 text-center transition-all shadow-neon-green"
            >
              ✓ Restore Normal
            </button>
          </div>
        </div>
      )}

      {/* Active Fault Alerts Warning */}
      {machine && machine.activeFaults.length > 0 && (
        <div className="bg-neon-red/10 border border-neon-red/50 rounded-xl p-4 flex items-center gap-3 text-neon-red text-xs font-mono">
          <AlertTriangle className="w-5 h-5 text-neon-red shrink-0 animate-bounce" />
          <div>
            <span className="font-bold">Active Machine Faults Detected: </span>
            <span>{machine.activeFaults.join(', ')}. Intake locked until maintenance inspection.</span>
          </div>
        </div>
      )}

      {/* Main Interactive Kiosk Container */}
      <div className="hud-panel border-2 border-cyber-border rounded-2xl shadow-hud-panel overflow-hidden min-h-[540px] flex flex-col">
        {/* Kiosk Step Progress Bar */}
        <div className="bg-cyber-surface border-b border-cyber-border px-6 py-3 flex items-center justify-between text-xs font-mono text-cyber-muted">
          <span className="text-neon-green font-bold">KIOSK INTERACTION • STEP 0{currentStep} OF 05</span>
          <span className="uppercase text-neon-cyan font-bold tracking-wider">
            {currentStep === 1 && 'Welcome & Supported Materials'}
            {currentStep === 2 && 'Intake Sensor Simulation'}
            {currentStep === 3 && 'Material Optical Validation'}
            {currentStep === 4 && 'Dispensing Sequence'}
            {currentStep === 5 && 'Transaction Receipt & Outcome'}
          </span>
        </div>

        {/* STEP 1: WELCOME SCREEN */}
        {currentStep === 1 && (
          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between space-y-8 text-center max-w-2xl mx-auto">
            <div className="space-y-4 pt-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-cyber-card border-2 border-neon-green/50 text-neon-green flex items-center justify-center shadow-neon-green animate-pulse-glow">
                <Recycle className="w-10 h-10" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight font-mono">
                TURN WASTE <span className="text-neon-green glow-green">INTO CARE.</span>
              </h2>
              <p className="text-xs sm:text-sm font-mono text-neon-cyan font-semibold">
                कचरे से देखभाल की ओर • स्वच्छ परिसर, सुरक्षित आहार
              </p>

              <p className="text-xs sm:text-sm text-cyber-muted font-mono leading-relaxed max-w-lg mx-auto">
                Recycle an eligible bottle or can. Help build a cleaner, litter-free campus and support responsible, measured community feeding.
              </p>
            </div>

            {/* Accepted Materials List */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-mono uppercase font-semibold text-cyber-text">
                <span className="text-neon-green font-bold">// ACCEPTED MATERIALS</span>
                <span className="text-neon-cyan text-[10px]">Clean & Empty Containers Only</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-cyber-text">
                <div className="flex items-center gap-2 p-2 bg-cyber-bg rounded border border-cyber-border">
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                  <span>PET Plastic Beverage Bottles</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-cyber-bg rounded border border-cyber-border">
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                  <span>Aluminium Drink Cans</span>
                </div>
              </div>
              <p className="text-[10px] text-cyber-muted font-mono pt-1">
                * Glass, hazardous e-waste, and multi-layer unsupported plastics are rejected for compactor safety.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neon-green text-cyber-bg font-mono font-bold text-sm tracking-wider shadow-neon-green hover:bg-neon-green/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>DEPOSIT RECYCLABLE ITEM / बोतल डालें</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/impact"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-cyber-card hover:bg-cyber-surface border border-cyber-border text-cyber-text font-mono font-bold text-xs tracking-wider transition-colors text-center"
              >
                EXPLORE IMPACT LEDGER
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT ITEM & BENEFICIARY MODULE */}
        {currentStep === 2 && (
          <div className="flex-1 p-6 sm:p-10 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-mono text-cyber-text">
                Simulated Item Intake & Beneficiary Selection
              </h3>
              <p className="text-xs text-cyber-muted font-mono mt-1">
                Select an item to simulate placing it into the intake slot, and choose which animal feeding hopper should receive the authorized portion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Select Recyclable Input */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase font-bold text-neon-green block">
                  1. SELECT INSERTED ITEM (SIMULATED SENSOR INPUT)
                </label>

                <div className="space-y-2">
                  {[
                    {
                      id: 'PET_BOTTLE',
                      name: 'PET Plastic Bottle (Eligible)',
                      desc: 'Transparent beverage container, ~28g, clean',
                      valid: true
                    },
                    {
                      id: 'ALUMINIUM_CAN',
                      name: 'Aluminium Drink Can (Eligible)',
                      desc: 'Standard beverage can, ~15g, metal detected',
                      valid: true
                    },
                    {
                      id: 'GLASS_BOTTLE',
                      name: 'Glass Container (Unsupported)',
                      desc: 'Heavy rigid glass container, ~220g (Hazardous)',
                      valid: false
                    },
                    {
                      id: 'E_WASTE',
                      name: 'Lithium Battery / E-Waste (Unsupported)',
                      desc: 'Electronic waste, dangerous in compactor',
                      valid: false
                    },
                    {
                      id: 'UNSUPPORTED_PLASTIC',
                      name: 'Mixed Multi-Layer Plastic (Unsupported)',
                      desc: 'Non-PET plastic container or pouch',
                      valid: false
                    }
                  ].map(opt => {
                    const isSelected = selectedItem === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedItem(opt.id as ItemType)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-mono flex items-center justify-between ${
                          isSelected
                            ? 'bg-neon-green/10 border-neon-green shadow-neon-green text-cyber-text'
                            : 'bg-cyber-card border-cyber-border hover:border-cyber-border/80 text-cyber-muted hover:text-cyber-text'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-cyber-text">{opt.name}</span>
                          </div>
                          <p className="text-[11px] text-cyber-muted mt-0.5">{opt.desc}</p>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            opt.valid ? 'bg-neon-green/20 text-neon-green border border-neon-green/40' : 'bg-neon-red/20 text-neon-red border border-neon-red/40'
                          }`}
                        >
                          {opt.valid ? 'PASS' : 'REJECT'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Select Beneficiary Feeding Module */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase font-bold text-neon-cyan block">
                  2. CHOOSE BENEFICIARY MODULE
                </label>

                <div className="space-y-2">
                  {[
                    {
                      id: 'DOG_FEED',
                      name: 'Community Dog Feeding',
                      portion: '20g dry kibble',
                      desc: 'Dispensed into clean ground-level feeding bowl'
                    },
                    {
                      id: 'CAT_FEED',
                      name: 'Community Cat Feeding',
                      portion: '15g cat food',
                      desc: 'Dispensed from dedicated isolated hopper'
                    },
                    {
                      id: 'BIRD_FEED',
                      name: 'Wild Bird Grain Feed',
                      portion: '10g grain mix',
                      desc: 'Dispensed onto elevated feeding tray'
                    },
                    {
                      id: 'HUMAN_FOOD_PACK',
                      name: 'Human Food Assistance (Planned)',
                      portion: 'Sealed Meal Pack (Partner NGO)',
                      desc: 'Future planned module; isolated from animal feed'
                    }
                  ].map(mod => {
                    const isSelected = selectedModule === mod.id;
                    const isPlanned = mod.id === 'HUMAN_FOOD_PACK';
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setSelectedModule(mod.id as BeneficiaryModule)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-mono flex items-center justify-between ${
                          isSelected
                            ? 'bg-neon-cyan/10 border-neon-cyan shadow-neon-cyan text-cyber-text'
                            : 'bg-cyber-card border-cyber-border hover:border-cyber-border/80 text-cyber-muted hover:text-cyber-text'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Heart className={`w-4 h-4 ${isSelected ? 'text-neon-cyan' : 'text-cyber-muted'}`} />
                            <span className="font-bold text-sm text-cyber-text">{mod.name}</span>
                          </div>
                          <p className="text-[11px] text-cyber-muted mt-0.5">{mod.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono bg-cyber-bg text-neon-cyan border border-cyber-border px-2 py-0.5 rounded">
                          {isPlanned ? 'PLANNED' : mod.portion}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-cyber-card p-3.5 rounded-xl border border-cyber-border text-xs font-mono text-cyber-muted space-y-1">
                  <span className="font-bold text-cyber-text block">// SENSOR EMULATION TELEMETRY</span>
                  <p>Weight: ~{selectedItem === 'PET_BOTTLE' ? '28g' : selectedItem === 'ALUMINIUM_CAN' ? '15g' : '220g'} (Load Cell Emulated)</p>
                  <p>Optics: Active Time-of-Flight Distance Array</p>
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-cyber-border flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-mono font-bold text-cyber-muted hover:text-cyber-text"
              >
                ← BACK TO WELCOME
              </button>

              <button
                onClick={handleStartRecycling}
                className="px-6 py-3 rounded-xl bg-neon-green text-cyber-bg font-mono font-bold text-xs tracking-wider shadow-neon-green hover:bg-neon-green/90 transition-all flex items-center gap-2"
              >
                <span>CONFIRM & INSERT ITEM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 & 4: PROCESSING & DISPENSING ANIMATION */}
        {(currentStep === 3 || currentStep === 4) && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center space-y-8 text-center max-w-lg mx-auto">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-cyber-card border-4 border-neon-green flex items-center justify-center animate-pulse-glow shadow-neon-green">
                <Recycle className="w-12 h-12 text-neon-green animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-mono text-cyber-text">
                {currentStep === 3 ? 'Validating Inserted Container...' : 'Dispensing Food Portion...'}
              </h3>
              <p className="text-xs text-neon-cyan font-mono">{dispenseStageText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-cyber-card rounded-full h-3 overflow-hidden border border-cyber-border">
              <div
                className="bg-neon-green h-full transition-all duration-500 rounded-full shadow-neon-green"
                style={{ width: `${dispenseProgress || 20}%` }}
              ></div>
            </div>

            <div className="text-xs text-cyber-muted font-mono bg-cyber-card px-4 py-2 rounded-lg border border-cyber-border">
              AWS MODE: <span className="text-neon-cyan font-bold">{settings.operatingMode}</span> • DYNAMODB IDEMPOTENCY CHECK
            </div>
          </div>
        )}

        {/* STEP 5: RECEIPT & RESULT OUTCOME */}
        {currentStep === 5 && (
          <div className="flex-1 p-6 sm:p-10 space-y-6">
            {lastResponse && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Result Headline Banner */}
                <div
                  className={`p-6 rounded-2xl border text-center space-y-2 font-mono ${
                    lastResponse.accepted && lastResponse.dispenseStatus !== 'FAILED'
                      ? 'bg-neon-green/10 border-neon-green text-cyber-text shadow-neon-green'
                      : lastResponse.accepted && lastResponse.dispenseStatus === 'FAILED'
                        ? 'bg-neon-amber/10 border-neon-amber text-cyber-text shadow-neon-amber'
                        : 'bg-neon-red/10 border-neon-red text-cyber-text shadow-neon-red'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-cyber-card border border-cyber-border">
                    {lastResponse.accepted ? (
                      <CheckCircle2 className="w-6 h-6 text-neon-green" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-neon-red" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold">
                    {lastResponse.accepted
                      ? lastResponse.dispenseStatus === 'FAILED'
                        ? 'Recyclable Accepted (Food Hopper Empty)'
                        : 'Recycling & Dispensing Completed!'
                      : 'Item Rejected'}
                  </h3>

                  <p className="text-xs leading-relaxed max-w-md mx-auto text-cyber-muted">
                    {lastResponse.message}
                  </p>
                </div>

                {/* Formal Transaction Receipt Ledger Card */}
                <div className="hud-panel border border-cyber-border rounded-xl p-6 space-y-4 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                    <span className="font-mono font-bold uppercase text-cyber-text text-sm">
                      // TRANSACTION RECEIPT
                    </span>
                    <span className="font-mono text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded">
                      {lastResponse.transaction.simulationMode ? 'SIMULATED TRANSACTION' : 'PHYSICAL TRANSACTION'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 font-mono">
                    <span className="text-cyber-muted">Event Reference:</span>
                    <span className="font-bold text-neon-cyan text-right">{lastResponse.eventId}</span>

                    <span className="text-cyber-muted">Material Category:</span>
                    <span className="text-cyber-text text-right">{lastResponse.transaction.itemType.replace('_', ' ')}</span>

                    <span className="text-cyber-muted">Measured Mass:</span>
                    <span className="text-cyber-text text-right">{lastResponse.transaction.measuredWeightGrams ?? 0}g</span>

                    <span className="text-cyber-muted">Collection Status:</span>
                    <span className="text-cyber-text text-right">{lastResponse.collectionStatus}</span>

                    <span className="text-cyber-muted">Beneficiary Module:</span>
                    <span className="text-cyber-text text-right">{lastResponse.transaction.beneficiaryModule.replace('_', ' ')}</span>

                    <span className="text-cyber-muted">Dispensing Outcome:</span>
                    <span className="font-bold text-right text-neon-green">
                      {lastResponse.dispenseStatus} ({lastResponse.feedGrams}g portion)
                    </span>

                    <span className="text-cyber-muted">Timestamp:</span>
                    <span className="text-cyber-text text-right">
                      {new Date(lastResponse.transaction.createdAt).toLocaleString()}
                    </span>

                    {lastResponse.rejectionReason && (
                      <>
                        <span className="text-neon-red font-bold">Rejection Rationale:</span>
                        <span className="text-neon-red text-right col-span-1">{lastResponse.rejectionReason}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Auto-reset countdown and manual actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 font-mono">
                  <div className="flex items-center gap-2 text-xs text-cyber-muted">
                    <Clock className="w-4 h-4 text-neon-green" />
                    <span>Returning to Idle in {countdown}s</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={resetKiosk}
                      className="px-5 py-2.5 rounded-xl bg-neon-green text-cyber-bg font-bold text-xs shadow-neon-green hover:bg-neon-green/90 transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>START NEW SESSION</span>
                    </button>

                    <Link
                      to="/impact"
                      className="px-5 py-2.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-neon-cyan text-neon-cyan font-bold text-xs transition-colors"
                    >
                      VIEW IMPACT DASHBOARD
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {errorNotice && (
              <div className="bg-neon-red/10 border border-neon-red/50 rounded-xl p-6 text-center space-y-4 max-w-lg mx-auto font-mono">
                <AlertTriangle className="w-8 h-8 text-neon-red mx-auto" />
                <h4 className="font-bold text-base text-neon-red">Transaction Failed</h4>
                <p className="text-xs text-cyber-muted leading-relaxed">{errorNotice}</p>
                <button
                  onClick={resetKiosk}
                  className="px-4 py-2 bg-neon-red text-white rounded-lg text-xs font-bold"
                >
                  Return to Welcome Screen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
