import {
  TransactionRecord,
  MachineRecord,
  MaintenanceRecord,
  CreateTransactionRequest,
  TransactionResponse,
  ImpactSummary,
  ItemType,
  BeneficiaryModule,
  DispenseStatus
} from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'recycle2feed_sim_txs',
  MACHINE: 'recycle2feed_sim_machine',
  MAINTENANCE: 'recycle2feed_sim_maint'
};

const STANDARD_PORTIONS: Record<BeneficiaryModule, number> = {
  DOG_FEED: 20,
  CAT_FEED: 15,
  BIRD_FEED: 10,
  HUMAN_FOOD_PACK: 0
};

export const INITIAL_MACHINE_STATE: MachineRecord = {
  machineId: 'machine-demo-01',
  displayName: 'DTU Campus North Gate Station (Kiosk 01)',
  locationLabel: 'Delhi Technological University, Shahbad Daulatpur, Delhi',
  operatingMode: 'SIMULATION',
  onlineStatus: 'ONLINE',
  lastHeartbeatAt: new Date().toISOString(),
  enabledMaterials: ['PET_BOTTLE', 'ALUMINIUM_CAN'],
  enabledBeneficiaryModules: ['DOG_FEED', 'CAT_FEED', 'BIRD_FEED'],
  recyclingBinFillPercent: 28,
  foodInventoryGrams: {
    DOG_FEED: 1850,
    CAT_FEED: 900,
    BIRD_FEED: 600,
    HUMAN_FOOD_PACK: 0
  },
  activeFaults: [],
  lastMaintenanceAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  cooldownSeconds: 5,
  lastDispensedAt: null
};

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    eventId: 'sim-seed-001',
    machineId: 'machine-demo-01',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dateKey: new Date(Date.now() - 48 * 3600 * 1000).toISOString().split('T')[0],
    itemType: 'PET_BOTTLE',
    measuredWeightGrams: 28,
    sensorSource: 'SIMULATOR',
    validationStatus: 'ACCEPTED',
    collectionStatus: 'SIMULATED',
    beneficiaryModule: 'DOG_FEED',
    dispenseStatus: 'SIMULATED',
    feedGrams: 20,
    rejectionReason: null,
    simulationMode: true,
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    eventId: 'sim-seed-002',
    machineId: 'machine-demo-01',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dateKey: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
    itemType: 'ALUMINIUM_CAN',
    measuredWeightGrams: 15,
    sensorSource: 'SIMULATOR',
    validationStatus: 'ACCEPTED',
    collectionStatus: 'SIMULATED',
    beneficiaryModule: 'CAT_FEED',
    dispenseStatus: 'SIMULATED',
    feedGrams: 15,
    rejectionReason: null,
    simulationMode: true,
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    eventId: 'sim-seed-003',
    machineId: 'machine-demo-01',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    dateKey: new Date(Date.now() - 12 * 3600 * 1000).toISOString().split('T')[0],
    itemType: 'GLASS_BOTTLE',
    measuredWeightGrams: 220,
    sensorSource: 'SIMULATOR',
    validationStatus: 'REJECTED',
    collectionStatus: 'FAILED',
    beneficiaryModule: 'DOG_FEED',
    dispenseStatus: 'NOT_ISSUED',
    feedGrams: 0,
    rejectionReason: 'Glass containers are unsupported by the optical compactor mechanism and pose safety hazards.',
    simulationMode: true,
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    maintenanceId: 'maint-init-01',
    machineId: 'machine-demo-01',
    actionType: 'CLEANING',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    operatorNote: 'Intake slot sanitized, optical sensors cleaned, feeder chute cleared.',
    status: 'COMPLETED',
    simulationMode: true
  }
];

export class MockStorageService {
  static getMachine(): MachineRecord {
    const raw = localStorage.getItem(STORAGE_KEYS.MACHINE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MACHINE, JSON.stringify(INITIAL_MACHINE_STATE));
      return { ...INITIAL_MACHINE_STATE };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { ...INITIAL_MACHINE_STATE };
    }
  }

  static saveMachine(machine: MachineRecord): void {
    localStorage.setItem(STORAGE_KEYS.MACHINE, JSON.stringify(machine));
  }

  static getTransactions(): TransactionRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return [...INITIAL_TRANSACTIONS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_TRANSACTIONS];
    }
  }

  static getMaintenanceLogs(): MaintenanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
      return [...INITIAL_MAINTENANCE];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_MAINTENANCE];
    }
  }

  static processSimulatedTransaction(req: CreateTransactionRequest): TransactionResponse {
    const txs = this.getTransactions();
    const existing = txs.find(t => t.eventId === req.eventId);
    if (existing) {
      return {
        eventId: existing.eventId,
        accepted: existing.validationStatus === 'ACCEPTED',
        collectionStatus: existing.collectionStatus,
        dispenseStatus: existing.dispenseStatus,
        feedGrams: existing.feedGrams,
        message: 'Duplicate event detected. Returned existing simulated record without double-rewarding.',
        rejectionReason: existing.rejectionReason,
        transaction: existing
      };
    }

    const machine = this.getMachine();
    const now = new Date();
    const isoNow = now.toISOString();
    const dateKey = isoNow.split('T')[0];

    // Check machine status
    if (machine.onlineStatus === 'OFFLINE') {
      const tx: TransactionRecord = {
        eventId: req.eventId,
        machineId: req.machineId,
        createdAt: isoNow,
        dateKey,
        itemType: req.itemType,
        measuredWeightGrams: req.measuredWeightGrams ?? null,
        sensorSource: req.sensorSource,
        validationStatus: 'REJECTED',
        collectionStatus: 'FAILED',
        beneficiaryModule: req.beneficiaryModule,
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        rejectionReason: 'Machine is currently OFFLINE or under service. Intake shutter locked.',
        simulationMode: true,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      txs.unshift(tx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Machine is offline.',
        rejectionReason: tx.rejectionReason,
        transaction: tx
      };
    }

    // Check bin fill capacity
    if (machine.recyclingBinFillPercent >= 95) {
      const tx: TransactionRecord = {
        eventId: req.eventId,
        machineId: req.machineId,
        createdAt: isoNow,
        dateKey,
        itemType: req.itemType,
        measuredWeightGrams: req.measuredWeightGrams ?? null,
        sensorSource: req.sensorSource,
        validationStatus: 'REJECTED',
        collectionStatus: 'FAILED',
        beneficiaryModule: req.beneficiaryModule,
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        rejectionReason: 'Recycling collection bin is at maximum capacity (>=95%). Emptying required.',
        simulationMode: true,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      txs.unshift(tx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Recycling bin full.',
        rejectionReason: tx.rejectionReason,
        transaction: tx
      };
    }

    // Check actuator jam
    if (machine.activeFaults.some(f => f.toLowerCase().includes('jam'))) {
      const tx: TransactionRecord = {
        eventId: req.eventId,
        machineId: req.machineId,
        createdAt: isoNow,
        dateKey,
        itemType: req.itemType,
        measuredWeightGrams: req.measuredWeightGrams ?? null,
        sensorSource: req.sensorSource,
        validationStatus: 'REJECTED',
        collectionStatus: 'FAILED',
        beneficiaryModule: req.beneficiaryModule,
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        rejectionReason: 'Feeder motor reported a mechanical jam fault. Safety lockout active.',
        simulationMode: true,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      txs.unshift(tx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Dispenser jammed. Intake locked.',
        rejectionReason: tx.rejectionReason,
        transaction: tx
      };
    }

    // Material eligibility check
    let accepted = true;
    let rejectionReason: string | null = null;

    if (!machine.enabledMaterials.includes(req.itemType)) {
      accepted = false;
      switch (req.itemType) {
        case 'GLASS_BOTTLE':
          rejectionReason = 'Glass containers are unsupported by the optical compactor mechanism and pose safety hazards.';
          break;
        case 'E_WASTE':
          rejectionReason = 'Batteries and electronics require specialized hazardous waste drop-off and cannot be accepted.';
          break;
        case 'UNSUPPORTED_PLASTIC':
          rejectionReason = 'Non-PET plastic container identified. Only high-grade recyclable PET #1 containers are accepted.';
          break;
        default:
          rejectionReason = 'Inserted item does not match accepted recyclable material specifications.';
      }
    }

    if (!accepted) {
      const tx: TransactionRecord = {
        eventId: req.eventId,
        machineId: req.machineId,
        createdAt: isoNow,
        dateKey,
        itemType: req.itemType,
        measuredWeightGrams: req.measuredWeightGrams ?? null,
        sensorSource: req.sensorSource,
        validationStatus: 'REJECTED',
        collectionStatus: 'FAILED',
        beneficiaryModule: req.beneficiaryModule,
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        rejectionReason,
        simulationMode: true,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      txs.unshift(tx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Item rejected by material validation check.',
        rejectionReason,
        transaction: tx
      };
    }

    // Material is Accepted!
    let dispenseStatus: DispenseStatus = 'NOT_ISSUED';
    let feedGrams = 0;
    let message = '';

    if (req.beneficiaryModule === 'HUMAN_FOOD_PACK') {
      dispenseStatus = 'NOT_ISSUED';
      rejectionReason = 'Human food assistance is a planned future module requiring separate sealed-pack distribution partners.';
      message = 'Recyclable accepted, but human food assistance is currently in planned design phase.';
    } else {
      const portion = STANDARD_PORTIONS[req.beneficiaryModule] || 20;
      const currentInv = machine.foodInventoryGrams[req.beneficiaryModule] || 0;

      if (currentInv < portion) {
        dispenseStatus = 'FAILED';
        message = `Recyclable collected, but ${req.beneficiaryModule} inventory is exhausted (${currentInv}g available). Operator alerted for restock.`;
      } else {
        feedGrams = portion;
        dispenseStatus = 'SIMULATED';
        message = `Simulated dispensing of ${feedGrams}g portion completed.`;
        machine.foodInventoryGrams[req.beneficiaryModule] = currentInv - portion;
      }
    }

    // Update machine state
    machine.recyclingBinFillPercent = Math.min(100, machine.recyclingBinFillPercent + 2);
    machine.lastDispensedAt = isoNow;
    this.saveMachine(machine);

    const tx: TransactionRecord = {
      eventId: req.eventId,
      machineId: req.machineId,
      createdAt: isoNow,
      dateKey,
      itemType: req.itemType,
      measuredWeightGrams: req.measuredWeightGrams ?? (req.itemType === 'PET_BOTTLE' ? 26 : 14),
      sensorSource: req.sensorSource,
      validationStatus: 'ACCEPTED',
      collectionStatus: 'SIMULATED',
      beneficiaryModule: req.beneficiaryModule,
      dispenseStatus,
      feedGrams,
      rejectionReason: null,
      simulationMode: true,
      deviceEvidence: req.deviceEvidence,
      updatedAt: isoNow
    };

    txs.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

    return {
      eventId: req.eventId,
      accepted: true,
      collectionStatus: 'SIMULATED',
      dispenseStatus,
      feedGrams,
      message,
      rejectionReason: null,
      transaction: tx
    };
  }

  static getImpact(range = '7d'): ImpactSummary {
    const txs = this.getTransactions();
    const machine = this.getMachine();

    const now = new Date();
    let cutoff = new Date(0);
    if (range === '24h') cutoff = new Date(now.getTime() - 24 * 3600 * 1000);
    if (range === '7d') cutoff = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    if (range === '30d') cutoff = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

    const filtered = txs.filter(t => new Date(t.createdAt) >= cutoff);

    let acceptedItems = 0;
    let rejectedItems = 0;
    let totalMeasuredWeightGrams = 0;
    let simulatedCollections = 0;
    let physicalCollections = 0;
    let portionsRequested = 0;
    let simulatedPortionsDispensed = 0;
    let physicalPortionsDispensed = 0;
    let failedDispenses = 0;

    const materialBreakdown: Record<ItemType, number> = {
      PET_BOTTLE: 0,
      ALUMINIUM_CAN: 0,
      GLASS_BOTTLE: 0,
      E_WASTE: 0,
      UNSUPPORTED_PLASTIC: 0,
      UNKNOWN: 0
    };

    const dispenseBreakdown: Record<DispenseStatus, number> = {
      SIMULATED: 0,
      CONFIRMED: 0,
      FAILED: 0,
      NOT_ISSUED: 0,
      REQUESTED: 0
    };

    const beneficiaryBreakdown: Record<BeneficiaryModule, number> = {
      DOG_FEED: 0,
      CAT_FEED: 0,
      BIRD_FEED: 0,
      HUMAN_FOOD_PACK: 0
    };

    const dailyMap: Map<string, { date: string; accepted: number; rejected: number; dispensedGrams: number }> = new Map();

    for (const tx of filtered) {
      if (tx.validationStatus === 'ACCEPTED') {
        acceptedItems++;
        if (tx.measuredWeightGrams) totalMeasuredWeightGrams += tx.measuredWeightGrams;
      } else {
        rejectedItems++;
      }

      if (tx.collectionStatus === 'SIMULATED') simulatedCollections++;
      if (tx.collectionStatus === 'CONFIRMED') physicalCollections++;

      if (tx.validationStatus === 'ACCEPTED' && tx.beneficiaryModule !== 'HUMAN_FOOD_PACK') {
        portionsRequested++;
      }

      if (tx.dispenseStatus === 'SIMULATED') simulatedPortionsDispensed++;
      if (tx.dispenseStatus === 'CONFIRMED') physicalPortionsDispensed++;
      if (tx.dispenseStatus === 'FAILED') failedDispenses++;

      materialBreakdown[tx.itemType] = (materialBreakdown[tx.itemType] || 0) + 1;
      dispenseBreakdown[tx.dispenseStatus] = (dispenseBreakdown[tx.dispenseStatus] || 0) + 1;
      beneficiaryBreakdown[tx.beneficiaryModule] = (beneficiaryBreakdown[tx.beneficiaryModule] || 0) + 1;

      const d = tx.dateKey;
      const currentDay = dailyMap.get(d) || { date: d, accepted: 0, rejected: 0, dispensedGrams: 0 };
      if (tx.validationStatus === 'ACCEPTED') {
        currentDay.accepted++;
        currentDay.dispensedGrams += tx.feedGrams || 0;
      } else {
        currentDay.rejected++;
      }
      dailyMap.set(d, currentDay);
    }

    const recentDailyActivity = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const totalFoodGrams = Object.values(machine.foodInventoryGrams).reduce((s, g) => s + g, 0);

    return {
      range,
      totalEvents: filtered.length,
      acceptedItems,
      rejectedItems,
      totalMeasuredWeightGrams,
      simulatedCollections,
      physicalCollections,
      portionsRequested,
      simulatedPortionsDispensed,
      physicalPortionsDispensed,
      failedDispenses,
      currentEstimatedInventoryGrams: totalFoodGrams,
      currentBinCapacityPercent: machine.recyclingBinFillPercent,
      activeFaultsCount: machine.activeFaults.length,
      materialBreakdown,
      dispenseBreakdown,
      beneficiaryBreakdown,
      recentDailyActivity
    };
  }

  static recordMaintenance(actionType: any, note: string, resetBin = false, adjustInventory = 0): MaintenanceRecord {
    const logs = this.getMaintenanceLogs();
    const machine = this.getMachine();
    const now = new Date().toISOString();

    const record: MaintenanceRecord = {
      maintenanceId: `maint-${Date.now()}`,
      machineId: machine.machineId,
      actionType,
      createdAt: now,
      operatorNote: note,
      status: 'COMPLETED',
      simulationMode: true
    };

    logs.unshift(record);
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(logs));

    if (resetBin) {
      machine.recyclingBinFillPercent = 0;
    }
    if (actionType === 'JAM_RESOLUTION') {
      machine.activeFaults = machine.activeFaults.filter(f => !f.toLowerCase().includes('jam'));
    }
    if (actionType === 'FEED_REPLENISHMENT') {
      machine.foodInventoryGrams.DOG_FEED = 2000;
      machine.foodInventoryGrams.CAT_FEED = 1000;
      machine.foodInventoryGrams.BIRD_FEED = 800;
    }
    machine.lastMaintenanceAt = now;
    this.saveMachine(machine);

    return record;
  }

  static resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.MACHINE, JSON.stringify(INITIAL_MACHINE_STATE));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
  }
}
