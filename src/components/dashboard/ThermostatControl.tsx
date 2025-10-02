"use client"

import { Thermometer, Sun, Snowflake, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export const ThermostatControl = ({ className = 'h-full' }: { className?: string }) => {
  const [temperature, setTemperature] = useState(72);
  const [mode, setMode] = useState<'cool' | 'heat' | 'auto'>('auto');

  const getIcon = (mode: typeof mode) => {
    switch (mode) {
      case 'cool': return <Snowflake className="h-4 w-4 text-blue-500" />;
      case 'heat': return <Sun className="h-4 w-4 text-orange-500" />;
      default: return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  return (
    <div className={`bg-card rounded-lg p-4 border flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="h-5 w-5" />
        <h3 className="text-sm font-medium">Thermostat</h3>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-3xl font-bold">{temperature}°</div>
        <div className="text-xs text-muted-foreground">Current Temperature</div>
      </div>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Set Temperature</label>
          <Slider 
            value={[temperature]} 
            onValueChange={(value) => setTemperature(value[0])} 
            min={60} 
            max={85}
            step={1}
            className="w-full"
          />
          <Button variant="outline" size="sm" className="w-full mt-2">
            {getIcon(mode)}
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" size="sm" onClick={() => setTemperature(t => Math.max(60, t - 1))}>-</Button>
          <span className="text-center text-sm font-medium">{temperature}°</span>
          <Button variant="ghost" size="sm" onClick={() => setTemperature(t => Math.min(85, t + 1))}>+</Button>
        </div>
      </div>
    </div>
  );
};