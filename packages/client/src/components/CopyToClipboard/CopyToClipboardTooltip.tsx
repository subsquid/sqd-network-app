import CheckIcon from '@mui/icons-material/Check';
import { Stack, Tooltip } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';

export interface CopyToClipboardTooltipProps {
  children: React.ReactElement;
  copied: boolean;
  setCopied: (copied: boolean) => void;
  tooltipText?: string;
  copiedTooltipText?: string;
  sx?: SxProps<Theme>;
}

export const CopyToClipboardTooltip = ({
  children,
  copied,
  setCopied,
  tooltipText = 'Copy',
  copiedTooltipText = 'Copied',
  sx,
}: CopyToClipboardTooltipProps) => {
  return (
    <Tooltip
      title={
        <Box sx={sx}>
          {copied ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box>{copiedTooltipText}</Box>
              <CheckIcon sx={{ width: 16, height: 16 }} />
            </Stack>
          ) : (
            <Box>{tooltipText}</Box>
          )}
        </Box>
      }
      arrow
      placement="top"
      onClose={() => {
        setTimeout(() => setCopied(false), 400);
      }}
    >
      {children}
    </Tooltip>
  );
};
