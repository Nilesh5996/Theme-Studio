
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
}

export interface Typography {
  fontFamily: string;
  fontSizeBase: number;
  borderRadius: number;
}

export type IconStyle = 'minimal' | 'rounded' | 'outline' | 'glass';

export interface MobileTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: Typography;
  iconStyle: IconStyle;
  wallpaperUrl: string;
  createdAt: number;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}
