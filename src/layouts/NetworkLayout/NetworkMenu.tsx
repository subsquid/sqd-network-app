import { useIsWorkerOperator } from '@api/subsquid-network-squid';
import { demoFeaturesEnabled } from '@hooks/demoFeaturesEnabled';
import {
  AccountTree,
  AccountTreeOutlined,
  ArrowOutwardOutlined,
  BackHand,
  BackHandOutlined,
  Dashboard,
  DashboardOutlined,
  Lan,
  LanOutlined,
  LocalAtm as PortalPool,
  LocalAtmOutlined as PortalPoolOutlined,
  Savings,
  SavingsOutlined,
  SmsOutlined,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import { useWorkersChatUrl } from '@network/useWorkersChat';
import React, { useRef } from 'react';
import { Link, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';

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
  height: 42,
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
  selected: boolean;
  path: string;
  target?: string;
  disabled?: boolean;
  LeftIcon: React.ReactNode | ((active: boolean) => React.ReactNode);
  RightIcon?: React.ReactNode | ((active: boolean) => React.ReactNode);
  label?: string;
  onClick?: () => void;
}

export const Item = ({
  selected,
  path,
  target,
  label,
  disabled,
  LeftIcon,
  RightIcon,
  onClick,
}: ItemProps) => {
  const startIcon = typeof LeftIcon === 'function' ? LeftIcon(selected) : LeftIcon;
  const endIcon = typeof RightIcon === 'function' ? RightIcon(selected) : RightIcon;

  return (
    <MenuListItem disablePadding>
      <MenuListItemButton
        component={Link}
        to={path}
        onClick={onClick}
        selected={selected}
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
  const location = useLocation();
  const previousPathRef = useRef<string>('/dashboard');

  // Find which menu path matches the current location
  const paths = ['/dashboard', '/assets', '/workers', '/delegations'];
  if (demoFeaturesEnabled()) {
    paths.push('/portals');
    paths.push('/portal-pools');
  }

  const selectedPath = paths.find(path => location.pathname.startsWith(path));

  // Track the last valid path for fallback
  if (selectedPath) {
    previousPathRef.current = selectedPath;
  }

  // Use current path or fallback to previous (or dashboard)
  const activePath = selectedPath || previousPathRef.current;

  return (
    <MenuList>
      <Item
        LeftIcon={active => (active ? <Dashboard /> : <DashboardOutlined />)}
        label="Dashboard"
        onClick={onItemClick}
        path="/dashboard"
        selected={activePath === '/dashboard'}
      />
      <Item
        LeftIcon={active => (active ? <Savings /> : <SavingsOutlined />)}
        label="Assets"
        onClick={onItemClick}
        path="/assets"
        selected={activePath === '/assets'}
      />
      <Item
        LeftIcon={active => (active ? <Lan /> : <LanOutlined />)}
        label="Workers"
        onClick={onItemClick}
        path="/workers"
        selected={activePath === '/workers'}
      />
      {demoFeaturesEnabled() && (
        <Item
          LeftIcon={active => (active ? <AccountTree /> : <AccountTreeOutlined />)}
          label="Portals"
          onClick={onItemClick}
          path="/portals"
          selected={activePath === '/portals'}
        />
      )}
      {demoFeaturesEnabled() && (
        <Item
          LeftIcon={active => (active ? <PortalPool /> : <PortalPoolOutlined />)}
          label="Portal Pools"
          onClick={onItemClick}
          path="/portal-pools"
          selected={activePath === '/portal-pools'}
        />
      )}
      <Item
        LeftIcon={active => (active ? <BackHand /> : <BackHandOutlined />)}
        label="Delegations"
        onClick={onItemClick}
        path="/delegations"
        selected={activePath === '/delegations'}
      />
      {/* <Item
        LeftIcon={active => (active ? <Sensors /> : <SensorsOutlined />)}
        label="Pools"
        onClick={onItemClick}
        path="/pools"
        selected={activePath === '/pools'}
      /> */}
      {/* {demoFeaturesEnabled() && (
        <Item
          LeftIcon={active => (active ? <SensorDoor /> : <SensorDoorOutlined />)}
          label="Portals"
          onClick={onItemClick}
          path="/portals"
          selected={activePath === '/portals'}
        />
      )} */}
      <MenuSpacer />
      {isWorkerOperator && (
        <Item
          label="Operators Chat"
          path={workersChatUrl || '/null'}
          target="_blank"
          LeftIcon={<SmsOutlined />}
          RightIcon={<ArrowOutwardOutlined />}
          onClick={onItemClick}
          selected={false}
        />
      )}
      <Item
        label="Community Chat"
        path={process.env.DISCORD_API_URL || '/null'}
        target="_blank"
        LeftIcon={<SmsOutlined />}
        RightIcon={<ArrowOutwardOutlined />}
        onClick={onItemClick}
        selected={false}
      />
    </MenuList>
  );
};
