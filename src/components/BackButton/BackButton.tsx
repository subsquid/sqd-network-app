import React from 'react';

import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import { SxProps, Theme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { RoundIconButton } from '@components/RoundIconButton';

export interface BackButtonProps {
  /** Optional path to navigate to when there's no history */
  path?: string;
  /** Custom styles for the button */
  sx?: SxProps<Theme>;
  /** Custom icon component to use instead of the default ArrowBack */
  icon?: React.ReactNode;
  /** Custom click handler that overrides the default navigation behavior */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Whether to replace the current history entry instead of adding a new one */
  replace?: boolean;
  /** Optional state to pass to the navigation */
  state?: unknown;
}

export function BackButton({
  sx,
  icon = <ArrowBack />,
  onClick,
  ariaLabel = 'Go back',
  replace = true,
  state,
  path,
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
      return;
    }

    if (path) {
      return navigate(path, { replace, state });
    }

    if (location.key !== 'default') {
      return navigate(-1);
    }

    return navigate('/', { replace, state });
  };

  return (
    <RoundIconButton sx={sx} onClick={handleClick} aria-label={ariaLabel}>
      {icon}
    </RoundIconButton>
  );
}
