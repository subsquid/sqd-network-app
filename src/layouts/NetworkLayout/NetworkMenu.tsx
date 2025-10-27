import React from 'react';

import {
  ArrowOutwardOutlined,
  BackHand,
  BackHandOutlined,
  Dashboard,
  DashboardOutlined,
  Lan,
  LanOutlined,
  Savings,
  SavingsOutlined,
  SensorDoor,
  SensorDoorOutlined,
  SmsOutlined,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  ListItemButtonProps,
} from '@mui/material';
import { Link, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';

import { useIsWorkerOperator } from '@api/subsquid-network-squid';
import { demoFeaturesEnabled } from '@hooks/demoFeaturesEnabled';
import { useWorkersChatUrl } from '@network/useWorkersChat';

interface NetworkMenuProps {
  onItemClick: () => void;
}

const MenuList = styled(List, {
  name: 'MenuList',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: 0,
  gap: theme.spacing(0.25),
}));

const MenuSpacer = styled('div', {
  name: 'MenuSpacer',
})(() => ({
  flex: 1,
}));

const MenuListItem = styled(ListItem, {
  name: 'MenuListItem',
})(() => ({
  padding: 0,
}));

const MenuListItemButton = styled(ListItemButton, {
  name: 'MenuListItemButton',
})<ListItemButtonProps<typeof Link, RouterLinkProps>>(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
}));

const MenuListItemIcon = styled(ListItemIcon, {
  name: 'MenuListItemIcon',
})(({ theme }) => ({
  minWidth: 'auto',
  marginRight: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const MenuListItemSecondaryIcon = styled(ListItemIcon, {
  name: 'MenuListItemSecondaryIcon',
})(({ theme }) => ({
  minWidth: 'auto',
  justifyContent: 'flex-end',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

interface ItemProps {
  forceActive?: boolean;
  forceInactive?: boolean;
  path: string;
  target?: string;
  disabled?: boolean;
  LeftIcon: React.ReactNode | ((active: boolean) => React.ReactNode);
  RightIcon?: React.ReactNode | ((active: boolean) => React.ReactNode);
  label?: string;
  onClick?: () => void;
}

export const Item = ({
  forceActive,
  forceInactive,
  path,
  target,
  label,
  disabled,
  LeftIcon,
  RightIcon,
  onClick,
}: ItemProps) => {
  const location = useLocation();
  const active = forceActive || (!forceInactive && location.pathname.startsWith(path));

  const startIcon = typeof LeftIcon === 'function' ? LeftIcon(active) : LeftIcon;
  const endIcon = typeof RightIcon === 'function' ? RightIcon(active) : RightIcon;

  return (
    <MenuListItem disablePadding>
      <MenuListItemButton
        component={Link}
        to={path}
        onClick={onClick}
        selected={active}
        disabled={disabled}
        target={target}
        rel={target ? 'noreferrer' : undefined}
      >
        <MenuListItemIcon>{startIcon}</MenuListItemIcon>
        <ListItemText primary={label} />
        {endIcon && <MenuListItemSecondaryIcon>{endIcon}</MenuListItemSecondaryIcon>}
      </MenuListItemButton>
    </MenuListItem>
  );
};

export const NetworkMenu = ({ onItemClick }: NetworkMenuProps) => {
  const { isWorkerOperator } = useIsWorkerOperator();
  const workersChatUrl = useWorkersChatUrl();

  return (
    <MenuList>
      <Item
        LeftIcon={active => (active ? <Dashboard /> : <DashboardOutlined />)}
        label="Dashboard"
        onClick={onItemClick}
        path="/dashboard"
      />
      <Item
        LeftIcon={active => (active ? <Savings /> : <SavingsOutlined />)}
        label="Assets"
        onClick={onItemClick}
        path="/assets"
      />
      <Item
        LeftIcon={active => (active ? <Lan /> : <LanOutlined />)}
        label="Workers"
        onClick={onItemClick}
        path="/workers"
      />
      <Item
        LeftIcon={active => (active ? <BackHand /> : <BackHandOutlined />)}
        label="Delegations"
        onClick={onItemClick}
        path="/delegations"
      />
      {demoFeaturesEnabled() && (
        <Item
          LeftIcon={active => (active ? <SensorDoor /> : <SensorDoorOutlined />)}
          label="Portals"
          onClick={onItemClick}
          path="/portals"
        />
      )}
      <MenuSpacer />
      {isWorkerOperator && (
        <Item
          label="Operators Chat"
          path={workersChatUrl || '/null'}
          target="_blank"
          LeftIcon={<SmsOutlined />}
          RightIcon={<ArrowOutwardOutlined />}
          onClick={onItemClick}
        />
      )}
      <Item
        label="Community Chat"
        path={process.env.DISCORD_API_URL || '/null'}
        target="_blank"
        LeftIcon={<SmsOutlined />}
        RightIcon={<ArrowOutwardOutlined />}
        onClick={onItemClick}
      />
    </MenuList>
  );
};
