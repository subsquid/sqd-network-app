import React from 'react';

import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { Box, SxProps, Theme, Tooltip, styled } from '@mui/material';

import { CopyToClipboard } from '@components/CopyToClipboard';

export interface PeerIdProps {
  /** The peer ID to display */
  peerId: string;
  /** Whether to show the copy icon */
  showCopyIcon?: boolean;
  /** Whether to show the full peer ID on hover */
  showFullOnHover?: boolean;
  /** Number of characters to show at the start (default: 4) */
  startChars?: number;
  /** Number of characters to show at the end (default: 6) */
  endChars?: number;
  /** Custom styles for the container */
  sx?: SxProps<Theme>;
  /** Custom styles for the copy icon */
  copyIconSx?: SxProps<Theme>;
  /** Whether to validate the peer ID format */
  validate?: boolean;
  /** Custom class name */
  className?: string;
  /** Whether to show ellipsis (...) between truncated parts */
  showEllipsis?: boolean;
  /** Custom component to wrap the peer ID with (e.g., Link) */
  component?: React.ElementType;
  /** Props to pass to the wrapper component */
  componentProps?: Record<string, unknown>;
}

export interface PeerIdContainerProps {
  /** Whether the peer ID is being hovered */
  $isHovered?: boolean;
  /** Whether to show the copy icon */
  $showCopyIcon?: boolean;
}

const PeerIdContainer = styled(Box, {
  name: 'PeerIdContainer',
})<PeerIdContainerProps>(({ theme, $isHovered, $showCopyIcon }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 90,
  cursor: $showCopyIcon ? 'pointer' : 'default',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    opacity: $isHovered ? 0.8 : 1,
  },
}));

const CopyIconStyled = styled(CopyIcon)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(0.5),
}));

export function isValidPeerId(peerId: string): boolean {
  return /^[a-z1-9]{52}$/i.test(peerId);
}

export function shortPeerId(
  peerId: string,
  startChars: number = 4,
  endChars: number = 8,
  showEllipsis: boolean = true,
): string {
  if (peerId.length < startChars + endChars) {
    return peerId;
  }

  const start = peerId.slice(0, startChars);
  const end = peerId.slice(-endChars);
  return `${start}${showEllipsis ? '...' : ''}${end}`;
}

export function PeerId({
  peerId,
  showCopyIcon = true,
  showFullOnHover = true,
  startChars = 4,
  endChars = 6,
  sx,
  copyIconSx,
  validate = true,
  className,
  showEllipsis = true,
  component: Component = 'span',
  componentProps = {},
}: PeerIdProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  if (validate && !isValidPeerId(peerId)) {
  }

  const truncatedPeerId = shortPeerId(peerId, startChars, endChars, showEllipsis);
  const content = <Component {...componentProps}>{truncatedPeerId}</Component>;

  return (
    <PeerIdContainer
      className={className}
      sx={sx}
      $showCopyIcon={showCopyIcon}
      $isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showFullOnHover ? (
        <Tooltip title={peerId} placement="top">
          {content}
        </Tooltip>
      ) : (
        content
      )}
      {showCopyIcon && <CopyToClipboard text={peerId} />}
    </PeerIdContainer>
  );
}

// Re-export for backward compatibility
export { PeerIdContainer as PeerIdShort };
