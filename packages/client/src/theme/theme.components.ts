import { Components, Theme, alpha } from '@mui/material';

import { NetworkLightTheme } from './network-light';

const colors = NetworkLightTheme;

const spacing = 8;

const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 360,
} as const;

export const themeComponents: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        background: colors.background?.default,
        minWidth: 350,
      },
      a: {
        textDecoration: 'none',
        transition: 'color 200ms ease',
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
          background: colors.secondary.main,
          borderRadius: radius.sm,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: colors.text.secondary,
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${colors.divider}`,
        background: colors.background.default,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: radius.full,
        boxShadow: 'none',
        '&:hover, &:active, &:focus': {
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
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: colors.text.secondary,
        '&:hover': {
          backgroundColor: colors.action.hover,
        },
      },
    },
    defaultProps: {
      color: 'default',
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        border: 'none',
        boxShadow: 'none',
        backgroundColor: colors.background.paper,
      },
    },
    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          backgroundColor: colors.background.default,
          border: `1px solid ${colors.divider}`,
        },
      },
    ],
    defaultProps: {
      elevation: 0,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        padding: spacing * 2,
        overflow: 'visible',
        boxShadow: 'none',
        background: colors.background.default,
        border: `1px solid ${colors.divider}`,
        transition: 'border-color 200ms ease-out',
        borderRadius: radius.md,
      },
    },
    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          border: `1px solid ${colors.divider}`,
        },
      },
      {
        props: { variant: 'elevation' },
        style: {
          border: 'none',
        },
      },
    ],
    defaultProps: {
      elevation: 0,
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        // Remove underline decorators (standard / filled variants)
        '&:before, &:after': { display: 'none' },
        borderRadius: theme.shape.borderRadius,
        height: 'auto',
        transition: 'border-color 200ms ease-out, background-color 200ms ease-out',
      }),
      input: {
        padding: `${spacing * 1.25}px ${spacing * 1.75}px`,
        fontSize: '16px',
        lineHeight: '24px',
        '&::placeholder': { opacity: 0.7 },
        '&:focus::placeholder': { opacity: 0.5 },
      },
      adornedStart: { paddingLeft: spacing },
      adornedEnd: { paddingRight: spacing },
      multiline: { padding: 0 },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.paper,
        // MUI default FilledInput injects .MuiFilledInput-root::before (underline) after
        // the MuiInputBase theme override, so the underline reset must live here to win.
        '&:before, &:after': { display: 'none' },
        // Prevent MUI from changing background on interaction
        '&:hover, &.Mui-focused, &.Mui-error': {
          backgroundColor: colors.background.paper,
        },
        '&.Mui-disabled': {
          backgroundColor: colors.background.paper,
          opacity: 0.6,
        },
        '&.MuiInputBase-sizeSmall': { height: '36px' },
      },
      input: {
        // MUI default .MuiFilledInput-input sets padding: 25px 12px 8px, which is
        // injected after the MuiInputBase theme override and overrides it. Repeating
        // the override here (same class, theme > default) restores our intended values.
        backgroundColor: 'transparent',
        padding: `${spacing * 1.25}px ${spacing * 1.75}px`,
        fontSize: '16px',
        lineHeight: '24px',
        '&::placeholder': { opacity: 0.7 },
        '&:focus::placeholder': { opacity: 0.5 },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      icon: { color: colors.text.secondary },
      select: ({ ownerState }) => ({
        ...(ownerState.variant === 'standard' && {
          backgroundColor: colors.background.default,
          borderRadius: radius.md,
          padding: `${spacing}px ${spacing * 1.5}px`,
          fontSize: '14px',
          letterSpacing: 0,
          transition: 'background-color 200ms ease-out',
          '&:hover': { backgroundColor: colors.divider },
          '&.Mui-focused': { backgroundColor: colors.background.default },
        }),
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.paper,
        borderRadius: radius.md,
        '& .MuiToggleButtonGroup-grouped': {
          margin: 0,
        },
        height: 36,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        color: colors.text.secondary,
        textTransform: 'none',
        border: 'none',
        '&.Mui-selected': {
          backgroundColor: colors.divider,
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: colors.divider,
          },
        },
        '&.Mui-disabled': {
          border: 'none',
        },
        minWidth: '64px',
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          backgroundColor: colors.divider,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.divider,
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        transition: theme.transitions.create('color', {
          duration: theme.transitions.duration.shorter,
        }),
      }),
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& label.Mui-focused': {
          fontWeight: 600,
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginLeft: 0,
        marginRight: 0,
        fontSize: '12px',
        lineHeight: '16px',
        marginTop: 4,
        transition: 'color 200ms ease-out',
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
        backgroundColor: colors.background.default,
        // Override MUI default 2px focused border — keep 1px everywhere
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.secondary.main,
          borderWidth: '1px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.text.secondary,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.error.main,
        },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderStyle: 'dashed',
        },
        '& .MuiSelect-select': {
          paddingTop: `${spacing * 1.25}px`,
          paddingBottom: `${spacing * 1.25}px`,
        },
        '&.MuiInputBase-multiline': { padding: 0 },
        '&.MuiInputBase-sizeSmall': {
          height: '36px',
          '& input': {
            padding: `${spacing * 0.5}px ${spacing * 1.5}px`,
            fontSize: '14px',
          },
        },
      },
      notchedOutline: {
        borderColor: colors.divider,
        borderWidth: '1px',
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
        boxShadow: `0px 2px 4px ${alpha(colors.common.black, 0.15)}`,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: colors.divider,
        borderRadius: radius.sm,
        '&.styled': {
          color: colors.text.primary,
        },
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
        transition: 'background-color 200ms ease-out, color 200ms ease-out',
        '&.squared': {
          borderRadius: radius.sm,
          fontSize: 16,
          fontWeight: 600,
          '& .MuiChip-label': {
            padding: `0 ${spacing * 0.5}px`,
          },
        },
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
      slotProps: {
        paper: { elevation: 0 },
      },
    },
    styleOverrides: {
      paper: {
        background: colors.background.default,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        background: colors.background.default,
        border: `1px solid ${colors.divider}`,
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
        transition: 'background-color 150ms ease-out',
        '& path': {
          transition: 'fill ease-out 150ms',
        },
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
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        padding: spacing * 1.25,
        transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        padding: spacing,
        width: spacing * 6.5,
        height: spacing * 4,
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
        boxShadow: `0px 1px 2px ${alpha(colors.common.black, 0.1)}`,
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
  MuiTabs: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${colors.divider}`,
        minHeight: 42,
      },
      indicator: {
        height: 3,
        borderRadius: '2px 2px 0 0',
        backgroundColor: colors.divider,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body1,
        textTransform: 'none',
        padding: `${spacing * 1.25}px ${spacing * 2.5}px`,
        borderRadius: `${radius.md}px ${radius.md}px 0 0`,
        '&:hover': {
          color: colors.text.primary,
          backgroundColor: colors.action.hover,
        },
        '&.Mui-selected': {
          color: colors.text.primary,
          fontWeight: 500,
        },
        minHeight: 42,
      }),
    },
  },
};
