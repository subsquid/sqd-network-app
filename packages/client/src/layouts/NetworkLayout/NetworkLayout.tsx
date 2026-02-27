import '@rainbow-me/rainbowkit/styles.css';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  AppBar as AppBarMaterial,
  Drawer,
  IconButton,
  Typography,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';

import { trpc } from '@api/trpc';
import { Logo } from '@components/Logo';
import { useBannerHeight } from '@components/TopBanner';
import { useContracts } from '@hooks/network/useContracts';
import { getChain, getSubsquidNetwork } from '@hooks/network/useSubsquidNetwork';
import { localStorageBoolSerializer, useLocalStorageState } from '@hooks/useLocalStorageState';
import { dollarFormatter } from '@lib/formatters/formatters';

import { NetworkMenu } from './NetworkMenu';
import { UserMenu } from './UserMenu';

const APP_BAR_HEIGHT = 60;
const SIDEBAR_WIDTH = 232;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const Main = styled('div', {
  name: 'Main',
})(() => ({
  display: 'flex',
  minHeight: '100vh',
}));

const SkipLink = styled('a', {
  name: 'SkipLink',
})(({ theme }) => ({
  position: 'absolute',
  left: '-9999px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  zIndex: theme.zIndex.tooltip + 1,
  '&:focus-visible': {
    position: 'fixed',
    top: theme.spacing(1),
    left: theme.spacing(1),
    width: 'auto',
    height: 'auto',
    padding: theme.spacing(1, 2),
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.primary.main}`,
    textDecoration: 'none',
    fontWeight: 600,
  },
}));

const AppBar = styled(AppBarMaterial, {
  name: 'AppBar',
  shouldForwardProp: prop => prop !== 'bannerHeight' && prop !== 'sidebarWidth',
})<{ bannerHeight: number; sidebarWidth: number }>(({ theme, bannerHeight, sidebarWidth }) => ({
  position: 'fixed',
  top: bannerHeight,
  width: `calc(100% - ${sidebarWidth}px)`,
  marginLeft: sidebarWidth,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
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
  shouldForwardProp: prop => prop !== 'sidebarWidth',
})<{ sidebarWidth: number }>(({ sidebarWidth }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

const Sidebar = styled(Drawer, {
  name: 'Sidebar',
  shouldForwardProp: prop => prop !== 'bannerHeight' && prop !== 'sidebarWidth',
})<{ bannerHeight: number; sidebarWidth: number }>(({ theme, bannerHeight, sidebarWidth }) => ({
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
    width: sidebarWidth,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    top: bannerHeight,
    height: `calc(100vh - ${bannerHeight}px)`,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
}));

const SidebarLogo = styled('div', {
  name: 'SidebarLogo',
})(({ theme }) => ({
  padding: theme.spacing(2, 0, 2, 1),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: APP_BAR_HEIGHT,
  flexShrink: 0,
}));

const CollapseButton = styled(IconButton, {
  name: 'CollapseButton',
})(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5),
  flexShrink: 0,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
  },
}));

const ExpandButton = styled(IconButton, {
  name: 'ExpandButton',
})(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.contrastText, 0.08),
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.contrastText,
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
  shouldForwardProp: prop => prop !== 'sidebarWidth',
})<{ sidebarWidth: number }>(({ theme, sidebarWidth }) => ({
  flexGrow: 1,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  width: `calc(100% - ${sidebarWidth}px)`,
  minHeight: '100vh',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },

  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(10),
  },
}));

export const NetworkLayout = ({
  children,
  stretchContent = true,
}: PropsWithChildren<{
  stretchContent?: boolean;
}>) => {
  const theme = useTheme();
  // Mobile: temporary overlay drawer (no collapsed mode)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Narrow non-mobile: permanent sidebar, starts collapsed
  const isNarrow = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useLocalStorageState('sidebar:collapsed', {
    defaultValue: isNarrow,
    serializer: localStorageBoolSerializer,
  });
  const { isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const network = getSubsquidNetwork();
  const bannerHeight = useBannerHeight();
  const { SQD_TOKEN } = useContracts();
  const price = useQuery(trpc.price.current.queryOptions());

  useEffect(() => {
    if (!isConnected) return;
    if (chain?.id === getChain(network).id) return;
    disconnect();
  }, [isConnected, chain?.id, network, disconnect]);

  // Close mobile menu when switching away from mobile
  useEffect(() => {
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  // Auto-collapse when entering narrow non-mobile range
  useEffect(() => {
    if (isNarrow) setIsCollapsed(true);
  }, [isNarrow, setIsCollapsed]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCollapseToggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, [setIsCollapsed]);

  // On mobile: sidebar is an overlay, takes no layout space
  // On non-mobile: sidebar reserves space, may be collapsed
  const collapsed = !isMobile && isCollapsed;
  const sidebarWidth = isMobile ? 0 : collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const drawer = (
    <>
      <SidebarLogo>
        <Logo compact={collapsed} />
        {isMobile && (
          <CollapseButton onClick={handleMenuClose} aria-label="Close sidebar">
            <ChevronLeft />
          </CollapseButton>
        )}
        {!isMobile && !collapsed && (
          <CollapseButton onClick={handleCollapseToggle} aria-label="Collapse sidebar">
            <ChevronLeft />
          </CollapseButton>
        )}
      </SidebarLogo>
      <NetworkMenu onItemClick={isMobile ? handleMenuClose : () => {}} collapsed={collapsed} />
    </>
  );

  return (
    <Main>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <AppBar bannerHeight={bannerHeight} sidebarWidth={sidebarWidth} elevation={0}>
        <AppToolbar>
          {(isMobile || collapsed) && (
            <ExpandButton
              onClick={isMobile ? handleMenuToggle : handleCollapseToggle}
              aria-label="Expand sidebar"
            >
              <ChevronRight />
            </ExpandButton>
          )}
          <UserMenuContainer>
            <Typography variant="body2">
              {SQD_TOKEN}: {dollarFormatter(price.data || 0)}
            </Typography>
            <UserMenu />
          </UserMenuContainer>
        </AppToolbar>
      </AppBar>

      <NavContainer aria-label="navigation menu" sidebarWidth={sidebarWidth}>
        {isMobile ? (
          <Sidebar
            variant="temporary"
            open={isMenuOpen}
            onClose={handleMenuClose}
            bannerHeight={bannerHeight}
            sidebarWidth={SIDEBAR_WIDTH}
            slotProps={{ root: { keepMounted: true } }}
          >
            {drawer}
          </Sidebar>
        ) : (
          <Sidebar variant="permanent" open bannerHeight={bannerHeight} sidebarWidth={sidebarWidth}>
            {drawer}
          </Sidebar>
        )}
      </NavContainer>

      <MainContent id="main-content" sidebarWidth={sidebarWidth}>
        <AppBarSpacer bannerHeight={bannerHeight} />
        {children}
        <Outlet />
      </MainContent>
    </Main>
  );
};
