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
    <div className="bg-white border border-charcoal-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-charcoal-border bg-paper-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <Layers className="w-5 h-5 text-forest-deep" />
            Physical Machine Hardware Architecture
          </h3>
          <p className="text-xs text-charcoal-muted mt-1">
            Interactive engineering schematic: Click components below to review sensors, safety interlocks, and fail-safes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-paper-200 border border-charcoal-border px-3 py-1.5 rounded-lg w-fit">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Failsafe Interlocks Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-charcoal-border">
        {/* Component Selector List */}
        <div className="lg:col-span-5 p-4 space-y-2 bg-paper-50 max-h-[460px] overflow-y-auto">
          {HARDWARE_COMPONENTS.map(comp => {
            const isSelected = selectedComponent.id === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-forest-deep text-white border-forest-deep shadow-sm'
                    : 'bg-white text-charcoal border-charcoal-border hover:bg-paper-100 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comp.name}</span>
                  </div>
                  <span
                    className={`inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-forest-card text-emerald-200' : 'bg-paper-200 text-charcoal-muted'
                    }`}
                  >
                    {comp.category}
                  </span>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                ) : (
                  <Activity className="w-4 h-4 text-charcoal-muted shrink-0 mt-0.5 opacity-40" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Component Technical Detail Card */}
        <div className="lg:col-span-7 p-6 space-y-5 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {selectedComponent.category} Specification
              </span>
              <h4 className="text-xl font-bold text-charcoal mt-2">{selectedComponent.name}</h4>
            </div>
            <Cpu className="w-8 h-8 text-forest-deep opacity-30 shrink-0" />
          </div>

          <p className="text-sm text-charcoal leading-relaxed">
            {selectedComponent.description}
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-lg bg-paper-100 border border-charcoal-border text-xs">
              <span className="font-semibold text-charcoal block mb-1">Hardware & Sensor Implementation:</span>
              <p className="text-charcoal-muted font-mono leading-relaxed">{selectedComponent.hardwareSpecs}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
              <span className="font-semibold block mb-1 flex items-center gap-1.5 text-emerald-900">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                Physical Safety Interlock:
              </span>
              <p className="leading-relaxed">{selectedComponent.safetyInterlock}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <span className="font-semibold block mb-1 flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Sensor Fault & Jam Recovery:
              </span>
              <p className="leading-relaxed">{selectedComponent.failureHandling}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
