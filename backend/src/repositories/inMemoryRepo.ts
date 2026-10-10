import {
  TransactionRecord,
  MachineRecord,
  MaintenanceRecord,
  BeneficiaryModule,
  ItemType
} from '../types';

export interface IRepository {
  getTransaction(eventId: string): Promise<TransactionRecord | null>;
  saveTransaction(tx: TransactionRecord): Promise<void>;
  listTransactions(limit?: number): Promise<TransactionRecord[]>;
  getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionRecord[]>;
  getMachine(machineId: string): Promise<MachineRecord | null>;
  saveMachine(machine: MachineRecord): Promise<void>;
  updateMachineState(machineId: string, partial: Partial<MachineRecord>): Promise<MachineRecord>;
  saveMaintenance(record: MaintenanceRecord): Promise<void>;
  listMaintenance(machineId?: string): Promise<MaintenanceRecord[]>;
  resetDemoData(): Promise<void>;
}

export class InMemoryRepository implements IRepository {
  private transactions: Map<string, TransactionRecord> = new Map();
  private machines: Map<string, MachineRecord> = new Map();
  private maintenanceLogs: MaintenanceRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  public seedDefaults() {
    this.transactions.clear();
    this.machines.clear();
    this.maintenanceLogs = [];

    // Seed default machine
    const defaultMachine: MachineRecord = {
      machineId: 'machine-demo-01',
      displayName: 'DTU Campus North Gate Station (Kiosk 01)',
      locationLabel: 'Delhi Technological University, Shahbad Daulatpur, Delhi',
      operatingMode: 'SIMULATION',
      onlineStatus: 'ONLINE',
      lastHeartbeatAt: new Date().toISOString(),
      enabledMaterials: ['PET_BOTTLE', 'ALUMINIUM_CAN'],
      enabledBeneficiaryModules: ['DOG_FEED', 'CAT_FEED', 'BIRD_FEED'],
      recyclingBinFillPercent: 24, // 24% full
      foodInventoryGrams: {
        DOG_FEED: 1850,       // 1.85 kg remaining
        CAT_FEED: 900,        // 0.9 kg remaining
        BIRD_FEED: 600,       // 0.6 kg remaining
        HUMAN_FOOD_PACK: 0    // Planned module (not active)
      },
      activeFaults: [],
      lastMaintenanceAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      cooldownSeconds: 5,
      lastDispensedAt: null
    };

    this.machines.set(defaultMachine.machineId, defaultMachine);

    // Seed realistic sample transactions over past 3 days for analytics demonstration
    const now = Date.now();
    const seedTxs: TransactionRecord[] = [
      {
        eventId: 'seed-tx-001',
        machineId: 'machine-demo-01',
        createdAt: new Date(now - 72 * 3600 * 1000).toISOString(),
        dateKey: new Date(now - 72 * 3600 * 1000).toISOString().split('T')[0],
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
        updatedAt: new Date(now - 72 * 3600 * 1000).toISOString()
      },
      {
        eventId: 'seed-tx-002',
        machineId: 'machine-demo-01',
        createdAt: new Date(now - 48 * 3600 * 1000).toISOString(),
        dateKey: new Date(now - 48 * 3600 * 1000).toISOString().split('T')[0],
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
        updatedAt: new Date(now - 48 * 3600 * 1000).toISOString()
      },
      {
        eventId: 'seed-tx-003',
        machineId: 'machine-demo-01',
        createdAt: new Date(now - 24 * 3600 * 1000).toISOString(),
        dateKey: new Date(now - 24 * 3600 * 1000).toISOString().split('T')[0],
        itemType: 'GLASS_BOTTLE',
        measuredWeightGrams: 190,
        sensorSource: 'SIMULATOR',
        validationStatus: 'REJECTED',
        collectionStatus: 'FAILED',
        beneficiaryModule: 'DOG_FEED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        rejectionReason: 'Glass containers are unsupported by the optical shredder/compactor mechanism.',
        simulationMode: true,
        updatedAt: new Date(now - 24 * 3600 * 1000).toISOString()
      },
      {
        eventId: 'seed-tx-004',
        machineId: 'machine-demo-01',
        createdAt: new Date(now - 12 * 3600 * 1000).toISOString(),
        dateKey: new Date(now - 12 * 3600 * 1000).toISOString().split('T')[0],
        itemType: 'PET_BOTTLE',
        measuredWeightGrams: 32,
        sensorSource: 'SIMULATOR',
        validationStatus: 'ACCEPTED',
        collectionStatus: 'SIMULATED',
        beneficiaryModule: 'BIRD_FEED',
        dispenseStatus: 'SIMULATED',
        feedGrams: 10,
        rejectionReason: null,
        simulationMode: true,
        updatedAt: new Date(now - 12 * 3600 * 1000).toISOString()
      }
    ];

    seedTxs.forEach(tx => this.transactions.set(tx.eventId, tx));

    // Seed maintenance record
    this.maintenanceLogs.push({
      maintenanceId: 'maint-seed-01',
      machineId: 'machine-demo-01',
      actionType: 'CLEANING',
      createdAt: new Date(now - 24 * 3600 * 1000).toISOString(),
      operatorNote: 'Intake slot sanitized, food chute debris cleared, sensors calibrated.',
      status: 'COMPLETED',
      simulationMode: true
    });
  }

  async getTransaction(eventId: string): Promise<TransactionRecord | null> {
    return this.transactions.get(eventId) || null;
  }

  async saveTransaction(tx: TransactionRecord): Promise<void> {
    // Idempotency check: in DynamoDB this is done with attribute_not_exists(eventId)
    if (this.transactions.has(tx.eventId)) {
      throw new Error(`Transaction with eventId ${tx.eventId} already exists (Idempotency violation)`);
    }
    this.transactions.set(tx.eventId, tx);
  }

  async listTransactions(limit = 50): Promise<TransactionRecord[]> {
    const list = Array.from(this.transactions.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list.slice(0, limit);
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionRecord[]> {
    const list = Array.from(this.transactions.values());
    return list.filter(tx => tx.dateKey >= startDate && tx.dateKey <= endDate);
  }

  async getMachine(machineId: string): Promise<MachineRecord | null> {
    return this.machines.get(machineId) || null;
  }

  async saveMachine(machine: MachineRecord): Promise<void> {
    this.machines.set(machine.machineId, machine);
  }

  async updateMachineState(machineId: string, partial: Partial<MachineRecord>): Promise<MachineRecord> {
    let machine = this.machines.get(machineId);
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    machine = { ...machine, ...partial };
    this.machines.set(machineId, machine);
    return machine;
  }

  async saveMaintenance(record: MaintenanceRecord): Promise<void> {
    this.maintenanceLogs.unshift(record);
  }

  async listMaintenance(machineId?: string): Promise<MaintenanceRecord[]> {
    if (machineId) {
      return this.maintenanceLogs.filter(m => m.machineId === machineId);
    }
    return this.maintenanceLogs;
  }

  async resetDemoData(): Promise<void> {
    this.seedDefaults();
  }
}
