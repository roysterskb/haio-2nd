import { Lightbulb, Thermometer, Lock, Volume2, Wifi, Loader2, Badge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useDashboardData } from '@/hooks/useDashboardData';

export function DeviceControls() {
  const { devices, updateDevice, isLoadingDevices } = useDashboardData();

  if (isLoadingDevices) {
    return (
      <Card className="min-h-[150px]">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            Quick Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-4 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-[150px]">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
          Quick Controls
          {devices.length === 0 && <Badge variant="secondary" className="ml-auto">No devices connected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        {devices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No devices available.</p>
        ) : (
          devices.map((device) => (
            <div key={device.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors gap-2 sm:gap-3 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1 sm:p-2 rounded-md bg-muted w-full sm:w-auto">
                  {device.type === 'light' && <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {device.type === 'thermostat' && <Thermometer className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {device.type === 'lock' && <Lock className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {device.type === 'speaker' && <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm leading-tight truncate">{device.name}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{device.room}</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {(device.type === 'light' || device.type === 'speaker') && device.brightness !== undefined && (
                  <div className="w-full sm:w-20">
                    <Slider
                      value={[device.brightness || 0]}
                      onValueChange={(value) => updateDevice(device.id, { brightness: value[0] })}
                      max={100}
                      step={1}
                      className="w-full"
                      disabled={typeof updateDevice !== 'function'}
                    />
                  </div>
                )}
                {device.type === 'thermostat' && device.temperature !== undefined && (
                  <div className="w-full sm:w-20 text-center">
                    <span className="text-sm font-medium">{device.temperature}°</span>
                  </div>
                )}
                
                <Switch
                  checked={device.isOn}
                  onCheckedChange={(checked) => updateDevice(device.id, { isOn: checked })}
                  disabled={typeof updateDevice !== 'function'}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}