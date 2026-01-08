import '@rainbow-me/rainbowkit/styles.css';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  AppBar as AppBarMaterial,
  IconButton,
  styled,
  Drawer,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import classnames from 'classnames';
import { Outlet } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

import { Logo } from '@components/Logo';
import { useBannerHeight } from '@components/TopBanner';
import { MenuIcon } from '@icons/MenuIcon';
import { useAccount } from '@network/useAccount';
import { getChain, getSubsquidNetwork } from '@network/useSubsquidNetwork';

import { NetworkMenu } from './NetworkMenu';
import { UserMenu } from './UserMenu';
import { useTokenPrice } from '@api/price';
import { useContracts } from '@network/useContracts';
import { dollarFormatter } from '@lib/formatters/formatters';

const APP_BAR_HEIGHT = 60;
const SIDEBAR_WIDTH = 232;

const Main = styled('div', {
  name: 'Main',
})(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
}));

const AppBar = styled(AppBarMaterial, {
  name: 'AppBar',
  shouldForwardProp: prop => prop !== 'bannerHeight',
})<{ bannerHeight: number }>(({ theme, bannerHeight }) => ({
  position: 'fixed',
  width: '100%',
  marginLeft: 0,
  top: bannerHeight,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    marginLeft: SIDEBAR_WIDTH,
  },
}));

const AppToolbar = styled('div', {
  name: 'AppToolbar',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  height: APP_BAR_HEIGHT,
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 3),
  },
}));

const UserMenuContainer = styled('div', {
  name: 'UserMenuContainer',
})(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const NavContainer = styled('nav', {
  name: 'NavContainer',
})(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
  },
}));

const Sidebar = styled(Drawer, {
  name: 'Sidebar',
  shouldForwardProp: prop => prop !== 'bannerHeight',
})<{ bannerHeight: number }>(({ theme, bannerHeight }) => ({
  '& .MuiListItemButton-root': {
    color: theme.palette.primary.contrastText,

    '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
      color: 'inherit',
    },
  },

  '& .MuiListItemButton-root.Mui-selected': {
    '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
      color: theme.palette.text.primary,
    },
  },

  '& .MuiDrawer-paper': {
    background: theme.palette.primary.main,
    border: 'none',
    padding: theme.spacing(0, 1, 2, 1),
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    top: bannerHeight,
    height: `calc(100vh - ${bannerHeight}px)`,
  },
}));

const SidebarLogo = styled('div', {
  name: 'SidebarLogo',
})(({ theme }) => ({
  padding: theme.spacing(2, 1),
  marginBottom: theme.spacing(1),
}));

const MenuButton = styled(IconButton, {
  name: 'MenuButton',
})(({ theme }) => ({
  display: 'none',

  [theme.breakpoints.down('lg')]: {
    display: 'inline-block',
  },

  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.short,
  }),

  '&.open': {
    transform: 'rotateZ(90deg)',
  },

  '& path': {
    stroke: theme.palette.primary.contrastText,
  },
}));

const AppBarSpacer = styled('div', {
  name: 'AppBarSpacer',
})<{ bannerHeight: number }>(({ bannerHeight }) => ({
  height: APP_BAR_HEIGHT + bannerHeight,
  minHeight: APP_BAR_HEIGHT + bannerHeight,
  flexShrink: 0,
}));

const MainContent = styled('main', {
  name: 'MainContent',
})(({ theme }) => ({
  flexGrow: 1,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  width: '100%',
  minHeight: '100vh',

  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(10),
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  },
}));

export const NetworkLayout = ({
  children,
  stretchContent = true,
}: PropsWithChildren<{
  stretchContent?: boolean;
}>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const { isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const network = getSubsquidNetwork();
  const bannerHeight = useBannerHeight();
  const { SQD, SQD_TOKEN } = useContracts();
  const price = useTokenPrice({ address: SQD });

  useEffect(() => {
    if (!isConnected) return;
    if (chain?.id === getChain(network).id) return;
    disconnect();
  }, [isConnected, chain?.id, network, disconnect]);

  // Close mobile menu when switching to desktop view
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setisMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  const handleMenuToggle = () => {
    setisMenuOpen(prev => !prev);
  };

  const handleMenuClose = () => {
    setisMenuOpen(false);
  };

  const drawer = (
    <>
      <SidebarLogo>
        <Logo />
      </SidebarLogo>
      <NetworkMenu onItemClick={handleMenuClose} />
    </>
  );

  return (
    <Main>
      <AppBar bannerHeight={bannerHeight} elevation={0}>
        <AppToolbar>
          <MenuButton
            className={classnames({ open: isMenuOpen })}
            onClick={handleMenuToggle}
            aria-label="toggle menu"
          >
            <MenuIcon />
          </MenuButton>
          <UserMenuContainer>
            <Typography variant="body2">
              {SQD_TOKEN}: {dollarFormatter(price.data || 0)}
            </Typography>
            <UserMenu />
          </UserMenuContainer>
        </AppToolbar>
      </AppBar>

      <NavContainer aria-label="navigation menu">
        {isMobile ? (
          // Mobile drawer
          <Sidebar
            variant="temporary"
            open={isMenuOpen}
            onClose={handleMenuClose}
            bannerHeight={bannerHeight}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
          >
            {drawer}
          </Sidebar>
        ) : (
          // Desktop drawer
          <Sidebar variant="permanent" open bannerHeight={bannerHeight}>
            {drawer}
          </Sidebar>
        )}
      </NavContainer>

      <MainContent>
        <AppBarSpacer bannerHeight={bannerHeight} />
        {children}
        <Outlet />
      </MainContent>
    </Main>
  );
};
