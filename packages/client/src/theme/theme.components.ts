import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
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
  MuiLink: {
    defaultProps: {
      underline: 'none',
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:last-child td': {
          borderBottom: 0,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottomColor: theme.palette.divider,
        padding: '8px 16px',
      }),
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.default,
        '&.guideActive': {
          zIndex: 10001,
        },
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      color: 'primary',
    },
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
      root: ({ theme }) => ({
        border: 'none',
        boxShadow: 'none',
        backgroundImage: 'none',
        backgroundColor: theme.palette.background.paper,
      }),
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
      root: ({ theme }) => ({
        padding: spacing * 2,
        overflow: 'visible',
        boxShadow: 'none',
        background: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'border-color 200ms ease-out',
        borderRadius: radius.md,
      }),
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
        '&.Mui-disabled': {
          '& input, & textarea, & .MuiSelect-select': {
            color: theme.palette.text.disabled,
            WebkitTextFillColor: theme.palette.text.disabled,
          },
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
              borderWidth: 1,
            },
            backgroundColor: 'inherit',
          },
        },
        '&.Mui-readOnly': {
          '& input, & textarea': {
            cursor: 'default',
          },
          '&:hover, &.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
              borderWidth: 1,
            },
            backgroundColor: 'inherit',
          },
        },
      }),
    },
  },
  MuiFilledInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
        },
        '&.Mui-focused': {
          backgroundColor: theme.palette.background.paper,
        },
        '& input': {
          backgroundColor: 'transparent',
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
          },
        },
        '&::before, &::after': {
          display: 'none',
        },
      }),
      sizeSmall: {
        paddingTop: 0,
        paddingBottom: 0,
        '& input, & .MuiSelect-select': {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      size: 'small',
      IconComponent: KeyboardArrowDown,
    },
    styleOverrides: {
      icon: ({ theme }) => ({
        color: theme.palette.text.secondary,
        transition: 'transform 200ms ease-out',
      }),
      select: {
        textTransform: 'none',
      },
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
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
        height: 40,
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
        borderRadius: radius.md,
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
      root: {
        minWidth: 32,
        color: 'inherit',
      },
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
    defaultProps: {
      shrink: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        position: 'relative',
        transform: 'none',
        marginBottom: 6,
        '.MuiFormControl-root:has(.Mui-readOnly) &.Mui-focused': {
          color: theme.palette.text.secondary,
        },
      }),
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
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        backgroundColor: theme.palette.background.default,
        '&:hover': {
          backgroundColor: theme.palette.background.default,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.primary,
          },
        },
        '&.Mui-focused': {
          backgroundColor: theme.palette.background.default,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.secondary.main,
            borderWidth: 1,
          },
        },
        '& input': {
          backgroundColor: 'transparent',
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.default} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
          top: 0,
        },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '& .MuiOutlinedInput-notchedOutline legend': {
          display: 'none',
        },
      }),
    },
  },
  MuiBackdrop: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.text.primary, 0.25),
        backdropFilter: 'blur(2px)',
        '&.MuiBackdrop-invisible': {
          backgroundColor: 'transparent',
          backdropFilter: 'none',
        },
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        background: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: '20px',
        maxWidth: 400,
        padding: `${spacing * 0.75}px ${spacing}px`,
        boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.15)}`,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderRadius: radius.sm,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        '&.styled': {
          color: theme.palette.text.primary,
        },
        '& code': {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8125rem',
          backgroundColor: theme.palette.background.default,
          padding: '2px 6px',
          borderRadius: 4,
          color: theme.palette.text.primary,
          wordBreak: 'break-all',
        },
        '& pre': {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8125rem',
          backgroundColor: theme.palette.background.default,
          padding: '8px 12px',
          borderRadius: 6,
          margin: '8px 0',
          color: theme.palette.text.primary,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        },
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.background.paper,
        '&:before': {
          border: `1px solid ${theme.palette.divider}`,
        },
      }),
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
      paper: ({ theme }) => ({
        background: theme.palette.background.default,
        borderRadius: radius.xl,
      }),
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }),
      list: {
        padding: 6,
      },
      root: {
        '&.guideActive': {
          zIndex: 10001,
        },
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 40,
        borderRadius: radius.md,
        marginTop: 2,
        marginBottom: 2,
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          '&:hover': {
            backgroundColor: theme.palette.action.selected,
          },
        },
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
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
  MuiSwitch: {},
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
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: radius.sm,
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
