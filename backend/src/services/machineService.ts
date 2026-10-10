import { IRepository } from '../repositories/inMemoryRepo';
import { MachineRecord, MachineHeartbeatRequest } from '../types';

export class MachineService {
  constructor(private repo: IRepository) {}

  async getMachine(machineId: string): Promise<MachineRecord | null> {
    return this.repo.getMachine(machineId);
  }

  async processHeartbeat(machineId: string, req: MachineHeartbeatRequest): Promise<MachineRecord> {
    const existing = await this.repo.getMachine(machineId);
    if (!existing) {
      throw new Error(`Machine ${machineId} not registered.`);
    }

    const updates: Partial<MachineRecord> = {
      lastHeartbeatAt: new Date().toISOString()
    };

    if (req.operatingMode) updates.operatingMode = req.operatingMode;
    if (req.onlineStatus) updates.onlineStatus = req.onlineStatus;
    if (req.recyclingBinFillPercent !== undefined) {
      updates.recyclingBinFillPercent = req.recyclingBinFillPercent;
    }
    if (req.foodInventoryGrams) {
      updates.foodInventoryGrams = {
        ...existing.foodInventoryGrams,
        ...req.foodInventoryGrams
      };
    }
    if (req.activeFaults) {
      updates.activeFaults = req.activeFaults;
    }

    return this.repo.updateMachineState(machineId, updates);
  }
}
