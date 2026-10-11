import React, { useState } from 'react';
import { Eye, Shield, Cpu, Activity, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';

interface ComponentInfo {
  id: string;
  name: string;
  category: 'Sensors' | 'Mechanics' | 'Dispensing' | 'Safety';
  description: string;
  hardwareSpecs: string;
  safetyInterlock: string;
  failureHandling: string;
}

const HARDWARE_COMPONENTS: ComponentInfo[] = [
  {
    id: 'intake-sensors',
    name: 'Dual Intake Validation Sensors',
    category: 'Sensors',
    description: 'Combines an optical time-of-flight profile sensor with an inductive proximity sensor at the entry slot to verify item geometry and distinguish aluminium metal from plastic or glass.',
    hardwareSpecs: 'VL53L1X ToF distance array + LJ12A3-4-Z/BX inductive sensor (NPN NO) interfacing with ESP32 GPIOs.',
    safetyInterlock: 'Intake motorized shutter remains locked if collection bin is >=95% full or if foreign hazardous objects are sensed.',
    failureHandling: 'If inductive & optical readings conflict, the item is returned immediately via the rejection chute.'
  },
  {
    id: 'load-cell',
    name: 'Precision Intake Load Cell',
    category: 'Sensors',
    description: 'Measures tare and gross weight of inserted containers to detect residual liquids, glass containers (>150g), or non-empty bottles.',
    hardwareSpecs: 'Single-point 5kg load cell with 24-bit HX711 ADC amplifier, calibrated to ±1g accuracy.',
    safetyInterlock: 'Rejects containers weighing >60g (indicates liquid contamination) to keep collection bins dry and odorless.',
    failureHandling: 'Drift correction routine runs every 60 seconds during kiosk idle state.'
  },
  {
    id: 'compactor',
    name: 'Motorized Diverter & Rotary Compactor',
    category: 'Mechanics',
    description: 'Flips accepted bottles and cans into separate internal collection bins and activates a geared rotary crusher to reduce waste volume by up to 70%.',
    hardwareSpecs: '12V DC High-Torque Planetary Geared Motor with current-sensing stall detection and magnetic limit switches.',
    safetyInterlock: 'Current limiter cuts motor power within 15ms if current spikes above 3.5A, preventing motor burnout or human limb hazards.',
    failureHandling: 'Auto-reverses for 1.5 seconds if stall is detected; if unresolved after 3 cycles, logs JAM fault and locks slot.'
  },
  {
    id: 'food-hoppers',
    name: 'Isolated Sealed Food Hoppers',
    category: 'Dispensing',
    description: 'Hermetically sealed food storage hoppers. Separate isolated chambers for Dog kibble (3kg), Cat kibble (2kg), and Bird grains (1kg) with desiccants and pest seals.',
    hardwareSpecs: 'Food-grade polypropylene (PP) compartments with silicone perimeter gaskets and ultrasonic distance sensors (HC-SR04) for level monitoring.',
    safetyInterlock: 'Physical divider walls prevent cross-species scent or feed cross-contamination. Human food is strictly segregated in future separate pack lockers.',
    failureHandling: 'Low level (<200g) triggers automated restock alert in operator dashboard.'
  },
  {
    id: 'dispense-auger',
    name: 'Controlled Dispensing Auger Mechanism',
    category: 'Dispensing',
    description: 'Rotates an Archimedes screw auger by a precise number of turns to dispense a calibrated 10g - 20g portion into the sheltered community bowl.',
    hardwareSpecs: 'NEMA 17 Stepper Motor driven by A4988 driver, controlled via ESP32 PWM step pulses with optical revolution encoder feedback.',
    safetyInterlock: 'Minimum 5-second cooldown between dispenses prevents over-feeding and mechanism overheating.',
    failureHandling: 'Encoder verifies full rotation. If rotor does not complete cycle, transaction logs DISPENSE_FAILED and refunds quota.'
  },
  {
    id: 'esp32-controller',
    name: 'ESP32 IoT Edge Controller',
    category: 'Safety',
    description: 'Industrial-grade microcontroller running FreeRTOS. Executes local safety routines, validates sensor inputs, and pushes signed telemetry to AWS IoT Core over TLS 1.3.',
    hardwareSpecs: 'ESP32-WROOM-32D (Dual Core 240MHz, 4MB Flash, Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BLE + optional SIM800L 4G LTE modem).',
    safetyInterlock: 'Hardware watchdog timer restarts controller if FreeRTOS task hangs for >3 seconds. Failsafe locks all high-voltage relays to open circuit on boot.',
    failureHandling: 'Offline flash queue caches up to 500 transaction records if local Wi-Fi drops, syncing when connectivity resumes.'
  }
];

export const MachineDiagram: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo>(HARDWARE_COMPONENTS[0]);

  return (
    <div className="hud-panel rounded-xl shadow-hud-panel overflow-hidden border border-cyber-border">
      <div className="p-6 border-b border-cyber-border bg-cyber-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-cyber-text font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-neon-green" />
            Physical Machine Hardware Architecture
          </h3>
          <p className="text-xs text-cyber-muted font-mono mt-1">
            Interactive engineering schematic: Click components below to review sensors, safety interlocks, and fail-safes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-cyber-card border border-neon-green/30 text-neon-green px-3 py-1.5 rounded-lg w-fit">
          <Shield className="w-4 h-4 text-neon-green" />
          <span>FAILSAFE INTERLOCKS ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-cyber-border">
        {/* Component Selector List */}
        <div className="lg:col-span-5 p-4 space-y-2 bg-cyber-surface max-h-[460px] overflow-y-auto">
          {HARDWARE_COMPONENTS.map(comp => {
            const isSelected = selectedComponent.id === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-mono flex items-center justify-between ${
                  isSelected
                    ? 'bg-neon-green/10 border-neon-green text-cyber-text shadow-neon-green'
                    : 'bg-cyber-card border-cyber-border text-cyber-muted hover:text-cyber-text hover:border-cyber-border/80'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block text-cyber-text">{comp.name}</span>
                  <span className="text-[10px] text-cyber-muted uppercase mt-0.5 block">{comp.category}</span>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${
                    comp.category === 'Sensors'
                      ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
                      : comp.category === 'Mechanics'
                        ? 'bg-neon-amber/10 text-neon-amber border-neon-amber/30'
                        : comp.category === 'Dispensing'
                          ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                          : 'bg-neon-purple/10 text-neon-purple border-neon-purple/30'
                  }`}
                >
                  {comp.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Component Inspection Pane */}
        <div className="lg:col-span-7 p-6 space-y-5 bg-cyber-bg">
          <div className="border-b border-cyber-border pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan block">
                // COMPONENT SCHEMATIC
              </span>
              <h4 className="text-lg font-bold text-cyber-text font-mono mt-0.5">
                {selectedComponent.name}
              </h4>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-cyber-card border border-cyber-border text-neon-green">
              {selectedComponent.category}
            </span>
          </div>

          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            {selectedComponent.description}
          </p>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-cyber-card border border-cyber-border space-y-1">
              <span className="font-bold text-neon-cyan block text-[11px]">// HARDWARE & ELECTRICAL SPECIFICATIONS</span>
              <p className="text-[11px] text-cyber-muted font-sans">{selectedComponent.hardwareSpecs}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-cyber-card border border-cyber-border space-y-1">
              <span className="font-bold text-neon-green block text-[11px]">// SAFETY INTERLOCK & OPERATIONAL BOUNDARIES</span>
              <p className="text-[11px] text-cyber-muted font-sans">{selectedComponent.safetyInterlock}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-cyber-card border border-cyber-border space-y-1">
              <span className="font-bold text-neon-amber block text-[11px]">// SENSOR DRIFT & FAILURE RECOVERY</span>
              <p className="text-[11px] text-cyber-muted font-sans">{selectedComponent.failureHandling}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
