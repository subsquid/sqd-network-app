import { useMemo } from 'react';

import { Box, Avatar as MaterialAvatar, SxProps, Theme, styled } from '@mui/material';

interface AvatarProps {
  /** The name to display in the avatar */
  name: string;
  /** Optional discriminator for color generation (defaults to name) */
  colorDiscriminator?: string;
  /** Size of the avatar in pixels */
  size?: number;
  /** Variant of the avatar shape */
  variant?: 'circular' | 'rounded' | 'square';
  /** Optional image URL to display */
  src?: string;
  /** Optional online status indicator */
  online?: boolean;
  /** Custom styles for the avatar */
  sx?: SxProps<Theme>;
  /** Custom styles for the online indicator */
  onlineIndicatorSx?: SxProps<Theme>;
  /** Number of characters to show from the name (default: 2) */
  charsToShow?: number;
}

const OnlineIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 2,
  bottom: 4,
  width: 12,
  height: 12,
  borderRadius: '50%',
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: theme.palette.success.main,
}));

function stringToColor(string: string): string {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const Avatar = ({
  name,
  colorDiscriminator = name,
  size = 40,
  variant = 'circular',
  src,
  online,
  sx,
  onlineIndicatorSx,
  charsToShow = 2,
}: AvatarProps) => {
  const color = useMemo(() => stringToColor(colorDiscriminator), [colorDiscriminator]);

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, charsToShow).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box
      position="relative"
      sx={{
        fontSize: '20px',
        lineHeight: '20px',
        fontWeight: 300,
        textAlign: 'center',
        ...sx,
      }}
    >
      <MaterialAvatar
        variant={variant}
        src={src}
        sx={{
          bgcolor: color,
          width: size,
          height: size,
          color: 'white',
          fontSize: size * 0.4,
        }}
      >
        {!src && getInitials(name)}
      </MaterialAvatar>
      {typeof online === 'boolean' && (
        <OnlineIndicator sx={onlineIndicatorSx} style={{ display: online ? 'block' : 'none' }} />
      )}
    </Box>
  );
};
