import { useRef } from 'react';

import { BuySqdIcon } from '@icons/BuySqdIcon.tsx';
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
  SxProps,
  Theme,
  Tooltip,
  styled,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { trpc } from '@api/trpc';
import { demoFeaturesEnabled } from '@hooks/demoFeaturesEnabled';
import { useWorkersChatUrl } from '@hooks/network/useWorkersChat';

interface NetworkMenuProps {
  onItemClick: () => void;
  collapsed?: boolean;
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
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

const BuySqdIconContainer = styled('div', {
  name: 'BuySqdIconContainer',
})(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
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
  textSx?: SxProps<Theme>;
  collapsed?: boolean;
}

export const Item = ({
  selected,
  path,
  target,
  label,
  disabled,
  LeftIcon,
  RightIcon,
  textSx,
  onClick,
  collapsed,
}: ItemProps) => {
  const startIcon = typeof LeftIcon === 'function' ? LeftIcon(selected) : LeftIcon;
  const endIcon = typeof RightIcon === 'function' ? RightIcon(selected) : RightIcon;

  const button = (
    <MenuListItem disablePadding>
      <MenuListItemButton
        component={Link}
        to={path}
        onClick={onClick}
        selected={selected}
        disabled={disabled}
        target={target}
        rel={target ? 'noreferrer' : undefined}
        aria-current={selected ? 'page' : undefined}
      >
        <MenuListItemIcon>{startIcon}</MenuListItemIcon>
        {!collapsed && (
          <ListItemText
            slotProps={{
              primary: {
                sx: textSx,
              },
            }}
            primary={label}
          />
        )}
        {!collapsed && endIcon && <MenuListItemSecondaryIcon>{endIcon}</MenuListItemSecondaryIcon>}
      </MenuListItemButton>
    </MenuListItem>
  );

  if (collapsed && label) {
    return (
      <Tooltip title={label} placement="right" arrow>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

export const NetworkMenu = ({ onItemClick, collapsed }: NetworkMenuProps) => {
  const { address } = useAccount();
  const { data: workersCount } = useQuery(
    trpc.worker.countMine.queryOptions({ address: address || '' }, { enabled: !!address }),
  );
  const isWorkerOperator = workersCount ? workersCount > 0 : false;
  const workersChatUrl = useWorkersChatUrl();
  const communityChatUrl = process.env.DISCORD_API_URL ?? 'https://discord.gg/subsquid';
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
        collapsed={collapsed}
      />
      <Item
        LeftIcon={active => (active ? <Savings /> : <SavingsOutlined />)}
        label="Assets"
        onClick={onItemClick}
        path="/assets"
        selected={activePath === '/assets'}
        collapsed={collapsed}
      />
      <Item
        LeftIcon={active => (active ? <Lan /> : <LanOutlined />)}
        label="Workers"
        onClick={onItemClick}
        path="/workers"
        selected={activePath === '/workers'}
        collapsed={collapsed}
      />
      {demoFeaturesEnabled() && (
        <Item
          LeftIcon={active => (active ? <AccountTree /> : <AccountTreeOutlined />)}
          label="Portals"
          onClick={onItemClick}
          path="/portals"
          selected={activePath === '/portals'}
          collapsed={collapsed}
        />
      )}
      {demoFeaturesEnabled() && (
        <Item
          LeftIcon={active => (active ? <PortalPool /> : <PortalPoolOutlined />)}
          label="Portal Pools"
          onClick={onItemClick}
          path="/portal-pools"
          selected={activePath === '/portal-pools'}
          collapsed={collapsed}
        />
      )}
      <Item
        LeftIcon={active => (active ? <BackHand /> : <BackHandOutlined />)}
        label="Delegations"
        onClick={onItemClick}
        path="/delegations"
        selected={activePath === '/delegations'}
        collapsed={collapsed}
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
      {isWorkerOperator && workersChatUrl && (
        <Item
          label="Operators Chat"
          path={workersChatUrl}
          target="_blank"
          LeftIcon={<SmsOutlined />}
          RightIcon={<ArrowOutwardOutlined />}
          onClick={onItemClick}
          selected={false}
          collapsed={collapsed}
        />
      )}
      <Item
        label="Community Chat"
        path={communityChatUrl}
        target="_blank"
        LeftIcon={<SmsOutlined />}
        RightIcon={<ArrowOutwardOutlined />}
        onClick={onItemClick}
        selected={false}
        collapsed={collapsed}
      />
      <Item
        label="Purchase SQD"
        path="https://1inch.com/swap?src=42161:USDC&dst=42161:0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1"
        target="_blank"
        textSx={{
          fontSize: '0.95rem',
        }}
        LeftIcon={
          <BuySqdIconContainer>
            <BuySqdIcon size={20} />
          </BuySqdIconContainer>
        }
        RightIcon={<ArrowOutwardOutlined />}
        onClick={onItemClick}
        selected={false}
        collapsed={collapsed}
      />
    </MenuList>
  );
};
