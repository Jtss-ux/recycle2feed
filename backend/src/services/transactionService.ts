import { IRepository } from '../repositories/inMemoryRepo';
import {
  CreateTransactionRequest,
  TransactionResponse,
  TransactionRecord,
  ItemType,
  BeneficiaryModule,
  ValidationStatus,
  CollectionStatus,
  DispenseStatus
} from '../types';

export const STANDARD_PORTIONS_GRAMS: Record<BeneficiaryModule, number> = {
  DOG_FEED: 20,
  CAT_FEED: 15,
  BIRD_FEED: 10,
  HUMAN_FOOD_PACK: 0 // Planned module
};

export class TransactionService {
  constructor(private repo: IRepository) {}

  async processTransaction(req: CreateTransactionRequest): Promise<TransactionResponse> {
    // 1. Idempotency Check: if eventId already exists, return existing record without double-dispensing
    const existing = await this.repo.getTransaction(req.eventId);
    if (existing) {
      return {
        eventId: existing.eventId,
        accepted: existing.validationStatus === 'ACCEPTED',
        collectionStatus: existing.collectionStatus,
        dispenseStatus: existing.dispenseStatus,
        feedGrams: existing.feedGrams,
        message: 'Duplicate event received. Returned existing transaction record without duplicate reward.',
        rejectionReason: existing.rejectionReason,
        transaction: existing
      };
    }

    // 2. Fetch machine state
    const machine = await this.repo.getMachine(req.machineId);
    if (!machine) {
      throw new Error(`Machine ${req.machineId} not registered or found.`);
    }

    const now = new Date();
    const isoNow = now.toISOString();
    const dateKey = isoNow.split('T')[0];

    // Check machine operational state
    if (machine.onlineStatus === 'OFFLINE') {
      const rejectedTx: TransactionRecord = {
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
        rejectionReason: 'Machine is currently OFFLINE or under service. Intake locked.',
        simulationMode: req.simulationMode,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      await this.repo.saveTransaction(rejectedTx);
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Machine is offline.',
        rejectionReason: rejectedTx.rejectionReason,
        transaction: rejectedTx
      };
    }

    // Check bin fill capacity
    if (machine.recyclingBinFillPercent >= 95) {
      const rejectedTx: TransactionRecord = {
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
        rejectionReason: 'Recycling bin compartment is at maximum capacity (>=95%). Emptying required.',
        simulationMode: req.simulationMode,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      await this.repo.saveTransaction(rejectedTx);
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Recycling collection compartment is full.',
        rejectionReason: rejectedTx.rejectionReason,
        transaction: rejectedTx
      };
    }

    // Check for active jamming faults
    if (machine.activeFaults.some(f => f.toLowerCase().includes('jam'))) {
      const rejectedTx: TransactionRecord = {
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
        rejectionReason: 'Dispensing actuator reported a mechanical jam fault. Safety lockout active.',
        simulationMode: req.simulationMode,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      await this.repo.saveTransaction(rejectedTx);
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Actuator jammed. Dispensing locked for safety.',
        rejectionReason: rejectedTx.rejectionReason,
        transaction: rejectedTx
      };
    }

    // 3. Material Eligibility Check
    let validationStatus: ValidationStatus = 'ACCEPTED';
    let rejectionReason: string | null = null;

    if (!machine.enabledMaterials.includes(req.itemType)) {
      validationStatus = 'REJECTED';
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

    if (validationStatus === 'REJECTED') {
      const rejectedTx: TransactionRecord = {
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
        simulationMode: req.simulationMode,
        deviceEvidence: req.deviceEvidence,
        updatedAt: isoNow
      };
      await this.repo.saveTransaction(rejectedTx);
      return {
        eventId: req.eventId,
        accepted: false,
        collectionStatus: 'FAILED',
        dispenseStatus: 'NOT_ISSUED',
        feedGrams: 0,
        message: 'Item rejected by material validation check.',
        rejectionReason,
        transaction: rejectedTx
      };
    }

    // 4. Item is Accepted! Determine Collection Outcome
    const collectionStatus: CollectionStatus = req.simulationMode ? 'SIMULATED' : 'CONFIRMED';

    // 5. Reward & Dispensing Policy
    let dispenseStatus: DispenseStatus = 'NOT_ISSUED';
    let feedGrams = 0;
    let dispenseMessage = '';

    if (req.beneficiaryModule === 'HUMAN_FOOD_PACK') {
      dispenseStatus = 'NOT_ISSUED';
      rejectionReason = 'Human food assistance is a planned future module requiring separate sealed-pack distribution partners.';
      dispenseMessage = 'Item collected, but human food assistance is currently in planned design phase.';
    } else {
      const requiredPortion = STANDARD_PORTIONS_GRAMS[req.beneficiaryModule] || 20;
      const currentInventory = machine.foodInventoryGrams[req.beneficiaryModule] || 0;

      if (currentInventory < requiredPortion) {
        dispenseStatus = 'FAILED';
        dispenseMessage = `Recyclable collected, but ${req.beneficiaryModule} inventory is exhausted (${currentInventory}g available). Operator alerted for restock.`;
      } else {
        feedGrams = requiredPortion;
        dispenseStatus = req.simulationMode ? 'SIMULATED' : 'CONFIRMED';
        dispenseMessage = req.simulationMode
          ? `Simulated dispensing of ${feedGrams}g portion completed.`
          : `Dispensed ${feedGrams}g portion confirmed by actuator telemetry.`;

        // Decrement food inventory on success
        machine.foodInventoryGrams[req.beneficiaryModule] = currentInventory - requiredPortion;
      }
    }

    // Increment recycling bin capacity (simulated +2% fill per container)
    machine.recyclingBinFillPercent = Math.min(100, machine.recyclingBinFillPercent + 2);
    machine.lastDispensedAt = isoNow;
    await this.repo.saveMachine(machine);

    // 6. Persist Transaction
    const txRecord: TransactionRecord = {
      eventId: req.eventId,
      machineId: req.machineId,
      createdAt: isoNow,
      dateKey,
      itemType: req.itemType,
      measuredWeightGrams: req.measuredWeightGrams ?? (req.itemType === 'PET_BOTTLE' ? 25 : 14),
      sensorSource: req.sensorSource,
      validationStatus: 'ACCEPTED',
      collectionStatus,
      beneficiaryModule: req.beneficiaryModule,
      dispenseStatus,
      feedGrams,
      rejectionReason: null,
      simulationMode: req.simulationMode,
      deviceEvidence: req.deviceEvidence,
      updatedAt: isoNow
    };

    await this.repo.saveTransaction(txRecord);

    return {
      eventId: req.eventId,
      accepted: true,
      collectionStatus,
      dispenseStatus,
      feedGrams,
      message: dispenseMessage,
      rejectionReason: null,
      transaction: txRecord
    };
  }
}
