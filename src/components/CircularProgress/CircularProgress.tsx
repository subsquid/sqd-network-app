import {
  Box,
  CircularProgress as MaterialCircularProgress,
  Stack,
  Theme,
  styled,
} from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';

export type CircularProgressColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'error'
  | 'inherit'
  | 'warning';

export interface CircularProgressProps {
  /** The progress value between 0 and 100 */
  value?: number;
  /** The color of the progress indicator */
  color?: CircularProgressColor;
  /** Whether to hide the progress bar */
  hideProgressBar?: boolean;
  /** The size of the progress indicator in pixels */
  size?: number;
  /** The thickness of the progress indicator */
  thickness?: number;
  /** Whether to show the progress in indeterminate state */
  indeterminate?: boolean;
  /** Custom styles for the progress indicator */
  sx?: SxProps<Theme>;
  /** Custom styles for the percentage text */
  textSx?: SxProps<Theme>;
  /** Whether to show the percentage text */
  showText?: boolean;
  /** Custom text formatter function */
  textFormatter?: (value: number) => string;
}

const Percent = styled('div')(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.75rem',
  lineHeight: 1,
  '&.secondary': {
    color: theme.palette.secondary.contrastText,
  },
  '&.success': {
    color: theme.palette.success.contrastText,
  },
  '&.info': {
    color: theme.palette.info.contrastText,
  },
  '&.error': {
    color: theme.palette.error.dark,
  },
  '&.warning': {
    color: theme.palette.warning.contrastText,
  },
}));

const Progress = styled(MaterialCircularProgress)(({ theme }) => ({
  '&.background': {
    color: theme.palette.background.default,
  },
  '&.secondary': {
    color: theme.palette.secondary.contrastText,
  },
  '&.success': {
    color: theme.palette.success.contrastText,
  },
  '&.info': {
    color: theme.palette.info.contrastText,
  },
  '&.warning': {
    color: theme.palette.warning.contrastText,
  },
  '&.error': {
    color: theme.palette.error.contrastText,
  },
}));

export function CircularProgress({
  value = 0,
  color = 'primary',
  hideProgressBar = false,
  size = 24,
  thickness = 7.5,
  indeterminate = false,
  sx,
  textSx,
  showText = true,
  textFormatter = value => `${value}%`,
}: CircularProgressProps) {
  const progressValue = Math.min(Math.max(value, 0), 100);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {!hideProgressBar && (
        <Box sx={{ position: 'relative', ...sx }}>
          {!indeterminate && (
            <Progress
              className="background"
              size={size}
              thickness={thickness}
              variant="determinate"
              value={100}
            />
          )}
          <Progress
            className={color}
            sx={{
              position: 'absolute',
              left: 0,
            }}
            size={size}
            thickness={thickness}
            variant={indeterminate ? 'indeterminate' : 'determinate'}
            value={progressValue}
          />
        </Box>
      )}
      {showText && !indeterminate && (
        <Percent className={color} sx={textSx}>
          {textFormatter(progressValue)}
        </Percent>
      )}
    </Stack>
  );
}
