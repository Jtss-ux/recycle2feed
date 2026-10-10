import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  MachineRecord,
  OperatingMode,
  PublicConfigResponse
} from '../types';
import {
  ApiClient,
  AppSettings,
  getStoredSettings,
  saveStoredSettings
} from '../services/api';

interface AppContextType {
  settings: AppSettings;
  machine: MachineRecord | null;
  config: PublicConfigResponse | null;
  backendHealth: { reachable: boolean; statusText: string };
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetDemoData: () => Promise<void>;
  setMachineState: React.Dispatch<React.SetStateAction<MachineRecord | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [machine, setMachine] = useState<MachineRecord | null>(null);
  const [config, setConfig] = useState<PublicConfigResponse | null>(null);
  const [backendHealth, setBackendHealth] = useState<{ reachable: boolean; statusText: string }>({
    reachable: true,
    statusText: 'Checking...'
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const health = await ApiClient.checkBackendHealth();
      setBackendHealth(health);

      const cfg = await ApiClient.getConfig();
      setConfig(cfg);

      const mach = await ApiClient.getMachine(settings.defaultMachineId);
      setMachine(mach);
    } catch (err: any) {
      console.error('Failed to refresh data:', err);
      setBackendHealth({
        reachable: false,
        statusText: `Connection failed: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [settings.defaultMachineId, settings.operatingMode, settings.apiBaseUrl]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const resetDemoData = async () => {
    await ApiClient.resetDemo();
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        machine,
        config,
        backendHealth,
        isLoading,
        refreshData,
        updateSettings,
        resetDemoData,
        setMachineState: setMachine
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
