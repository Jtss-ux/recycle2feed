import { PublicConfigResponse } from '../types';

export function getPublicConfig(): PublicConfigResponse {
  return {
    version: '1.0.0',
    operatingMode: (process.env.APP_MODE as any) || 'SIMULATION',
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
