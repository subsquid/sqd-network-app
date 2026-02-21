import '@rainbow-me/rainbowkit/styles.css';
import { useMemo } from 'react';

import { createTheme as createMuiTheme } from '@mui/material';

import { localStorageStringSerializer, useLocalStorageState } from '@hooks/useLocalStorageState';

import { NetworkLightTheme } from './network-light';
import { themeComponents } from './theme.components';

export type PaletteType = 'light' | 'dark';

const loader = document.getElementById('loader');

const defaultTheme: PaletteType = 'light';

export function useThemeState(): [PaletteType, (palette: PaletteType) => void] {
  const [theme, setThemeName] = useLocalStorageState<PaletteType>('theme', {
    serializer: localStorageStringSerializer,
    defaultValue: defaultTheme,
  });

  const parsedTheme: PaletteType = theme === 'dark' || theme === 'light' ? theme : defaultTheme;

  return [
    parsedTheme,
    theme => {
      if (theme === 'dark') {
        loader?.classList.add('dark');
      } else {
        loader?.classList.remove('dark');
      }
      setThemeName(theme);
    },
  ];
}

const spacing = 8;

const fontFamily = `'Matter', 'Inter', sans-serif`;

// Radius scale for consistent border radius across components
const radius = {
  none: 0,
  xs: 2, // 2px  - dots, indicators
  sm: 4, // 4px  - chips, badges, menu items
  md: 8, // 8px  - inputs, small cards, tables
  lg: 12, // 12px - cards, modals, containers
  xl: 16, // 16px - hero sections
  full: 360, // circular elements
} as const;

export const radiusScale = radius;
export type RadiusScale = keyof typeof radius;

export const useCreateTheme = (mode: PaletteType) => {
  // Both modes currently use the light palette; swap NetworkLightTheme for a
  // dark palette here when dark mode is implemented.
  const colors = NetworkLightTheme;

  return useMemo(
    () =>
      createMuiTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 700,
            md: 1000,
            lg: 1200,
            xl: 1510,
          },
        },
        typography: {
          fontFamily,
          h1: {
            fontSize: '3.75rem',
            lineHeight: 1,
            fontWeight: 500,
            color: colors.text.primary,
            letterSpacing: '-0.01rem',
          },
          h2: {
            fontSize: '2.25rem',
            lineHeight: 1,
            fontWeight: 500,
            color: colors.text.primary,
            letterSpacing: '-0.01rem',
          },
          h3: {
            fontSize: '2rem',
            lineHeight: '2.25rem',
            fontWeight: 500,
          },
          h4: {
            fontSize: '1.5rem',
            lineHeight: '1.75rem',
            fontWeight: 500,
            letterSpacing: '-0.01rem',
          },
          h5: {
            fontSize: '1.25rem',
            lineHeight: '1.5rem',
            fontWeight: 500,
            letterSpacing: '-0.01rem',
          },
          body1: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
            fontWeight: 500,
            letterSpacing: '0rem',
          },
          body2: {
            color: colors.text.secondary,
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: 500,
            letterSpacing: '0rem',
          },
          button: {
            fontSize: '0.75rem',
            lineHeight: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.08rem',
          },
          caption: {
            color: colors.text.secondary,
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: 400,
          },
          subtitle1: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.08rem',
          },
          subtitle2: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
            fontWeight: 500,
            letterSpacing: '-0.01rem',
          },
        },
        palette: colors,
        spacing,
        shape: {
          borderRadius: radius.md,
        },
        components: themeComponents,
      }),
    [colors],
  );
};
