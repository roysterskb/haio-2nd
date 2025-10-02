"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export const MusicPlayer = ({ className = '' }: { className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(30);

  return (
    <div className={`bg-card rounded-lg p-4 border ${className}`}>
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-2xl font-bold">♪</span>
          </div>
          <h4 className="text-sm font-medium">Now Playing</h4>
          <p className="text-xs text-muted-foreground">Track Title - Artist</p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            className="h-12 w-12 bg-primary"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Slider 
            value={[progress]} 
            onValueChange={(values) => setProgress(values[0])} 
            max={100}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>0:30</span>
            <span>3:45</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Volume2 className="h-4 w-4" />
          <Slider 
            value={[volume]} 
            onValueChange={(v) => setVolume(v[0])} 
            max={100} 
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};