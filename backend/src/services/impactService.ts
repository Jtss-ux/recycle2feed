import { IRepository } from '../repositories/inMemoryRepo';
import {
  ImpactSummary,
  ItemType,
  BeneficiaryModule,
  DispenseStatus
} from '../types';

export class ImpactService {
  constructor(private repo: IRepository) {}

  async getImpact(range = '7d', machineId?: string): Promise<ImpactSummary> {
    const allTxs = await this.repo.listTransactions(500);
    const machine = await this.repo.getMachine(machineId || 'machine-demo-01');

    // Filter by time range if specified
    const now = new Date();
    let cutoff = new Date(0); // all
    if (range === '24h') {
      cutoff = new Date(now.getTime() - 24 * 3600 * 1000);
    } else if (range === '7d') {
      cutoff = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    } else if (range === '30d') {
      cutoff = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    }

    const txs = allTxs.filter(tx => new Date(tx.createdAt) >= cutoff);

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

    for (const tx of txs) {
      if (tx.validationStatus === 'ACCEPTED') {
        acceptedItems++;
        if (tx.measuredWeightGrams) {
          totalMeasuredWeightGrams += tx.measuredWeightGrams;
        }
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

      // Group by date
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

    // Calculate current food inventory total
    let totalFoodGrams = 0;
    if (machine) {
      totalFoodGrams = Object.values(machine.foodInventoryGrams).reduce((sum, g) => sum + g, 0);
    }

    return {
      range,
      totalEvents: txs.length,
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
      currentBinCapacityPercent: machine ? machine.recyclingBinFillPercent : 0,
      activeFaultsCount: machine ? machine.activeFaults.length : 0,
      materialBreakdown,
      dispenseBreakdown,
      beneficiaryBreakdown,
      recentDailyActivity
    };
  }
}
