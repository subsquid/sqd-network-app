import { SquaredChip } from '@components/Chip';
import { HelpTooltip } from '@components/HelpTooltip';
import { Box, styled, Typography, type SxProps } from '@mui/material';

const CardHeader = styled(Box, {
  name: 'CardHeader',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  alignItems: 'flex-start',
}));

const CardTitle = styled(Box, {
  name: 'CardTitle',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  alignItems: 'start',
  flex: 1,
}));

export interface SectionHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tooltip?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  tooltip,
  action,
  sx,
}: SectionHeaderProps & { sx?: SxProps }) {
  const normalizedTitle = typeof title === 'string' ? <SquaredChip label={title} /> : title;
  const normalizedSubtitle =
    typeof subtitle === 'string' ? <Typography variant="body2">{subtitle}</Typography> : subtitle;

  const hasTitle = !!title || !!subtitle;

  return (
    <CardHeader sx={sx}>
      {hasTitle && (
        <CardTitle>
          {title && (
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {normalizedTitle}
              {tooltip && <HelpTooltip title={tooltip} />}
            </Box>
          )}
          {subtitle && <Box>{normalizedSubtitle}</Box>}
        </CardTitle>
      )}
      {action}
    </CardHeader>
  );
}
