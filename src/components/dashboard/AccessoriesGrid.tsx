"use client"

import { useDashboardData } from '@/hooks/useDashboardData';
import { Device } from '@/types/dashboard';
import { Lightbulb, Thermometer, Lock, Speaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const AccessoriesGrid = () => {
  const { devices, updateDevice } = useDashboardData();

  const getIcon = (type: Device['type']) => {
    switch (type) {
      case 'light': return <Lightbulb className="h-4 w-4" />;
      case 'thermostat': return <Thermometer className="h-4 w-4" />;
      case 'lock': return <Lock className="h-4 w-4" />;
      case 'speaker': return <Speaker className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Accessories</h3>
      <div className="grid grid-cols-2 gap-2">
        {(devices || []).slice(0, 4).map((device) => (
          <div key={device.id} className="p-3 bg-card rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(device.type)}
                <span className="text-sm font-medium">{device.name}</span>
              </div>
              <Switch
                checked={device.isOn}
                onCheckedChange={(checked) => updateDevice(device.id, { isOn: checked })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};