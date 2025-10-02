"use client"

import { useEffect, useState } from 'react';
import { DashboardProvider } from '@/context/DashboardContext'
import { MainContent } from '@/components/dashboard/MainContent'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useScreenSize } from '@/hooks/useScreenSize';
import { useAudioLevels } from '@/hooks/useAudioLevels';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    mode: 'auto',
    screenSize: 'desktop',
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    primaryColor: '#3b82f6',
    cardPlaceholderColor: '#9ca3af',
    themePreset: 'default'
  });
  const audioLevels = useAudioLevels();
  const screenSize = useScreenSize();

  // Utility functions for color adjustment
  const hexToRgb = (hex) => {
    if (typeof hex !== 'string' || !hex) return { r: 255, g: 255, b: 255 };
    let resultHex = hex.replace(/^#/, '');
    let r, g, b;
    if (resultHex.length === 3) {
      r = parseInt(resultHex[0] + resultHex[0], 16);
      g = parseInt(resultHex[1] + resultHex[1], 16);
      b = parseInt(resultHex[2] + resultHex[2], 16);
    } else if (resultHex.length === 6) {
      r = parseInt(resultHex.substring(0, 2), 16);
      g = parseInt(resultHex.substring(2, 4), 16);
      b = parseInt(resultHex.substring(4, 6), 16);
    } else {
      return { r: 255, g: 255, b: 255 };
    }
    return { r, g, b };
  };

  const adjustColor = (hex, amount) => {
    const rgb = hexToRgb(hex);
    const newR = Math.max(0, Math.min(255, Math.round(rgb.r * (1 + amount / 100))));
    const newG = Math.max(0, Math.min(255, Math.round(rgb.g * (1 + amount / 100))));
    const newB = Math.max(0, Math.min(255, Math.round(rgb.b * (1 + amount / 100))));
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
  };

  const getLuminance = (rgb) => {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => {
      if (c <= 0.03928) return c / 12.92;
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Fetch and apply settings
  useEffect(() => {
    fetch('/api/appearance-settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            backgroundColor: data.backgroundColor || '#ffffff',
            primaryColor: data.primaryColor || '#3b82f6',
            cardPlaceholderColor: data.cardPlaceholderColor || '#9ca3af',
            themePreset: data.themePreset || 'default',
            mode: data.mode || 'auto',
            screenSize: data.screenSize || 'desktop',
            width: data.width || 1200,
            height: data.height || 800
          });
        }
      })
      .catch(() => {}); // Silent fail, use defaults
  }, []);

  // Apply theme CSS vars when settings change
  useEffect(() => {
    const root = document.documentElement;
    const bgColor = settings.backgroundColor;
    const primaryColor = settings.primaryColor;
    const placeholderColor = settings.cardPlaceholderColor;

    // Set background
    root.style.setProperty('--background', bgColor);

    // Set primary
    root.style.setProperty('--primary', primaryColor);
    const primaryL = getLuminance(hexToRgb(primaryColor));
    root.style.setProperty('--primary-foreground', primaryL < 0.5 ? '#ffffff' : '#000000');

    // Set placeholders/muted
    root.style.setProperty('--muted', placeholderColor);
    root.style.setProperty('--secondary', placeholderColor);
    root.style.setProperty('--accent', placeholderColor);

    // Adjust card for contrast
    const bgL = getLuminance(hexToRgb(bgColor));
    const cardAdj = bgL > 0.5 ? -8 : 12; // Slightly stronger adjustment for better separation
    const cardColor = adjustColor(bgColor, cardAdj);
    root.style.setProperty('--card', cardColor);
    root.style.setProperty('--popover', cardColor);

    // Set card foreground based on adjusted card
    const cardL = getLuminance(hexToRgb(cardColor));
    root.style.setProperty('--card-foreground', cardL < 0.5 ? '#ffffff' : '#000000');
    root.style.setProperty('--popover-foreground', cardL < 0.5 ? '#ffffff' : '#000000');
  }, [settings]);

  useEffect(() => {
    setSidebarOpen(screenSize === 'desktop');
  }, [screenSize]);

  return (
    <DashboardProvider>
      <main className="min-h-screen flex relative bg-background"> {/* Use CSS var, remove inline */}
        {/* Mobile Overlay */}
        {(screenSize !== 'desktop') && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          audioLevels={audioLevels}
          screenSize={screenSize}
        />
        
        <div className="flex-1">
          <MainContent setSidebarOpen={setSidebarOpen} />
        </div>
      </main>
    </DashboardProvider>
  )
}