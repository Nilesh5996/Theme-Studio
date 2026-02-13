
import React from 'react';
import { MobileTheme } from '../types';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Search, 
  Settings, 
  MessageCircle, 
  Camera, 
  Phone, 
  Calendar,
  CloudSun,
  Music,
  Heart
} from 'lucide-react';

interface PreviewProps {
  theme: MobileTheme;
}

const Preview: React.FC<PreviewProps> = ({ theme }) => {
  const { colors, typography, iconStyle, wallpaperUrl } = theme;

  const iconBaseStyle = {
    borderRadius: typography.borderRadius,
    backgroundColor: colors.surface,
    color: colors.primary,
  };

  const getIconContainerStyle = (accent?: boolean) => ({
    ...iconBaseStyle,
    backgroundColor: accent ? colors.primary : colors.surface,
    color: accent ? colors.background : colors.primary,
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 lg:p-8">
      {/* Phone Frame */}
      <div 
        className="relative w-[320px] h-[640px] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden"
        style={{ fontFamily: typography.fontFamily }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20"></div>

        {/* Wallpaper */}
        <div className="absolute inset-0 z-0">
          <img 
            src={wallpaperUrl} 
            alt="wallpaper" 
            className="w-full h-full object-cover opacity-60"
          />
          <div 
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, transparent 0%, ${colors.background} 100%)` }}
          />
        </div>

        {/* Status Bar */}
        <div className="relative z-10 flex justify-between items-center px-6 pt-6 text-[10px] font-bold text-white/80">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <Signal size={10} />
            <Wifi size={10} />
            <Battery size={10} />
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative z-10 flex flex-col h-full px-6 pt-12 pb-8">
          {/* Weather Widget */}
          <div 
            className="p-4 mb-6"
            style={{ 
              backgroundColor: `${colors.surface}cc`, 
              borderRadius: typography.borderRadius,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${colors.primary}22`
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: colors.text }}>24°C</h3>
                <p className="text-xs opacity-70" style={{ color: colors.text }}>San Francisco</p>
              </div>
              <CloudSun size={24} style={{ color: colors.accent }} />
            </div>
            <p className="mt-2 text-[10px]" style={{ color: colors.text }}>Cloudy throughout the day</p>
          </div>

          {/* Icon Grid */}
          <div className="grid grid-cols-4 gap-4 mb-auto">
            {[
              { icon: Phone, label: 'Phone' },
              { icon: MessageCircle, label: 'Messages', accent: true },
              { icon: Camera, label: 'Camera' },
              { icon: Settings, label: 'Settings' },
              { icon: Calendar, label: 'Calendar' },
              { icon: Heart, label: 'Health' },
              { icon: Music, label: 'Music' },
              { icon: Search, label: 'Search' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div 
                  className={`w-12 h-12 flex items-center justify-center transition-all ${iconStyle === 'glass' ? 'backdrop-blur-md bg-opacity-30' : ''}`}
                  style={getIconContainerStyle(item.accent)}
                >
                  <item.icon size={22} />
                </div>
                <span className="text-[10px] font-medium" style={{ color: colors.text }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom Dock */}
          <div 
            className="flex justify-around items-center p-3 mt-auto"
            style={{ 
              backgroundColor: `${colors.surface}88`, 
              borderRadius: typography.borderRadius + 8,
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Phone size={18} style={{ color: colors.primary }} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle size={18} style={{ color: colors.primary }} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Camera size={18} style={{ color: colors.primary }} />
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-4" />
        </div>
      </div>
      <p className="mt-6 text-zinc-500 text-sm font-medium">Live HD Preview Simulator</p>
    </div>
  );
};

export default Preview;
