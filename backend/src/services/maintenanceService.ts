import { IRepository } from '../repositories/inMemoryRepo';
import { CreateMaintenanceRequest, MaintenanceRecord } from '../types';

export class MaintenanceService {
  constructor(private repo: IRepository) {}

  async recordMaintenance(req: CreateMaintenanceRequest): Promise<MaintenanceRecord> {
    const machine = await this.repo.getMachine(req.machineId);
    if (!machine) {
      throw new Error(`Machine ${req.machineId} not found.`);
    }

    const now = new Date().toISOString();
    const maintenanceRecord: MaintenanceRecord = {
      maintenanceId: `maint-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      machineId: req.machineId,
      actionType: req.actionType,
      createdAt: now,
      operatorNote: req.operatorNote,
      status: 'COMPLETED',
      simulationMode: req.simulationMode ?? true
    };

    await this.repo.saveMaintenance(maintenanceRecord);

    // Apply adjustments to machine state
    const machineUpdates: any = {
      lastMaintenanceAt: now
    };

    if (req.resetBinFill) {
      machineUpdates.recyclingBinFillPercent = 0;
    }

    if (req.actionType === 'JAM_RESOLUTION') {
      machineUpdates.activeFaults = machine.activeFaults.filter(
        f => !f.toLowerCase().includes('jam')
      );
    }

    if (req.adjustInventoryGrams && req.actionType === 'FEED_REPLENISHMENT') {
      const inv = { ...machine.foodInventoryGrams };
      inv.DOG_FEED = Math.min(3000, inv.DOG_FEED + req.adjustInventoryGrams);
      inv.CAT_FEED = Math.min(2000, inv.CAT_FEED + Math.floor(req.adjustInventoryGrams * 0.5));
      inv.BIRD_FEED = Math.min(1000, inv.BIRD_FEED + Math.floor(req.adjustInventoryGrams * 0.3));
      machineUpdates.foodInventoryGrams = inv;
    }

    await this.repo.updateMachineState(req.machineId, machineUpdates);
    return maintenanceRecord;
  }

  async listMaintenance(machineId?: string): Promise<MaintenanceRecord[]> {
    return this.repo.listMaintenance(machineId);
  }
}
