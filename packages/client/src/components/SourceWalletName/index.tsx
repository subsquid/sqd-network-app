import { Box, Stack, SxProps, Typography, styled } from '@mui/material';

import { Avatar } from '@components/Avatar';

const Name = styled(Box, {
  name: 'Name',
})(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export interface NameWithAvatarProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  avatarValue?: string;
  sx?: SxProps;
}

export function NameWithAvatar({ title, subtitle, avatarValue, sx }: NameWithAvatarProps) {
  return (
    <Box sx={{ width: { xs: 200, sm: 240 }, ...sx }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar name={title?.toString() || ''} colorDiscriminator={avatarValue || ''} />
        <Box sx={{ overflow: 'hidden' }}>
          <Name>{title}</Name>
          <Typography variant="caption">{subtitle}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
