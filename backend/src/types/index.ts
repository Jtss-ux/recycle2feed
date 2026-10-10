export type ItemType =
  | 'PET_BOTTLE'
  | 'ALUMINIUM_CAN'
  | 'GLASS_BOTTLE'
  | 'E_WASTE'
  | 'UNSUPPORTED_PLASTIC'
  | 'UNKNOWN';

export type BeneficiaryModule =
  | 'DOG_FEED'
  | 'CAT_FEED'
  | 'BIRD_FEED'
  | 'HUMAN_FOOD_PACK';

export type SensorSource =
  | 'SIMULATOR'
  | 'ESP32_OPTICAL'
  | 'ESP32_INDUCTIVE'
  | 'HARDWARE_UNKNOWN';

export type ValidationStatus = 'ACCEPTED' | 'REJECTED';

export type CollectionStatus = 'SIMULATED' | 'CONFIRMED' | 'FAILED' | 'UNVERIFIED';

export type DispenseStatus =
  | 'SIMULATED'
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'FAILED'
  | 'NOT_ISSUED';

export type OperatingMode = 'SIMULATION' | 'AWS';

export type MachineOnlineStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE_REQUIRED';

export type MaintenanceActionType =
  | 'BIN_EMPTYING'
  | 'FEED_REPLENISHMENT'
  | 'CLEANING'
  | 'SENSOR_INSPECTION'
  | 'DISPENSER_INSPECTION'
  | 'JAM_RESOLUTION'
  | 'GENERAL_MAINTENANCE';

export interface DeviceEvidence {
  opticalDetected?: boolean;
  inductiveDetected?: boolean;
  loadCellGrams?: number | null;
  hopperLimitSwitchTriggered?: boolean;
  notes?: string;
}

export interface TransactionRecord {
  eventId: string;
  machineId: string;
  createdAt: string; // ISO 8601
  dateKey: string;   // YYYY-MM-DD
  itemType: ItemType;
  measuredWeightGrams: number | null;
  sensorSource: SensorSource;
  validationStatus: ValidationStatus;
  collectionStatus: CollectionStatus;
  beneficiaryModule: BeneficiaryModule;
  dispenseStatus: DispenseStatus;
  feedGrams: number;
  rejectionReason: string | null;
  simulationMode: boolean;
  deviceEvidence?: DeviceEvidence;
  updatedAt: string; // ISO 8601
}

export interface MachineRecord {
  machineId: string;
  displayName: string;
  locationLabel: string;
  operatingMode: OperatingMode;
  onlineStatus: MachineOnlineStatus;
  lastHeartbeatAt: string;
  enabledMaterials: ItemType[];
  enabledBeneficiaryModules: BeneficiaryModule[];
  recyclingBinFillPercent: number; // 0 - 100
  foodInventoryGrams: Record<BeneficiaryModule, number>;
  activeFaults: string[];
  lastMaintenanceAt: string;
  cooldownSeconds: number;
  lastDispensedAt: string | null;
}

export interface MaintenanceRecord {
  maintenanceId: string;
  machineId: string;
  actionType: MaintenanceActionType;
  createdAt: string;
  operatorNote: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  simulationMode: boolean;
}

export interface CreateTransactionRequest {
  eventId: string;
  machineId: string;
  itemType: ItemType;
  beneficiaryModule: BeneficiaryModule;
  sensorSource: SensorSource;
  measuredWeightGrams?: number | null;
  simulationMode: boolean;
  deviceEvidence?: DeviceEvidence;
}

export interface TransactionResponse {
  eventId: string;
  accepted: boolean;
  collectionStatus: CollectionStatus;
  dispenseStatus: DispenseStatus;
  feedGrams: number;
  message: string;
  rejectionReason: string | null;
  transaction: TransactionRecord;
}

export interface MachineHeartbeatRequest {
  operatingMode?: OperatingMode;
  onlineStatus?: MachineOnlineStatus;
  recyclingBinFillPercent?: number;
  foodInventoryGrams?: Record<BeneficiaryModule, number>;
  activeFaults?: string[];
  sensorEvidence?: DeviceEvidence;
}

export interface CreateMaintenanceRequest {
  machineId: string;
  actionType: MaintenanceActionType;
  operatorNote: string;
  simulationMode?: boolean;
  adjustInventoryGrams?: number;
  resetBinFill?: boolean;
}

export interface ImpactSummary {
  range: string;
  totalEvents: number;
  acceptedItems: number;
  rejectedItems: number;
  totalMeasuredWeightGrams: number;
  simulatedCollections: number;
  physicalCollections: number;
  portionsRequested: number;
  simulatedPortionsDispensed: number;
  physicalPortionsDispensed: number;
  failedDispenses: number;
  currentEstimatedInventoryGrams: number;
  currentBinCapacityPercent: number;
  activeFaultsCount: number;
  materialBreakdown: Record<ItemType, number>;
  dispenseBreakdown: Record<DispenseStatus, number>;
  beneficiaryBreakdown: Record<BeneficiaryModule, number>;
  recentDailyActivity: Array<{
    date: string;
    accepted: number;
    rejected: number;
    dispensedGrams: number;
  }>;
}

export interface PublicConfigResponse {
  version: string;
  operatingMode: OperatingMode;
  acceptedMaterials: ItemType[];
  rejectedMaterials: ItemType[];
  supportedModules: Array<{
    id: BeneficiaryModule;
    name: string;
    description: string;
    configuredPortionGrams: number;
    isPlannedModule: boolean;
  }>;
  policy: {
    cooldownSeconds: number;
    maxBinFillPercent: number;
    minFoodInventoryGrams: number;
    standardPortions: Record<BeneficiaryModule, number>;
  };
}
