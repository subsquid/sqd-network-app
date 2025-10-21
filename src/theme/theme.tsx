import { useMemo } from 'react';

import { alpha, AppBarPropsColorOverrides, createTheme as createMuiTheme } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';

import { localStorageStringSerializer, useLocalStorageState } from '@hooks/useLocalStorageState';

import { NetworkLightTheme } from './network-light';

const COLORS = {
  light: NetworkLightTheme,
  dark: NetworkLightTheme,
};

export type PaletteType = 'light' | 'dark';

const loader = document.getElementById('loader');

const defaultTheme = 'light';

export function useThemeState(): [PaletteType, (palette: PaletteType) => void] {
  const [theme, setThemeName] = useLocalStorageState<'light' | 'dark'>('theme', {
    serializer: localStorageStringSerializer,
    defaultValue: defaultTheme,
  });

  const parsedTheme = ['dark', 'light'].includes(theme) ? theme : defaultTheme;

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
  xs: 2, // 2px - for very small elements (dots, indicators)
  sm: 4, // 4px - for small elements (chips, badges, menu items)
  md: 8, // 8px - for medium elements (inputs, small cards, tables)
  lg: 12, // 12px - for large elements (cards, modals, containers)
  xl: 16, // 16px - for extra large elements (hero sections)
  full: 360, // 360px - for circular elements (buttons, avatars)
} as const;

// Export radius scale for use in components
export const radiusScale = radius;
export type RadiusScale = keyof typeof radius;

export type ColorVariant = OverridableStringUnion<
  'primary' | 'secondary',
  AppBarPropsColorOverrides
>;

export const useCreateTheme = (mode: PaletteType) => {
  const colors = COLORS[mode];

  return useMemo(
    () =>
      createMuiTheme({
        breakpoints: {
          values: {
            xs: 600,
            sm: 800,
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
            color: colors.text?.primary,
            letterSpacing: '-0.01rem',
          },
          h3: {
            fontSize: '2rem',
            lineHeight: '2.25rem',
            fontWeight: 500,
          },
          h4: {
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
          borderRadius: radius.md, // Default global border radius (8px)
        },
        zIndex: {},
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: colors.background?.default,
                minWidth: 350,
              },
              a: {
                textDecoration: 'none',
                transition: 'color 200ms ease',
                //'&:hover': {
                //  color: '#0A3D8A',
                //},
              },
              '#cf-turnstile': {
                width: 'auto !important',
                margin: `${spacing}px 0 ${spacing * 2.5}px`,
                iframe: {
                  width: '100% !important',
                },
              },
              '*': {
                fontVariantLigatures: 'none',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  height: '6px',
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#8596ad',
                  borderRadius: radius.sm,
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#8596ad',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                color: colors.text?.primary,
                boxShadow: 'none',
                borderStyle: 'solid',
                borderWidth: '0px 0px 1px 0px',
                borderColor: colors.divider,
                background: colors.background.paper,
              },
            },
            defaultProps: {
              elevation: 0,
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: radius.full,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
                '&:active': {
                  boxShadow: 'none',
                },
                '&:focus': {
                  boxShadow: 'none',
                },
              },
              outlined: {
                color: colors.text.primary,
              },
              outlinedSecondary: {
                borderColor: colors.secondary.main,
              },
              outlinedError: {
                borderColor: colors.error.main,
              },
            },
            defaultProps: {
              color: 'primary',
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }) => ({
                border: 'none',
                boxShadow: 'none',
                borderRadius: radius.md, // 12px for papers/cards
              }),
              elevation1: {
                boxShadow: 'none',
              },
              elevation2: {
                boxShadow: 'none',
              },
              elevation3: {
                boxShadow: 'none',
              },
              elevation4: {
                boxShadow: 'none',
              },
            },
            defaultProps: {
              elevation: 0,
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                padding: 1.5 * spacing,
                overflow: 'visible',
                boxShadow: 'none',
              },
            },
            defaultProps: {
              elevation: 0,
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: ({ theme }) => ({
                '&:before': {
                  display: 'none',
                },
                '&:after': {
                  display: 'none',
                },
                borderRadius: theme.shape.borderRadius, // Use theme default (8px)
                borderStyle: 'solid',
                borderWidth: '1px',
                backgroundColor: '#f0f2f5 !important',
                height: 'auto',
                transition: 'all 300ms ease-out',
              }),
              input: {
                '&::placeholder': {
                  opacity: 0.7,
                },
                '&:focus::placeholder': {
                  opacity: 0.5,
                },
                padding: `${spacing * 1.25}px ${spacing * 1.75}px`,
                fontSize: '16px',
                lineHeight: '24px',
                // '&:hover': {
                //   backgroundColor: colors.background.paper,
                // },
              },
              adornedStart: {
                paddingLeft: spacing,
              },
              adornedEnd: {
                paddingRight: spacing,
              },
              multiline: {
                padding: 0,
              },
            },
          },
          MuiFilledInput: {
            styleOverrides: {
              root: {
                backgroundColor: '#f0f2f5',
                borderColor: colors.divider,

                '&.Mui-focused': {
                  borderColor: colors.secondary.main,
                },
                '&:hover': {
                  borderColor: colors.text.secondary,
                },
                '&.Mui-error': {
                  borderColor: colors.error.main,
                },
                '&.Mui-disabled': {
                  borderStyle: 'dashed',
                },
              },
              input: {
                backgroundColor: 'transparent',
                '&::placeholder': {
                  opacity: 0.7,
                },
                '&:focus::placeholder': {
                  opacity: 0.5,
                },
                padding: `${spacing * 1.25}px ${spacing * 1.75}px`,
                fontSize: '16px',
                lineHeight: '24px',
              },
              adornedStart: {
                paddingLeft: spacing,
              },
              adornedEnd: {
                paddingRight: spacing,
              },
              multiline: {
                padding: 0,
              },
            },
            variants: [
              {
                props: { color: 'secondary' },
                style: {
                  backgroundColor: `${colors.background.paper} !important`,
                  border: 'none',
                  borderWidth: '0',
                  '&.Mui-focused': {
                    border: 'none',
                  },
                  '&:hover': {
                    border: 'none',
                  },
                  '&.Mui-error': {
                    border: 'none',
                  },
                  '&.Mui-disabled': {
                    border: 'none',
                  },
                },
              },
            ],
          },
          MuiSelect: {
            styleOverrides: {
              filled: {},
              icon: {
                color: colors.text.secondary,
              },
              select: {
                '&.MuiInputBase-input.MuiInput-input': {
                  backgroundColor: '#f0f2f5',
                  borderRadius: radius.md,
                  padding: `${spacing}px ${spacing * 1.5}px`,
                  fontSize: '14px',
                  letterSpacing: '0rem',
                  transition: 'all 200ms ease-out',
                  border: 'none',
                  outline: 'none',
                  '&:hover': {
                    backgroundColor: colors.divider,
                  },
                  '&:focus': {
                    backgroundColor: '#f0f2f5',
                    outline: 'none',
                  },
                },
              },
              standard: {
                border: 'none',
                outline: 'none',
                '&:before': {
                  display: 'none',
                },
                '&:after': {
                  display: 'none',
                },
                '&:hover': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  border: 'none',
                  outline: 'none',
                },
              },
            },
          },
          MuiToggleButtonGroup: {
            styleOverrides: {
              root: {
                backgroundColor: '#f0f2f5',
                borderRadius: radius.md,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 0,
                  margin: 0,
                },
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                color: colors.text.secondary,
                backgroundColor: 'transparent',
                textTransform: 'none',
                fontSize: '14px',
                letterSpacing: '0rem',
                border: 'none',
                transition: 'all 200ms ease-out',
                '&.Mui-selected': {
                  backgroundColor: colors.divider,
                  color: colors.text.secondary,
                  '&:hover': {
                    backgroundColor: colors.divider,
                  },
                },
                minWidth: '64px',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& label.Mui-focused': {
                  fontWeight: 600,
                },
                // '&:hover .MuiOutlinedInput-notchedOutline': {
                //   borderColor: colors.primary.main,
                // },
              },
            },
          },
          MuiFormGroup: {
            styleOverrides: {},
          },
          MuiFormHelperText: {
            styleOverrides: {
              root: {
                marginLeft: 0,
                marginRight: 0,
                fontSize: '12px',
                lineHeight: '16px',
                marginTop: 4,
                transition: 'all 200ms ease-out',
                '&.Mui-error': {
                  fontWeight: 500,
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 500,
                transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-focused': {
                  fontWeight: 600,
                },
                '&.Mui-error': {
                  fontWeight: 500,
                },
              },
              shrink: {
                transform: 'translate(0, -1.5px) scale(0.85)',
              },
              filled: {
                transform: 'translate(12px, 20px) scale(1)',
                '&.Mui-focused': {
                  transform: 'translate(12px, 10px) scale(0.85)',
                },
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(12px, 10px) scale(0.85)',
                },
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 500,
                '&.Mui-focused': {
                  fontWeight: 600,
                },
                '&.Mui-required': {
                  '& .MuiFormLabel-asterisk': {
                    color: colors.error.main,
                  },
                },
              },
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                '& .MuiInputLabel-shrink + .MuiInput-formControl': {
                  marginTop: '16px',
                },
                '& .MuiInputLabel-shrink + .MuiOutlinedInput-root': {
                  marginTop: '8px',
                },
              },
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-focused': {
                  borderColor: colors.primary.main,
                  boxShadow: 'none',
                },
                '& .MuiSelect-select': {
                  paddingTop: `${spacing * 1.25}px`,
                  paddingBottom: `${spacing * 1.25}px`,
                },
                '&.MuiInputBase-multiline': {
                  padding: 0,
                },
              },
              notchedOutline: {
                borderColor: colors.divider,
                transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              },
              input: {
                padding: `${spacing * 1.25}px ${spacing * 1.75}px`,
                fontSize: '16px',
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                background: colors.background.paper,
                color: colors.text.secondary,
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '20px',
                maxWidth: 400,
                padding: `${spacing * 0.75}px ${spacing}px`,
                boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: colors.divider,
              },
              arrow: {
                color: colors.background.paper,
                '&:before': {
                  border: `1px solid ${colors.divider}`,
                },
              },
            },
            defaultProps: {
              enterTouchDelay: 0,
              leaveTouchDelay: 5000,
              placement: 'top',
              arrow: true,
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '24px',
                height: spacing * 3,
                transition: 'all 200ms ease-out',
              },
              label: {
                margin: 0,
                padding: `0px ${spacing}px`,
              },
              icon: {
                margin: `0px ${-1.5 * spacing}px 0px 0px`,
                padding: `0px ${spacing}px`,
              },
              clickable: {
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
            defaultProps: {
              color: 'primary',
            },
          },
          MuiDialog: {
            defaultProps: {
              PaperProps: {
                elevation: 0,
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                background: colors.background.paper,
                border: `1px solid ${colors.divider}`,
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: colors.divider,
              },
              root: {
                marginTop: spacing,
              },
            },
            defaultProps: {
              disableScrollLock: true,
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0rem',
                padding: `${spacing}px ${spacing * 1.5}px`,
                transition: 'all ease-out 150ms',
                '& path': {
                  transition: 'fill ease-out 150ms',
                },
                borderRadius: radius.sm,
                '&:hover': {
                  backgroundColor: colors.action.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: colors.action.selected,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: colors.action.selected,
                  },
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 32,
                  color: 'inherit',
                },
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              root: {
                marginLeft: -10,
                '&.MuiFormControlLabel-labelPlacementStart': {
                  marginRight: -10,
                  marginLeft: 0,
                },
              },
              label: {
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 500,
                color: colors.text.primary,
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                padding: spacing * 1.25,
                transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                //'&:hover': {
                //  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                //},
                //'&.Mui-checked': {
                //  '&:hover': {
                //    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                //  },
                //},
              },
            },
          },
          MuiRadio: {
            styleOverrides: {
              root: {
                padding: spacing * 1.25,
                transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                //'&:hover': {
                //  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                //},
                //'&.Mui-checked': {
                //  '&:hover': {
                //    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                //  },
                //},
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                padding: spacing,
                width: spacing * 6.5,
                height: spacing * 4,
                //'&:hover': {
                //  '& .MuiSwitch-switchBase': {
                //    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                //  },
                //  '& .MuiSwitch-switchBase.Mui-checked': {
                //    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                //  },
                //},
              },
              switchBase: {
                padding: spacing * 0.75,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-checked': {
                  transform: 'translateX(20px)',
                  '& + .MuiSwitch-track': {
                    opacity: 0.15,
                  },
                },
              },
              track: {
                borderRadius: radius.full,
                opacity: 0.15,
                backgroundColor: colors.text.primary,
              },
              thumb: {
                width: spacing * 2.25,
                height: spacing * 2.25,
                boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
              },
            },
          },
          MuiSkeleton: {
            styleOverrides: {
              root: {
                transform: 'none',
                backgroundColor: alpha(colors.action.active, colors.action.activatedOpacity),
              },
              text: {
                borderRadius: radius.sm,
                transform: 'scaleY(0.9)',
              },
              rounded: {
                borderRadius: radius.full,
              },
            },
          },
        },
      }),
    [colors],
  );
};
