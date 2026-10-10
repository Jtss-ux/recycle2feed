import {
  CreateTransactionRequest,
  TransactionResponse,
  TransactionRecord,
  MachineRecord,
  ImpactSummary,
  PublicConfigResponse,
  MaintenanceRecord,
  OperatingMode
} from '../types';
import { MockStorageService } from './mockStorage';

const SETTINGS_KEY = 'recycle2feed_app_settings';

export interface AppSettings {
  operatingMode: OperatingMode;
  apiBaseUrl: string;
  defaultMachineId: string;
}

export function getStoredSettings(): AppSettings {
  const envMode = (import.meta.env.VITE_APP_MODE as OperatingMode) || 'SIMULATION';
  const envBaseUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000';
  const envMachine = (import.meta.env.VITE_DEFAULT_MACHINE_ID as string) || 'machine-demo-01';

  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    const defaults: AppSettings = {
      operatingMode: envMode,
      apiBaseUrl: envBaseUrl,
      defaultMachineId: envMachine
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {
      operatingMode: envMode,
      apiBaseUrl: envBaseUrl,
      defaultMachineId: envMachine
    };
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export class ApiClient {
  static async checkBackendHealth(): Promise<{ reachable: boolean; statusText: string; details?: any }> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return { reachable: true, statusText: 'In-Browser Local Simulation Engine Active' };
    }

    try {
      const res = await fetch(`${settings.apiBaseUrl}/api/health`, { method: 'GET' });
      if (!res.ok) {
        return { reachable: false, statusText: `HTTP ${res.status}: ${res.statusText}` };
      }
      const data = await res.json();
      return { reachable: true, statusText: 'Connected to AWS API Gateway / Serverless Lambda', details: data };
    } catch (err: any) {
      return {
        reachable: false,
        statusText: `Backend Unreachable: ${err.message}. Ensure backend is running or valid API Gateway URL is set in Settings.`
      };
    }
  }

  static async getConfig(): Promise<PublicConfigResponse> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return {
        version: '1.0.0-sim',
        operatingMode: 'SIMULATION',
        acceptedMaterials: ['PET_BOTTLE', 'ALUMINIUM_CAN'],
        rejectedMaterials: ['GLASS_BOTTLE', 'E_WASTE', 'UNSUPPORTED_PLASTIC', 'UNKNOWN'],
        supportedModules: [
          {
            id: 'DOG_FEED',
            name: 'Community Dog Feeding',
            description: 'Controlled dispensing of dry kibble into a sanitized, sheltered bowl.',
            configuredPortionGrams: 20,
            isPlannedModule: false
          },
          {
            id: 'CAT_FEED',
            name: 'Community Cat Feeding',
            description: 'Controlled dispensing of dry cat food from a dedicated, isolated hopper.',
            configuredPortionGrams: 15,
            isPlannedModule: false
          },
          {
            id: 'BIRD_FEED',
            name: 'Wild Bird Grain Feed',
            description: 'Controlled distribution of approved mixed grains at an elevated feeding platform.',
            configuredPortionGrams: 10,
            isPlannedModule: false
          },
          {
            id: 'HUMAN_FOOD_PACK',
            name: 'Human Food Assistance (Planned)',
            description: 'Planned future module distributing hermetically sealed nutrient meal packs in partnership with local food banks. Not connected to animal hoppers.',
            configuredPortionGrams: 0,
            isPlannedModule: true
          }
        ],
        policy: {
          cooldownSeconds: 5,
          maxBinFillPercent: 95,
          minFoodInventoryGrams: 20,
          standardPortions: {
            DOG_FEED: 20,
            CAT_FEED: 15,
            BIRD_FEED: 10,
            HUMAN_FOOD_PACK: 0
          }
        }
      };
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/config`);
    if (!res.ok) throw new Error(`Failed to fetch config from AWS API: HTTP ${res.status}`);
    return res.json();
  }

  static async createTransaction(req: CreateTransactionRequest): Promise<TransactionResponse> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return MockStorageService.processSimulatedTransaction(req);
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `AWS API Error HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }

  static async listTransactions(limit = 50): Promise<TransactionRecord[]> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return MockStorageService.getTransactions().slice(0, limit);
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/transactions?limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to list transactions: HTTP ${res.status}`);
    const data = await res.json();
    return data.transactions || [];
  }

  static async getImpact(range = '7d'): Promise<ImpactSummary> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return MockStorageService.getImpact(range);
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/impact?range=${range}`);
    if (!res.ok) throw new Error(`Failed to fetch impact: HTTP ${res.status}`);
    return res.json();
  }

  static async getMachine(machineId?: string): Promise<MachineRecord> {
    const settings = getStoredSettings();
    const targetId = machineId || settings.defaultMachineId;

    if (settings.operatingMode === 'SIMULATION') {
      return MockStorageService.getMachine();
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/machines/${targetId}`);
    if (!res.ok) throw new Error(`Failed to fetch machine ${targetId}: HTTP ${res.status}`);
    return res.json();
  }

  static async recordMaintenance(
    actionType: any,
    operatorNote: string,
    resetBin = false,
    adjustInventory = 0
  ): Promise<MaintenanceRecord> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return MockStorageService.recordMaintenance(actionType, operatorNote, resetBin, adjustInventory);
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machineId: settings.defaultMachineId,
        actionType,
        operatorNote,
        resetBinFill: resetBin,
        adjustInventoryGrams: adjustInventory,
        simulationMode: false
      })
    });

    if (!res.ok) throw new Error(`Failed to record maintenance: HTTP ${res.status}`);
    return res.json();
  }

  static async listMaintenance(): Promise<MaintenanceRecord[]> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      return MockStorageService.getMaintenanceLogs();
    }

    const res = await fetch(`${settings.apiBaseUrl}/api/maintenance`);
    if (!res.ok) throw new Error(`Failed to list maintenance: HTTP ${res.status}`);
    const data = await res.json();
    return data.logs || [];
  }

  static async resetDemo(): Promise<void> {
    const settings = getStoredSettings();
    if (settings.operatingMode === 'SIMULATION') {
      MockStorageService.resetAll();
      return;
    }

    await fetch(`${settings.apiBaseUrl}/api/reset`, { method: 'POST' });
  }
}
