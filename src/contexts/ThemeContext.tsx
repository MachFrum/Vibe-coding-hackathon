
'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { hexToHsl, hslStringToHex } from '@/lib/colorUtils'; 

export interface ColorValues {
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string;
  '--ring': string;
  '--sidebar-background': string;
  '--sidebar-foreground': string;
}

export interface Theme {
  name: string;
  colors: ColorValues;
}

export type SavedPalette = {
  name: string;
  colors: CustomColorOverrides;
}

const getHighContrastForeground = (backgroundHslString: string): string => {
  const parts = backgroundHslString.match(/(\d+)\s*(\d+)%\s*(\d+)%/);
  if (!parts) return '0 0% 3.9%'; 
  const lightness = parseFloat(parts[3]);
  return lightness > 50 ? '0 0% 3.9%' : '0 0% 98%'; 
};

const CUSTOM_COLOR_OVERRIDES_KEY = 'malitrack-custom-colors';
const SAVED_PALETTES_KEY = 'malitrack-saved-palettes';


export const themes: Theme[] = [
   {
    name: 'Party Vibe (Modern)',
    colors: {
      '--background': hexToHsl('#FAFAFA')!, 
      '--foreground': getHighContrastForeground(hexToHsl('#FAFAFA')!),
      '--card': hexToHsl('#FFFFFF')!, 
      '--card-foreground': getHighContrastForeground(hexToHsl('#FFFFFF')!),
      '--popover': hexToHsl('#FFFFFF')!,
      '--popover-foreground': getHighContrastForeground(hexToHsl('#FFFFFF')!),
      '--primary': hexToHsl('#FF5722')!, 
      '--primary-foreground': getHighContrastForeground(hexToHsl('#FF5722')!),
      '--secondary': hexToHsl('#FCE4EC')!, // Lighter version of Pink for Shadcn secondary
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#FCE4EC')!),
      '--muted': hexToHsl('#F5F5F5')!, 
      '--muted-foreground': hexToHsl('#757575')!,
      '--accent': hexToHsl('#E91E63')!, 
      '--accent-foreground': getHighContrastForeground(hexToHsl('#E91E63')!),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#EEEEEE')!, 
      '--input': hexToHsl('#EEEEEE')!,
      '--ring': hexToHsl('#FF5722')!, 
      '--sidebar-background': hexToHsl('#F7F7F7')!,
      '--sidebar-foreground': getHighContrastForeground(hexToHsl('#F7F7F7')!),
    },
  },
  {
    name: 'Creative UI', 
    colors: {
      '--background': hexToHsl('#FFFFFF')!, 
      '--foreground': hexToHsl('#2D004F')!,
      '--card': hexToHsl('#F8F9FA')!,
      '--card-foreground': hexToHsl('#2D004F')!,
      '--popover': hexToHsl('#F8F9FA')!,
      '--popover-foreground': hexToHsl('#2D004F')!,
      '--primary': hexToHsl('#7209B7')!, 
      '--primary-foreground': hexToHsl('#FFFFFF')!, 
      '--secondary': hexToHsl('#C3FCEB')!, // Lighter version of Cyber Lime
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#C3FCEB')!),
      '--muted': hexToHsl('#F1F3F5')!,
      '--muted-foreground': hexToHsl('#495057')!,
      '--accent': hexToHsl('#06FFA5')!, 
      '--accent-foreground': hexToHsl('#003321')!, 
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#E9ECEF')!,
      '--input': hexToHsl('#E9ECEF')!,
      '--ring': hexToHsl('#7209B7')!, 
      '--sidebar-background': hexToHsl('#FAFBFC')!,
      '--sidebar-foreground': hexToHsl('#2D004F')!,
    },
  },
   {
    name: 'Strong Grinder', 
    colors: {
      '--background': hexToHsl('#8E8E93')!, 
      '--foreground': hexToHsl('#FFFFFF')!, 
      '--card': hexToHsl('#A0A0A5')!, 
      '--card-foreground': hexToHsl('#FFFFFF')!,
      '--popover': hexToHsl('#A0A0A5')!,
      '--popover-foreground': hexToHsl('#FFFFFF')!,
      '--primary': hexToHsl('#1C1C1E')!, 
      '--primary-foreground': hexToHsl('#FFFFFF')!, 
      '--secondary': hexToHsl('#FFD6D3')!, // Lighter version of Fire Red
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#FFD6D3')!),
      '--muted': hexToHsl('#7A7A7F')!,
      '--muted-foreground': hexToHsl('#D0D0D0')!,
      '--accent': hexToHsl('#FF3B30')!, 
      '--accent-foreground': hexToHsl('#FFFFFF')!, 
      '--destructive': '0 70% 55%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#6C6C70')!,
      '--input': hexToHsl('#6C6C70')!,
      '--ring': hexToHsl('#FF3B30')!, 
      '--sidebar-background': hexToHsl('#2C2C2E')!, 
      '--sidebar-foreground': hexToHsl('#FFFFFF')!,
    },
  },
  {
    name: 'Luxury', 
    colors: {
      '--background': hexToHsl('#F8F8FF')!, 
      '--foreground': hexToHsl('#001F3F')!, 
      '--card': hexToHsl('#FFFFFF')!, 
      '--card-foreground': hexToHsl('#001F3F')!,
      '--popover': hexToHsl('#FFFFFF')!,
      '--popover-foreground': hexToHsl('#001F3F')!,
      '--primary': hexToHsl('#001F3F')!, 
      '--primary-foreground': hexToHsl('#FFFFFF')!, 
      '--secondary': hexToHsl('#F0E2B6')!, // Lighter version of Champagne Gold
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#F0E2B6')!),
      '--muted': hexToHsl('#E0E8F0')!,
      '--muted-foreground': hexToHsl('#003366')!,
      '--accent': hexToHsl('#D4AF37')!, 
      '--accent-foreground': hexToHsl('#001F3F')!, 
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#D0C0A0')!, 
      '--input': hexToHsl('#D0C0A0')!,
      '--ring': hexToHsl('#D4AF37')!, 
      '--sidebar-background': hexToHsl('#F0F4F8')!,
      '--sidebar-foreground': hexToHsl('#001F3F')!,
    },
  },
  {
    name: 'Conqueror', 
    colors: {
      '--background': hexToHsl('#E5E4E2')!, 
      '--foreground': hexToHsl('#1A1A1A')!, 
      '--card': hexToHsl('#F0EFED')!, 
      '--card-foreground': hexToHsl('#1A1A1A')!,
      '--popover': hexToHsl('#F0EFED')!,
      '--popover-foreground': hexToHsl('#1A1A1A')!,
      '--primary': hexToHsl('#007AFF')!, 
      '--primary-foreground': hexToHsl('#FFFFFF')!, 
      '--secondary': hexToHsl('#FFEEC2')!, // Lighter version of Champion Gold
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#FFEEC2')!),
      '--muted': hexToHsl('#DCDCDC')!,
      '--muted-foreground': hexToHsl('#4D4D4D')!,
      '--accent': hexToHsl('#FFD700')!, 
      '--accent-foreground': hexToHsl('#332A00')!, 
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#C8C7C5')!,
      '--input': hexToHsl('#C8C7C5')!,
      '--ring': hexToHsl('#007AFF')!, 
      '--sidebar-background': hexToHsl('#E0DFDD')!,
      '--sidebar-foreground': hexToHsl('#1A1A1A')!,
    },
  },
  {
    name: 'Dark Artistic', 
    colors: {
      '--background': hexToHsl('#2D2D30')!, 
      '--foreground': hexToHsl('#F6F1E8')!, 
      '--card': hexToHsl('#3A3A3D')!, 
      '--card-foreground': hexToHsl('#F6F1E8')!,
      '--popover': hexToHsl('#3A3A3D')!,
      '--popover-foreground': hexToHsl('#F6F1E8')!,
      '--primary': hexToHsl('#B19CD9')!, 
      '--primary-foreground': hexToHsl('#1E1E20')!, 
      '--secondary': hexToHsl('#E0D8F0')!, // Lighter Amethyst
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#E0D8F0')!),
      '--muted': hexToHsl('#464649')!, 
      '--muted-foreground': hexToHsl('#B0B0B3')!, 
      '--accent': hexToHsl('#F6F1E8')!, 
      '--accent-foreground': hexToHsl('#1E1E20')!, 
      '--destructive': '0 70% 50%', 
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#505053')!, 
      '--input': hexToHsl('#505053')!,
      '--ring': hexToHsl('#B19CD9')!, 
      '--sidebar-background': hexToHsl('#252528')!, 
      '--sidebar-foreground': hexToHsl('#F6F1E8')!,
    },
  },
  {
    name: 'Ocean Breeze', 
    colors: {
      '--background': hexToHsl('#E0F7FA')!, 
      '--foreground': hexToHsl('#004D40')!, 
      '--card': hexToHsl('#F0FCFD')!, 
      '--card-foreground': hexToHsl('#004D40')!,
      '--popover': hexToHsl('#F0FCFD')!,
      '--popover-foreground': hexToHsl('#004D40')!,
      '--primary': hexToHsl('#006064')!, 
      '--primary-foreground': hexToHsl('#E0F7FA')!, 
      '--secondary': hexToHsl('#A7F3FC')!, // Lighter Bright Cyan
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#A7F3FC')!),
      '--muted': hexToHsl('#B2EBF2')!,
      '--muted-foreground': hexToHsl('#00796B')!,
      '--accent': hexToHsl('#26C6DA')!, 
      '--accent-foreground': hexToHsl('#003C43')!, 
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#A0E0E6')!,
      '--input': hexToHsl('#A0E0E6')!,
      '--ring': hexToHsl('#006064')!, 
      '--sidebar-background': hexToHsl('#D0F0F5')!,
      '--sidebar-foreground': hexToHsl('#004D40')!,
    },
  },
  {
    name: 'Forest Calm', 
    colors: {
      '--background': hexToHsl('#F1F8E9')!, 
      '--foreground': hexToHsl('#1B5E20')!, 
      '--card': hexToHsl('#FBFCF7')!, 
      '--card-foreground': hexToHsl('#1B5E20')!,
      '--popover': hexToHsl('#FBFCF7')!,
      '--popover-foreground': hexToHsl('#1B5E20')!,
      '--primary': hexToHsl('#2E7D32')!, 
      '--primary-foreground': hexToHsl('#F1F8E9')!, 
      '--secondary': hexToHsl('#DCEDC8')!, // Lighter Fresh Lime
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#DCEDC8')!),
      '--muted': hexToHsl('#E0F0D4')!,
      '--muted-foreground': hexToHsl('#388E3C')!,
      '--accent': hexToHsl('#8BC34A')!, 
      '--accent-foreground': hexToHsl('#10350C')!, 
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#C5E1A5')!,
      '--input': hexToHsl('#C5E1A5')!,
      '--ring': hexToHsl('#2E7D32')!, 
      '--sidebar-background': hexToHsl('#E8F3DD')!,
      '--sidebar-foreground': hexToHsl('#1B5E20')!,
    },
  },
  {
    name: 'Sunset Glow (Modern)',
    colors: {
      '--background': hexToHsl('#F8F9FA')!, 
      '--foreground': getHighContrastForeground(hexToHsl('#F8F9FA')!),
      '--card': hexToHsl('#FFFFFF')!, 
      '--card-foreground': getHighContrastForeground(hexToHsl('#FFFFFF')!),
      '--popover': hexToHsl('#FFFFFF')!,
      '--popover-foreground': getHighContrastForeground(hexToHsl('#FFFFFF')!),
      '--primary': hexToHsl('#D84315')!, 
      '--primary-foreground': getHighContrastForeground(hexToHsl('#D84315')!),
      '--secondary': hexToHsl('#FFCCBC')!, // Lighter Soft Salmon
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#FFCCBC')!),
      '--muted': hexToHsl('#F1F3F5')!, 
      '--muted-foreground': hexToHsl('#495057')!,
      '--accent': hexToHsl('#FF6B6B')!, 
      '--accent-foreground': getHighContrastForeground(hexToHsl('#FF6B6B')!),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': hexToHsl('#DEE2E6')!, 
      '--input': hexToHsl('#DEE2E6')!,
      '--ring': hexToHsl('#D84315')!, 
      '--sidebar-background': hexToHsl('#F1F3F5')!,
      '--sidebar-foreground': getHighContrastForeground(hexToHsl('#F1F3F5')!),
    },
  },
];

export type CustomColorOverrides = Partial<Record<keyof ColorValues, string>>;
const colorVarsToCustomize: Array<keyof ColorValues> = [
  '--background',
  '--foreground',
  '--primary',
  '--secondary', 
  '--accent',
];


interface ThemeContextType {
  theme: Theme;
  setThemeByName: (themeName: string) => void;
  cycleTheme: () => void;
  themeIndex: number;
  customColorOverrides: CustomColorOverrides;
  updateCustomColor: (variableName: keyof ColorValues, hslValue: string) => void;
  getEffectiveColor: (variableName: keyof ColorValues) => string;
  savedPalettes: SavedPalette[];
  saveCurrentCustomPalette: (name: string) => void;
  applySavedPalette: (palette: SavedPalette) => void;
  deleteSavedPalette: (paletteName: string) => void;
  randomizeCurrentThemeColors: () => void;
  resetCustomColorsToThemeDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [customColorOverrides, setCustomColorOverrides] = useState<CustomColorOverrides>({});
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);

  const applyColors = useCallback((baseColors: ColorValues, overrides: CustomColorOverrides) => {
    const root = document.documentElement;
    const effectiveColors = { ...baseColors, ...overrides };
    Object.entries(effectiveColors).forEach(([variable, value]) => {
      if (value) { // Ensure value is not undefined
         root.style.setProperty(variable, value);
      }
    });
  }, []);

  useEffect(() => {
    const storedThemeName = localStorage.getItem('malitrack-theme');
    const initialThemeIndex = themes.findIndex(t => t.name === storedThemeName);
    const validInitialIndex = initialThemeIndex !== -1 ? initialThemeIndex : 0;
    setCurrentThemeIndex(validInitialIndex);

    const storedOverrides = localStorage.getItem(CUSTOM_COLOR_OVERRIDES_KEY);
    const initialOverrides = storedOverrides ? JSON.parse(storedOverrides) : {};
    setCustomColorOverrides(initialOverrides);
    
    const storedSavedPalettes = localStorage.getItem(SAVED_PALETTES_KEY);
    const initialSavedPalettes = storedSavedPalettes ? JSON.parse(storedSavedPalettes) : [];
    setSavedPalettes(initialSavedPalettes);

    applyColors(themes[validInitialIndex].colors, initialOverrides);
  }, [applyColors]);

  const setThemeByName = (themeName: string) => {
    const themeIndex = themes.findIndex(t => t.name === themeName);
    if (themeIndex !== -1) {
      setCurrentThemeIndex(themeIndex);
      applyColors(themes[themeIndex].colors, customColorOverrides);
      localStorage.setItem('malitrack-theme', themes[themeIndex].name);
    }
  };

  const cycleTheme = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(nextThemeIndex);
    applyColors(themes[nextThemeIndex].colors, customColorOverrides);
    localStorage.setItem('malitrack-theme', themes[nextThemeIndex].name);
  };

  const updateCustomColor = (variableName: keyof ColorValues, hslValue: string) => {
    const newOverrides = { ...customColorOverrides, [variableName]: hslValue };
    setCustomColorOverrides(newOverrides);
    localStorage.setItem(CUSTOM_COLOR_OVERRIDES_KEY, JSON.stringify(newOverrides));
    applyColors(themes[currentThemeIndex].colors, newOverrides);
  };
  
  const getEffectiveColor = (variableName: keyof ColorValues): string => {
    return customColorOverrides[variableName] || themes[currentThemeIndex].colors[variableName];
  };

  const saveCurrentCustomPalette = (name: string) => {
    if (!name.trim()) return; // Do not save if name is empty
    const newPalette: SavedPalette = { name, colors: { ...customColorOverrides } };
    const updatedPalettes = [...savedPalettes.filter(p => p.name !== name), newPalette];
    setSavedPalettes(updatedPalettes);
    localStorage.setItem(SAVED_PALETTES_KEY, JSON.stringify(updatedPalettes));
  };

  const applySavedPalette = (paletteToApply: SavedPalette) => {
    setCustomColorOverrides(paletteToApply.colors);
    localStorage.setItem(CUSTOM_COLOR_OVERRIDES_KEY, JSON.stringify(paletteToApply.colors));
    applyColors(themes[currentThemeIndex].colors, paletteToApply.colors);
  };

  const deleteSavedPalette = (paletteNameToDelete: string) => {
    const updatedPalettes = savedPalettes.filter(p => p.name !== paletteNameToDelete);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem(SAVED_PALETTES_KEY, JSON.stringify(updatedPalettes));
  };

  const generateRandomHsl = (minS = 30, maxS = 100, minL = 20, maxL = 80): string => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * (maxS - minS + 1)) + minS;
    const l = Math.floor(Math.random() * (maxL - minL + 1)) + minL;
    return `${h} ${s}% ${l}%`;
  };
  
  const randomizeCurrentThemeColors = () => {
    const newOverrides: CustomColorOverrides = {};
    
    // Randomize base colors
    newOverrides['--background'] = generateRandomHsl(0, 50, 10, 95); // Wider range for background
    newOverrides['--primary'] = generateRandomHsl();
    newOverrides['--secondary'] = generateRandomHsl();
    newOverrides['--accent'] = generateRandomHsl();

    // Determine foreground based on new background for readability
    newOverrides['--foreground'] = getHighContrastForeground(newOverrides['--background']!);
    
    // For other elements like card, popover, derive them or set to simple contrasting values
    const cardBgIsLight = parseInt(newOverrides['--background']!.split(' ')[2], 10) > 50;
    newOverrides['--card'] = cardBgIsLight ? generateRandomHsl(0, 30, 90, 100) : generateRandomHsl(0, 30, 5, 15); // whiteish or blackish
    newOverrides['--card-foreground'] = getHighContrastForeground(newOverrides['--card']!);

    newOverrides['--popover'] = newOverrides['--card'];
    newOverrides['--popover-foreground'] = newOverrides['--card-foreground'];
    
    newOverrides['--primary-foreground'] = getHighContrastForeground(newOverrides['--primary']!);
    newOverrides['--secondary-foreground'] = getHighContrastForeground(newOverrides['--secondary']!);
    newOverrides['--accent-foreground'] = getHighContrastForeground(newOverrides['--accent']!);

    newOverrides['--border'] = cardBgIsLight ? generateRandomHsl(0, 20, 80, 90) : generateRandomHsl(0, 20, 20, 30);
    newOverrides['--input'] = newOverrides['--border'];
    newOverrides['--ring'] = newOverrides['--primary']; // Ring usually matches primary

    // Destructive colors often kept standard
    newOverrides['--destructive'] = themes[currentThemeIndex].colors['--destructive'];
    newOverrides['--destructive-foreground'] = themes[currentThemeIndex].colors['--destructive-foreground'];

    // Muted colors
    newOverrides['--muted'] = cardBgIsLight ? generateRandomHsl(0, 15, 85, 95) : generateRandomHsl(0, 15, 15, 25);
    newOverrides['--muted-foreground'] = getHighContrastForeground(newOverrides['--muted']!);

    // Sidebar (can be simpler: contrast with main background or use primary related colors)
    newOverrides['--sidebar-background'] = cardBgIsLight ? generateRandomHsl(0, 30, 90, 98) : generateRandomHsl(0, 30, 8, 12);
    newOverrides['--sidebar-foreground'] = getHighContrastForeground(newOverrides['--sidebar-background']!);


    setCustomColorOverrides(newOverrides);
    localStorage.setItem(CUSTOM_COLOR_OVERRIDES_KEY, JSON.stringify(newOverrides));
    applyColors(themes[currentThemeIndex].colors, newOverrides);
  };

  const resetCustomColorsToThemeDefaults = () => {
    setCustomColorOverrides({});
    localStorage.removeItem(CUSTOM_COLOR_OVERRIDES_KEY);
    applyColors(themes[currentThemeIndex].colors, {});
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: themes[currentThemeIndex], 
      setThemeByName, 
      cycleTheme, 
      themeIndex: currentThemeIndex,
      customColorOverrides,
      updateCustomColor,
      getEffectiveColor,
      savedPalettes,
      saveCurrentCustomPalette,
      applySavedPalette,
      deleteSavedPalette,
      randomizeCurrentThemeColors,
      resetCustomColorsToThemeDefaults
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
