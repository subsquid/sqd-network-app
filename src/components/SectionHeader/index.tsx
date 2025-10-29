import { SquaredChip } from '@components/Chip';
import { Box, styled, Typography, type SxProps } from '@mui/material';

const CardHeader = styled(Box, {
  name: 'CardHeader',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
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
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
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
          {title && <Box sx={{ width: '100%' }}>{normalizedTitle}</Box>}
          {subtitle && <Box>{normalizedSubtitle}</Box>}
        </CardTitle>
      )}
      {action}
    </CardHeader>
  );
}
