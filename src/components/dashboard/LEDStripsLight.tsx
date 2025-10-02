"use client"

import { Lamp, Palette, Slider as SliderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export const LEDStripsLight = ({ className = 'h-full' }: { className?: string }) => {
  const [isOn, setIsOn] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [color, setColor] = useState('#3b82f6');

  return (
    <div className={`bg-card rounded-lg p-4 border flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Lamp className="h-5 w-5" />
        <h3 className="text-sm font-medium">LED Strips</h3>
      </div>
      
      <Button 
        variant={isOn ? 'default' : 'outline'} 
        className="w-full mb-4"
        onClick={() => setIsOn(!isOn)}
      >
        {isOn ? 'Turn Off' : 'Turn On'}
      </Button>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Brightness</label>
          <Slider 
            value={[brightness]} 
            onValueChange={(value) => setBrightness(value[0])} 
            max={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>0%</span>
            <span>{brightness}%</span>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Color</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 h-8 border rounded"
            />
            <Button size="sm" variant="outline">Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );
};