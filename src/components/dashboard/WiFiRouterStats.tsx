"use client"

import { Wifi, Signal, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WiFiRouterStats = () => {
  const stats = {
    speed: '245 Mbps',
    signal: 'Strong',
    devices: 23,
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Router Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Speed</span>
          <span className="text-lg font-bold">{stats.speed}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Signal</span>
          <div className="flex items-center gap-2">
            <Signal className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold">{stats.signal}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Devices</span>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-lg font-bold">{stats.devices}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};