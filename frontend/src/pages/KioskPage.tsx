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
  Volume2
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner: Station Context & Simulation Controller Toggle */}
      <div className="bg-white border border-charcoal-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-forest-deep text-white flex items-center justify-center font-bold">
            <Recycle className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-charcoal text-sm">Station Kiosk #01</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-200 text-charcoal-muted uppercase">
                {machine?.displayName || 'DTU North Gate Station'}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted">
              Bin Fill: {machine?.recyclingBinFillPercent ?? 28}% • Dog Food Remaining: {machine?.foodInventoryGrams?.DOG_FEED ?? 1850}g
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSimControls(!showSimControls)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-charcoal-border bg-paper-100 hover:bg-paper-200 text-xs font-mono text-charcoal transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-forest-deep" />
          <span>{showSimControls ? 'Hide Test Controls' : 'Simulate Faults & Edge Cases'}</span>
        </button>
      </div>

      {/* Simulator Edge Case Controls Drawer */}
      {showSimControls && (
        <div className="bg-paper-200/80 border border-charcoal-border rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-charcoal flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Evaluator Test Bench (Simulate Machine Edge Cases)
            </span>
            <span className="text-[11px] text-charcoal-muted">Click to test failure handling & recovery</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <button
              onClick={() => triggerSimFault('FULL_BIN')}
              className="p-2.5 rounded-lg bg-white border border-charcoal-border hover:border-amber-500 font-medium text-charcoal text-left"
            >
              Simulate Full Bin (98%)
            </button>
            <button
              onClick={() => triggerSimFault('EMPTY_FEED')}
              className="p-2.5 rounded-lg bg-white border border-charcoal-border hover:border-amber-500 font-medium text-charcoal text-left"
            >
              Simulate Empty Food (0g)
            </button>
            <button
              onClick={() => triggerSimFault('JAM')}
              className="p-2.5 rounded-lg bg-white border border-charcoal-border hover:border-red-500 font-medium text-charcoal text-left"
            >
              Simulate Motor Jam
            </button>
            <button
              onClick={() => triggerSimFault('OFFLINE')}
              className="p-2.5 rounded-lg bg-white border border-charcoal-border hover:border-red-500 font-medium text-charcoal text-left"
            >
              Simulate Machine Offline
            </button>
            <button
              onClick={() => triggerSimFault('RESTORE')}
              className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-200"
            >
              Restore Normal State
            </button>
          </div>
        </div>
      )}

      {/* Active Fault Alerts Warning */}
      {machine && machine.activeFaults.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <span className="font-bold">Active Machine Faults Detected: </span>
            <span>{machine.activeFaults.join(', ')}. Intake locked until maintenance inspection.</span>
          </div>
        </div>
      )}

      {/* Main Interactive Kiosk Container */}
      <div className="bg-white border-2 border-charcoal-border rounded-2xl shadow-md overflow-hidden min-h-[520px] flex flex-col">
        {/* Kiosk Step Progress Bar */}
        <div className="bg-paper-100 border-b border-charcoal-border px-6 py-3 flex items-center justify-between text-xs font-mono text-charcoal-muted">
          <span>KIOSK INTERACTION • STEP 0{currentStep} OF 05</span>
          <span className="uppercase text-forest-deep font-semibold">
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
              <div className="w-20 h-20 mx-auto rounded-2xl bg-forest-deep text-white flex items-center justify-center shadow-md">
                <Recycle className="w-10 h-10 text-emerald-300" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
                Turn Waste Into Care.
              </h2>

              <p className="text-base text-charcoal-muted leading-relaxed max-w-lg mx-auto">
                Recycle an eligible bottle or can. Help build a cleaner environment and support responsible, measured community feeding.
              </p>
            </div>

            {/* Accepted Materials List */}
            <div className="bg-paper-100 border border-charcoal-border rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-mono uppercase font-semibold text-charcoal">
                <span>Accepted Materials</span>
                <span className="text-emerald-700">Clean & Empty Containers Only</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-charcoal">
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-charcoal-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PET Plastic Beverage Bottles</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-charcoal-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aluminium Drink Cans</span>
                </div>
              </div>
              <p className="text-[11px] text-charcoal-muted pt-1">
                * Glass, hazardous e-waste, and multi-layer unsupported plastics are rejected for compactor safety.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-forest-deep text-white font-bold text-base shadow-md hover:bg-forest-card transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Deposit Recyclable Item</span>
                <ArrowRight className="w-5 h-5 text-emerald-300" />
              </button>

              <Link
                to="/impact"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-paper-100 hover:bg-paper-200 border border-charcoal-border text-charcoal font-semibold text-sm transition-colors text-center"
              >
                Explore Impact Ledger
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT ITEM & BENEFICIARY MODULE */}
        {currentStep === 2 && (
          <div className="flex-1 p-6 sm:p-10 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-charcoal">
                Simulated Item Intake & Beneficiary Selection
              </h3>
              <p className="text-xs text-charcoal-muted mt-1">
                Select an item to simulate placing it into the intake slot, and choose which animal feeding hopper should receive the authorized portion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Select Recyclable Input */}
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase font-bold text-charcoal block">
                  1. Select Inserted Item (Simulated Sensor Input)
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
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                          isSelected
                            ? 'bg-forest-50 border-forest-deep ring-1 ring-forest-deep'
                            : 'bg-white border-charcoal-border hover:bg-paper-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-charcoal text-sm">{opt.name}</span>
                          </div>
                          <p className="text-charcoal-muted mt-0.5">{opt.desc}</p>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            opt.valid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
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
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase font-bold text-charcoal block">
                  2. Choose Beneficiary Module
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
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600'
                            : 'bg-white border-charcoal-border hover:bg-paper-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Heart className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-charcoal-muted'}`} />
                            <span className="font-bold text-charcoal text-sm">{mod.name}</span>
                          </div>
                          <p className="text-charcoal-muted mt-0.5">{mod.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono bg-paper-200 text-charcoal px-2 py-1 rounded">
                          {isPlanned ? 'PLANNED' : mod.portion}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-paper-100 p-4 rounded-xl border border-charcoal-border text-xs text-charcoal-muted space-y-1">
                  <span className="font-semibold text-charcoal block">Sensor Emulation Specs:</span>
                  <p>Weight: ~{selectedItem === 'PET_BOTTLE' ? '28g' : selectedItem === 'ALUMINIUM_CAN' ? '15g' : '220g'} (Load Cell Emulated)</p>
                  <p>Optics: Active ToF Distance Array</p>
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-charcoal-border flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                Back to Welcome
              </button>

              <button
                onClick={handleStartRecycling}
                className="px-6 py-3 rounded-xl bg-forest-deep text-white font-bold text-sm shadow-md hover:bg-forest-card transition-all flex items-center gap-2"
              >
                <span>Confirm & Insert Item</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 & 4: PROCESSING & DISPENSING ANIMATION */}
        {(currentStep === 3 || currentStep === 4) && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center space-y-8 text-center max-w-lg mx-auto">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-forest-50 border-4 border-forest-deep flex items-center justify-center animate-pulse-glow shadow-md">
                <Recycle className="w-12 h-12 text-forest-deep animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-charcoal">
                {currentStep === 3 ? 'Validating Inserted Container...' : 'Dispensing Food Portion...'}
              </h3>
              <p className="text-sm text-charcoal-muted font-mono">{dispenseStageText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-paper-200 rounded-full h-3 overflow-hidden border border-charcoal-border">
              <div
                className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${dispenseProgress || 20}%` }}
              ></div>
            </div>

            <div className="text-xs text-charcoal-muted font-mono bg-paper-100 px-4 py-2 rounded-lg border border-charcoal-border">
              AWS Mode: {settings.operatingMode} • Validating Idempotency & Safety
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
                  className={`p-6 rounded-2xl border text-center space-y-2 ${
                    lastResponse.accepted && lastResponse.dispenseStatus !== 'FAILED'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : lastResponse.accepted && lastResponse.dispenseStatus === 'FAILED'
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-red-50 border-red-300 text-red-950'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-white shadow-xs">
                    {lastResponse.accepted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold">
                    {lastResponse.accepted
                      ? lastResponse.dispenseStatus === 'FAILED'
                        ? 'Recyclable Accepted (Food Hopper Empty)'
                        : 'Recycling & Dispensing Completed!'
                      : 'Item Rejected'}
                  </h3>

                  <p className="text-xs leading-relaxed max-w-md mx-auto">
                    {lastResponse.message}
                  </p>
                </div>

                {/* Formal Transaction Receipt Ledger Card */}
                <div className="bg-white border border-charcoal-border rounded-xl p-6 space-y-4 shadow-sm text-xs">
                  <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                    <span className="font-mono font-bold uppercase text-charcoal text-sm">
                      Transaction Receipt
                    </span>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {lastResponse.transaction.simulationMode ? 'SIMULATED TRANSACTION' : 'PHYSICAL TRANSACTION'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 font-mono">
                    <span className="text-charcoal-muted">Event Reference:</span>
                    <span className="font-bold text-charcoal text-right">{lastResponse.eventId}</span>

                    <span className="text-charcoal-muted">Material Category:</span>
                    <span className="text-charcoal text-right">{lastResponse.transaction.itemType.replace('_', ' ')}</span>

                    <span className="text-charcoal-muted">Measured Mass:</span>
                    <span className="text-charcoal text-right">{lastResponse.transaction.measuredWeightGrams ?? 0}g</span>

                    <span className="text-charcoal-muted">Collection Status:</span>
                    <span className="text-charcoal text-right">{lastResponse.collectionStatus}</span>

                    <span className="text-charcoal-muted">Beneficiary Module:</span>
                    <span className="text-charcoal text-right">{lastResponse.transaction.beneficiaryModule.replace('_', ' ')}</span>

                    <span className="text-charcoal-muted">Dispensing Outcome:</span>
                    <span className="font-bold text-right text-emerald-700">
                      {lastResponse.dispenseStatus} ({lastResponse.feedGrams}g portion)
                    </span>

                    <span className="text-charcoal-muted">Timestamp:</span>
                    <span className="text-charcoal text-right">
                      {new Date(lastResponse.transaction.createdAt).toLocaleString()}
                    </span>

                    {lastResponse.rejectionReason && (
                      <>
                        <span className="text-red-700 font-bold">Rejection Rationale:</span>
                        <span className="text-red-700 text-right col-span-1">{lastResponse.rejectionReason}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Auto-reset countdown and manual actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                    <Clock className="w-4 h-4 text-forest-deep" />
                    <span>Returning to Idle in {countdown}s</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={resetKiosk}
                      className="px-5 py-2.5 rounded-xl bg-forest-deep text-white font-bold text-xs shadow-sm hover:bg-forest-card transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Start New Session</span>
                    </button>

                    <Link
                      to="/impact"
                      className="px-5 py-2.5 rounded-xl bg-white border border-charcoal-border hover:bg-paper-100 text-charcoal font-semibold text-xs transition-colors"
                    >
                      View Impact Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {errorNotice && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-4 max-w-lg mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
                <h4 className="font-bold text-base text-red-900">Transaction Failed</h4>
                <p className="text-xs text-red-800 leading-relaxed">{errorNotice}</p>
                <button
                  onClick={resetKiosk}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
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
