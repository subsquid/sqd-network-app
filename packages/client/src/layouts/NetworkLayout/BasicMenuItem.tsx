import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import classnames from 'classnames';

export const BasicMenuItem = ({
  LeftIcon,
  RightIcon,
  label,
  onClick,
  disabled,
  hovered,
}: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => unknown;
  label: React.ReactNode;
  LeftIcon: any;
  RightIcon?: any;
  disabled?: boolean;
  hovered?: boolean;
}) => {
  return (
    <MenuItem
      className={classnames({
        hovered,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <ListItemIcon>
        <LeftIcon />
      </ListItemIcon>
      <Typography>{label}</Typography>
      {RightIcon ? <RightIcon sx={{ opacity: 0.4 }} /> : null}
    </MenuItem>
  );
};
