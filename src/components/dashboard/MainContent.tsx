"use client"

import { Cloud, Calendar, Menu, Settings, Volume2, Music, Play, Pause, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Slider 
} from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/hooks/useDashboardData';
import { JavisAssistant } from './JavisAssistant';
import { LeftColumn } from './LeftColumn';
import { RightColumn } from './RightColumn';
import { useState, useEffect } from 'react';
import { toast } from "sonner";

interface MainContentProps {
  setSidebarOpen: (open: boolean) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ setSidebarOpen }) => {
  const router = useRouter();
  const { weather, isLoadingWeather } = useDashboardData();

  const displayTemp = isLoadingWeather ? 0 : (weather?.temperature || 72);
  const displayCondition = isLoadingWeather ? 'Loading...' : (weather?.condition || 'Partly Cloudy');
  const unit = '°'; // Can enhance to show °F/°C based on settings if needed

  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('Living Room Speaker');
  const [selectedSource, setSelectedSource] = useState('spotify');
  const [volume, setVolume] = useState(50);

  // Mock media sources - in real impl, fetch from HA
  const mediaSources = [
    { label: 'Spotify', value: 'spotify' },
    { label: 'Apple Music', value: 'apple_music' },
    { label: 'Radio', value: 'radio' },
    { label: 'Bluetooth', value: 'bluetooth' },
    { label: 'AUX', value: 'aux' }
  ];
  const mediaPlayers = ['Living Room Speaker', 'Kitchen Player', 'TV Media Player'];

  // Dynamic time state
  const [currentTime, setCurrentTime] = useState('12:45pm');
  const [currentDate, setCurrentDate] = useState('Sep 24th');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${displayHours}:${minutes}${ampm}`);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[now.getMonth()];
      const day = now.getDate();
      const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
      setCurrentDate(`${month} ${day}${suffix}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Function to call HA API - reuse from useJavis or direct fetch
  const handleMediaControl = async (service: string, data: any = {}) => {
    try {
      const payload = {
        service,
        domain: 'media_player',
        data: {
          entity_id: selectedPlayer.toLowerCase().replace(/\s+/g, '_'),
          ...data
        }
      };
      const res = await fetch('/api/ha/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to control media');
      toast.success('Media updated');
    } catch (err) {
      toast.error('Error: Media control failed');
    }
  };

  useEffect(() => {
    // Optionally sync volume from HA on open
  }, [mediaDialogOpen]);

  return (
    <div className="p-2 sm:p-4 md:p-6 h-full overflow-auto">
      {/* Unified Header - Visible on all sizes */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={() => setSidebarOpen(prev => !prev)}
            className="p-1 sm:p-2 flex-shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">My Workstation</h1>
            <p className="hidden md:block text-xs md:text-sm text-muted-foreground">12 Devices running</p>
          </div>
        </div>
        
        {/* Right: Weather + Time + Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Weather */}
          <div className="flex items-center gap-2 hidden sm:flex">
            <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <div>
              <p className="text-xs sm:text-sm font-medium">{isLoadingWeather ? 'Loading...' : displayCondition}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isLoadingWeather ? '...' : `${displayTemp}${unit}`}
              </p>
            </div>
          </div>
          
          {/* Time - Dynamic */}
          <div className="text-right hidden sm:block">
            <p className="text-base sm:text-lg font-bold">{currentTime}</p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              {currentDate}
            </p>
          </div>

          {/* Menu Popup */}
          <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="sr-only">Media Player Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Media Player Settings</DialogTitle>
                <DialogDescription>Configure your media player</DialogDescription>
              </DialogHeader>
              
              {/* Player Selection */}
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Select Player</label>
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose player" />
                    </SelectTrigger>
                    <SelectContent>
                      {(mediaPlayers || []).map(player => (
                        <SelectItem key={player} value={player}>{player}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Default Volume */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Volume</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{volume}%</span>
                  </div>
                  <Slider 
                    value={[volume]} 
                    onValueChange={(v) => setVolume(v[0])} 
                    max={100} 
                    step={1}
                    className="w-full"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMediaControl('volume_set', { volume: volume / 100 })}
                    className="w-full"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Set Volume
                  </Button>
                </div>
                
                {/* Source Selection */}
                <div>
                  <label className="text-sm font-medium">Source</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose source" />
                    </SelectTrigger>
                    <SelectContent>
                      {(mediaSources || []).map(source => (
                        <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMediaControl('select_source', { source: selectedSource })}
                    className="w-full mt-2"
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Set Source
                  </Button>
                </div>
                
                {/* Quick Controls */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Controls</label>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMediaControl('media_play')}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMediaControl('media_pause')}
                      className="flex-1"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMediaControl('volume_mute', { is_volume_muted: true })}
                      className="flex-1"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Grid - Responsive */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <LeftColumn />
        <RightColumn />
      </div>

      <JavisAssistant />
    </div>
  );
};