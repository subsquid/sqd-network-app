import { PaletteOptions } from '@mui/material';
import { alpha } from '@mui/system/colorManipulator';

export const NetworkLightTheme = {
  primary: {
    main: '#f0f2f5',
    contrastText: '#3E4A5C',
  },
  secondary: {
    main: '#8596ad',
    contrastText: '#540f8a',
  },
  info: {
    main: '#726fff',
    contrastText: '#fff',
  },
  success: {
    main: '#248a0f',
    contrastText: '#fff',
  },
  error: {
    main: '#dc3545',
    contrastText: '#fff',
  },
  warning: {
    main: '#ffa800',
    contrastText: '#fff',
  },
  text: {
    primary: '#0d0d0d',
    secondary: '#3e4a5c',
    disabled: '#c2cad6',
  },
  background: {
    paper: '#f0f2f5',
    default: '#ffffff',
  },
  divider: '#d6d8dc',
  action: {
    active: alpha('#404a5a', 0.15),
    activatedOpacity: 0.15,
    hover: alpha('#3e4a5c', 0.1),
    hoverOpacity: 0.08,
    selected: alpha('#3e4a5c', 0.1),
    selectedOpacity: 0.1,
    disabled: alpha('#3e4a5c', 0.26),
    disabledBackground: alpha('#3e4a5c', 0.12),
    disabledOpacity: 0.38,
    focus: alpha('#3e4a5c', 0.12),
    focusOpacity: 0.12,
  },
  common: {
    black: '#0d0d0d',
    white: '#ffffff',
  },
  tonalOffset: 0.1,
  mode: 'light',
} satisfies PaletteOptions;
