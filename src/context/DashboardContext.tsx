"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { generateMockData } from '@/lib/mockData'
import type { DashboardData, Device } from '@/types/dashboard'
import type { DashboardProviderValue } from './types' // Wait, no need, inline

type DashboardProviderValue = DashboardData & {
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>;
  isLoadingWeather: boolean;
  isLoadingDevices: boolean;
  // remove isConnectedToHA
}

const DashboardContext = createContext<DashboardProviderValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(() => ({
    devices: [],
    recentActivity: generateMockData().recentActivity, // Keep mock for now
    energyData: generateMockData().energyData,
    systemStatus: generateMockData().systemStatus,
    weather: { temperature: 0, condition: 'Loading...', humidity: 0, windSpeed: 0, visibility: 0, pressure: 0 } // Add default weather
  }));
  const [weather, setWeather] = useState(data.weather);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  useEffect(() => {
    const initData = async () => {
      // Fetch weather
      const fetchWeather = async () => {
        try {
          setIsLoadingWeather(true);
          const response = await fetch('/api/weather');
          if (response.ok) {
            const realWeather = await response.json();
            setWeather(realWeather);
            setData(prev => ({ ...prev, weather: realWeather }));
          }
        } catch (error) {
          console.error('Weather fetch error:', error);
        } finally {
          setIsLoadingWeather(false);
        }
      };
      fetchWeather();

      const interval = setInterval(fetchWeather, 3 * 60 * 1000);
      return () => clearInterval(interval);
    };

    // always use mock devices
    setIsLoadingDevices(true);
    const mockData = generateMockData();
    setData(prev => ({ ...prev, devices: mockData.devices }));
    setIsLoadingDevices(false);

    initData(); // only weather

    return () => {
      // no pollInterval
    };
  }, []);

  const updateDevice = async (id: string, updates: Partial<Device>) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      devices: prev.devices.map(device => 
        device.id === id ? { ...device, ...updates } : device
      )
    }));

    // just local
    console.log('Device updated locally');
  };

  const value = {
    ...data,
    weather,
    updateDevice,
    isLoadingWeather,
    isLoadingDevices,
    // remove isConnectedToHA
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}