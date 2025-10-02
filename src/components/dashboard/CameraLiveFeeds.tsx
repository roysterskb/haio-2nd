"use client"

import { Camera, Activity, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CameraLiveFeeds = ({ className = '' }: { className?: string }) => {
  const feeds = [
    { id: 'front', name: 'Front Door', status: 'live' as const },
    { id: 'back', name: 'Back Yard', status: 'live' as const },
    { id: 'garage', name: 'Garage', status: 'offline' as const },
  ];

  return (
    <div className={`bg-card rounded-lg p-4 border h-full ${className} flex flex-col`}>
      <div className="flex items-center gap-2 mb-3">
        <Camera className="h-4 w-4" />
        <h3 className="text-sm font-medium">Live Feeds</h3>
      </div>
      <div className="space-y-3 flex-1">
        {feeds.map((feed) => (
          <div key={feed.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${feed.status === 'live' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">{feed.name}</span>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${feed.status === 'live' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {feed.status}
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-2 w-full">
        <Video className="mr-2 h-3 w-3" />
        View All
      </Button>
    </div>
  );
};