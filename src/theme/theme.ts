import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme, Appearance } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    border: string;
    card: string;
    shadow: string;
    white: string;
    disabled: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weights: {
      thin: "100";
      extralight: "200";
      light: "300";
      normal: "400";
      medium: "500";
      semibold: "600";
      bold: "700";
      extrabold: "800";
      black: "900";
    };
    h1: {
      fontSize: number;
      fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    };
    h2: {
      fontSize: number;
      fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    };
    h3: {
      fontSize: number;
      fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    };
    body: {
      fontSize: number;
      fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    };
    caption: {
      fontSize: number;
      fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#fb923c',        // Main orange from logo
    primaryLight: '#f48f51',   // Light orange
    secondary: '#334155',      // Slate 700
    accent: '#0ea5e9',        // Sky 500
    background: '#f8fafc',    // Slate 50
    surface: '#ffffff',       // White
    text: '#0f172a',         // Slate 900
    textSecondary: '#64748b', // Slate 500
    error: '#ef4444',        // Red 500
    success: '#22c55e',      // Green 500
    warning: '#f59e0b',      // Amber 500
    info: '#3b82f6',         // Blue 500
    border: '#e2e8f0',       // Slate 200
    card: '#ffffff',         // White
    shadow: '#94a3b8',       // Slate 400
    white: '#ffffff',        // White
    disabled: '#94a3b8',     // Slate 400 (same as shadow for consistency)
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    weights: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    h1: {
      fontSize: 32,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#fb923c',        // Main orange from logo
    primaryLight: '#f48f51',   // Light orange
    secondary: '#334155',      // Slate 700
    accent: '#0ea5e9',        // Sky 500
    background: '#f8fafc',    // Slate 50
    surface: '#ffffff',       // White
    text: '#0f172a',         // Slate 900
    textSecondary: '#64748b', // Slate 500
    error: '#ef4444',        // Red 500
    success: '#22c55e',      // Green 500
    warning: '#f59e0b',      // Amber 500
    info: '#3b82f6',         // Blue 500
    border: '#e2e8f0',       // Slate 200
    card: '#ffffff',         // White
    shadow: '#94a3b8',       // Slate 400
    white: '#ffffff',        // White
    disabled: '#94a3b8',     // Slate 400 (same as shadow for consistency)
  },
};

export const useTheme = () => {
  const colorScheme = useColorScheme() || Appearance.getColorScheme();
  return colorScheme === 'dark' ? lightTheme : lightTheme;
};

export const theme = lightTheme;
