import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const colors = {
  // Brand colors
  primary: '#0A84FF',
  secondary: '#5856D6',
  accent: '#FF9500',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#0A84FF',
  
  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
    // Light mode specific colors
    background: colors.black,
    card: colors.gray[900],
    text: colors.white,
    border: colors.gray[700],
    notification: colors.error,
    // Custom semantic colors
    surface: colors.gray[800],
    surfaceSecondary: colors.gray[700],
    textPrimary: colors.white,
    textSecondary: colors.gray[400],
    icon: colors.gray[300],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter-Regular',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
    },
  },
  shadows: {
    sm: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...colors,
    // Dark mode specific colors
    background: colors.gray[900],
    card: colors.gray[800],
    text: colors.white,
    border: colors.gray[700],
    notification: colors.error,
    // Custom semantic colors
    surface: colors.gray[800],
    surfaceSecondary: colors.gray[700],
    textPrimary: colors.white,
    textSecondary: colors.gray[400],
    icon: colors.gray[300],
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
  shadows: lightTheme.shadows,
};

// Type definitions
export type Theme = typeof lightTheme;
export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof lightTheme.spacing;
export type ThemeBorderRadius = typeof lightTheme.borderRadius;
export type ThemeTypography = typeof lightTheme.typography;
export type ThemeShadows = typeof lightTheme.shadows; 