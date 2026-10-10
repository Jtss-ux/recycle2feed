import {
  CreateTransactionRequest,
  MachineHeartbeatRequest,
  CreateMaintenanceRequest,
  ItemType,
  BeneficiaryModule,
  SensorSource,
  MaintenanceActionType
} from '../types';

const VALID_ITEM_TYPES: ItemType[] = [
  'PET_BOTTLE',
  'ALUMINIUM_CAN',
  'GLASS_BOTTLE',
  'E_WASTE',
  'UNSUPPORTED_PLASTIC',
  'UNKNOWN'
];

const VALID_MODULES: BeneficiaryModule[] = [
  'DOG_FEED',
  'CAT_FEED',
  'BIRD_FEED',
  'HUMAN_FOOD_PACK'
];

const VALID_SENSOR_SOURCES: SensorSource[] = [
  'SIMULATOR',
  'ESP32_OPTICAL',
  'ESP32_INDUCTIVE',
  'HARDWARE_UNKNOWN'
];

const VALID_MAINTENANCE_ACTIONS: MaintenanceActionType[] = [
  'BIN_EMPTYING',
  'FEED_REPLENISHMENT',
  'CLEANING',
  'SENSOR_INSPECTION',
  'DISPENSER_INSPECTION',
  'JAM_RESOLUTION',
  'GENERAL_MAINTENANCE'
];

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(`Validation failed: ${errors.join(', ')}`);
    this.name = 'ValidationError';
  }
}

export function validateTransactionRequest(payload: any): CreateTransactionRequest {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    throw new ValidationError(['Request payload must be a JSON object']);
  }

  if (typeof payload.eventId !== 'string' || payload.eventId.trim().length === 0) {
    errors.push('eventId is required and must be a non-empty string');
  }

  if (typeof payload.machineId !== 'string' || payload.machineId.trim().length === 0) {
    errors.push('machineId is required and must be a non-empty string');
  }

  if (!VALID_ITEM_TYPES.includes(payload.itemType)) {
    errors.push(`itemType must be one of: ${VALID_ITEM_TYPES.join(', ')}`);
  }

  if (!VALID_MODULES.includes(payload.beneficiaryModule)) {
    errors.push(`beneficiaryModule must be one of: ${VALID_MODULES.join(', ')}`);
  }

  if (!VALID_SENSOR_SOURCES.includes(payload.sensorSource)) {
    errors.push(`sensorSource must be one of: ${VALID_SENSOR_SOURCES.join(', ')}`);
  }

  if (typeof payload.simulationMode !== 'boolean') {
    errors.push('simulationMode is required and must be a boolean');
  }

  if (payload.measuredWeightGrams !== undefined && payload.measuredWeightGrams !== null) {
    if (typeof payload.measuredWeightGrams !== 'number' || payload.measuredWeightGrams < 0) {
      errors.push('measuredWeightGrams must be a positive number or null');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return {
    eventId: payload.eventId.trim(),
    machineId: payload.machineId.trim(),
    itemType: payload.itemType,
    beneficiaryModule: payload.beneficiaryModule,
    sensorSource: payload.sensorSource,
    measuredWeightGrams: payload.measuredWeightGrams ?? null,
    simulationMode: payload.simulationMode,
    deviceEvidence: payload.deviceEvidence
  };
}

export function validateHeartbeatRequest(payload: any): MachineHeartbeatRequest {
  const errors: string[] = [];
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError(['Payload must be an object']);
  }

  if (payload.recyclingBinFillPercent !== undefined) {
    if (
      typeof payload.recyclingBinFillPercent !== 'number' ||
      payload.recyclingBinFillPercent < 0 ||
      payload.recyclingBinFillPercent > 100
    ) {
      errors.push('recyclingBinFillPercent must be a number between 0 and 100');
    }
  }

  if (payload.foodInventoryGrams && typeof payload.foodInventoryGrams !== 'object') {
    errors.push('foodInventoryGrams must be an object mapping module to grams');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return payload as MachineHeartbeatRequest;
}

export function validateMaintenanceRequest(payload: any): CreateMaintenanceRequest {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    throw new ValidationError(['Payload must be an object']);
  }

  if (typeof payload.machineId !== 'string' || payload.machineId.trim().length === 0) {
    errors.push('machineId is required');
  }

  if (!VALID_MAINTENANCE_ACTIONS.includes(payload.actionType)) {
    errors.push(`actionType must be one of: ${VALID_MAINTENANCE_ACTIONS.join(', ')}`);
  }

  if (typeof payload.operatorNote !== 'string' || payload.operatorNote.trim().length === 0) {
    errors.push('operatorNote is required');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return {
    machineId: payload.machineId.trim(),
    actionType: payload.actionType,
    operatorNote: payload.operatorNote.trim(),
    simulationMode: payload.simulationMode ?? true,
    adjustInventoryGrams: payload.adjustInventoryGrams,
    resetBinFill: payload.resetBinFill
  };
}
