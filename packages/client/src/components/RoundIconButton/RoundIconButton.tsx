import { IconButton, IconButtonProps, SxProps, Theme, alpha, styled } from '@mui/material';

export interface RoundIconButtonProps extends Omit<IconButtonProps, 'size'> {
  /** Custom styles for the button */
  sx?: SxProps<Theme>;
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
}

const RoundIconButtonRoot = styled(IconButton, {
  name: 'RoundIconButton',
})<RoundIconButtonProps>(({ theme, size = 'medium' }) => {
  const sizes = {
    small: {
      width: 24,
      height: 24,
      iconSize: 18,
    },
    medium: {
      width: 32,
      height: 32,
      iconSize: 20,
    },
    large: {
      width: 40,
      height: 40,
      iconSize: 24,
    },
  };

  const currentSize = sizes[size];

  return {
    width: currentSize.width,
    height: currentSize.height,
    padding: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    transition: 'all 300ms ease-out',
    '& svg': {
      width: currentSize.iconSize,
      height: currentSize.iconSize,
      marginLeft: size === 'medium' ? -2 : 0,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.04),
    },
  };
});

export function RoundIconButton({ size = 'medium', sx, ...otherProps }: RoundIconButtonProps) {
  return <RoundIconButtonRoot size={size} sx={sx} {...otherProps} />;
}
