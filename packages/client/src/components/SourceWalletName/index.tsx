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
  /** Use for avatar initials when `title` is not a plain string (e.g. includes chips). */
  avatarName?: string;
  sx?: SxProps;
}

/** Text used for avatar initials — never call .toString() on arbitrary React nodes. */
function avatarNameFromProps(
  title: React.ReactNode,
  avatarValue: string | undefined,
  subtitle: React.ReactNode,
  avatarName: string | undefined,
): string {
  if (avatarName !== undefined) {
    return avatarName;
  }
  if (typeof title === 'string' || typeof title === 'number') {
    return String(title);
  }
  if (avatarValue) {
    return avatarValue;
  }
  if (typeof subtitle === 'string' || typeof subtitle === 'number') {
    return String(subtitle);
  }
  return '';
}

export function NameWithAvatar({
  title,
  subtitle,
  avatarValue,
  avatarName,
  sx,
}: NameWithAvatarProps) {
  const nameForAvatar = avatarNameFromProps(title, avatarValue, subtitle, avatarName);
  const colorDiscriminator = avatarValue || nameForAvatar;

  return (
    <Box sx={{ width: { xs: 200, sm: 240 }, ...sx }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar name={nameForAvatar} colorDiscriminator={colorDiscriminator} />
        <Box sx={{ overflow: 'hidden' }}>
          <Name>{title}</Name>
          <Typography variant="caption">{subtitle}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
