
import { MobileTheme } from './types';

export const DEFAULT_THEME: MobileTheme = {
  id: 'default-1',
  name: 'Midnight Aurora',
  colors: {
    primary: '#6366f1',
    secondary: '#a855f7',
    background: '#09090b',
    surface: '#18181b',
    text: '#fafafa',
    accent: '#14b8a6'
  },
  typography: {
    fontFamily: 'Inter',
    fontSizeBase: 16,
    borderRadius: 12
  },
  iconStyle: 'rounded',
  wallpaperUrl: 'https://picsum.photos/id/10/800/1600',
  createdAt: Date.now()
};

export const FONT_OPTIONS = [
  'Inter',
  'Outfit',
  'JetBrains Mono',
  'Playfair Display',
  'system-ui'
];

export const ICON_STYLES = [
  { id: 'minimal', name: 'Minimal' },
  { id: 'rounded', name: 'Soft Rounded' },
  { id: 'outline', name: 'Bold Outline' },
  { id: 'glass', name: 'Glassmorphism' }
];
