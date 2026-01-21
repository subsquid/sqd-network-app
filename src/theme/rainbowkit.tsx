import { useMemo } from 'react';

import { Theme, lightTheme } from '@rainbow-me/rainbowkit';
import { merge } from 'lodash-es';

import { PaletteType, useCreateTheme } from './theme';

export const useCreateRainbowKitTheme = (mode: PaletteType) => {
  const { palette, typography } = useCreateTheme(mode);

  return useMemo((): Theme => {
    return merge(lightTheme(), {
      blurs: {
        modalOverlay: 'blur(0.5px)',
      },
      colors: {
        accentColor: palette.text.secondary,
        accentColorForeground: palette.secondary.main,
        actionButtonBorder: 'transparent',
        actionButtonBorderMobile: 'transparent',
        actionButtonSecondaryBackground: palette.info.main,
        closeButton: palette.text.secondary,
        closeButtonBackground: 'transparent',
        error: palette.error.main,
        generalBorder: palette.divider,
        menuItemBackground: palette.action.hover,
        modalBackdrop: 'rgba(0, 0, 0, 0.5)',
        modalBackground: palette.background.default,
        modalBorder: palette.divider,
        modalText: palette.text.primary,
        modalTextSecondary: palette.text.secondary,
        profileActionHover: palette.action.hover,
        profileForeground: palette.background.paper,
        selectedOptionBorder: 'transparent',
      },
      fonts: {
        body: typography.fontFamily,
      },
      radii: {
        modal: '4px',
        modalMobile: '4px',
        actionButton: '360px',
      },
      shadows: {
        dialog: 'none',
      },
    } satisfies DeepPartial<Theme>);
  }, [palette, typography]);
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
