import '@rainbow-me/rainbowkit/styles.css';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  AppBar as AppBarMaterial,
  Box,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
  Drawer,
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

const APP_BAR_HEIGHT = 60;
const SIDEBAR_WIDTH = {
  M: 56,
  L: 232,
};

const Main = styled('div', {
  name: 'Main',
})(({ theme }) => ({
  minHeight: '100%',
  background: theme.palette.background.default,
  display: 'flex',
  flexFlow: 'column',
  position: 'relative',
  overflowX: 'hidden',
}));

const AppBar = styled(AppBarMaterial, {
  name: 'AppBar',
})(({ theme }) => ({
  zIndex: theme.zIndex.appBar,
  background: theme.palette.background.default,
}));

const AppToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: APP_BAR_HEIGHT,
  margin: theme.spacing(0, 2),
}));

const Content = styled('div', {
  name: 'Content',
})(({ theme }) => {
  const bannerHeight = useBannerHeight();

  return {
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: APP_BAR_HEIGHT + bannerHeight,
    paddingLeft: 0,
    minWidth: 350,

    [theme.breakpoints.up('xl')]: {
      paddingLeft: SIDEBAR_WIDTH.L,
    },
  };
});

const ContentWrapper = styled('div', {
  name: 'ContentWrapper',
})(({ theme }) => ({
  margin: theme.spacing(0, 1),
  padding: theme.spacing(2, 2, 10, 2),
  flex: '1',
  overflowX: 'hidden',

  [theme.breakpoints.up('xl')]: {
    maxWidth: 1336,
    boxSizing: 'content-box',
  },
}));

const Sidebar = styled(Drawer, {
  name: 'Sidebar',
})(({ theme }) => {
  return {
    zIndex: theme.zIndex.appBar + 3,

    '& .MuiButtonBase-root': {
      color: theme.palette.primary.contrastText,
      '& path': {
        fill: theme.palette.primary.contrastText,
      },
    },

    '& .MuiButtonBase-root.selected': {
      color: theme.palette.text.primary,
      '& path': {
        fill: theme.palette.text.primary,
      },
    },

    '& .MuiButtonBase-root:hover': {
      backgroundColor: theme.palette.action.hover,
    },

    '& .MuiDrawer-paper': {
      width: SIDEBAR_WIDTH.L,
      background: theme.palette.primary.main,
      border: 'none',
      borderRadius: 0,
      padding: theme.spacing(0, 1, 1, 1),
    },
  };
});

const SidebarLogo = styled('div', {
  name: 'SidebarLogo',
})(({ theme }) => ({
  display: 'flex',
  height: APP_BAR_HEIGHT,
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  marginBottom: theme.spacing(0.5),
}));

const MenuButton = styled(IconButton, {
  name: 'MenuButton',
})(({ theme }) => ({
  transition: 'transform 300ms ease-out',

  '&.open': {
    transform: `rotateZ(90deg);`,
  },

  '& path': {
    stroke: theme.palette.primary.contrastText,
  },
}));

export const NetworkLayout = ({
  children,
  stretchContent = true,
}: PropsWithChildren<{
  stretchContent?: boolean;
}>) => {
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down('xl'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const network = getSubsquidNetwork();

  useEffect(() => {
    if (!isConnected) return;
    if (chain?.id === getChain(network).id) return;
    disconnect();
  }, [isConnected, chain?.id, network, disconnect]);

  const centeredSx = {
    alignSelf: stretchContent ? 'stretch' : 'flex-start',
  };

  return (
    <Main>
      <AppBar>
        <AppToolbar>
          <MenuButton
            className={classnames({
              open: isMenuOpen,
            })}
            onClick={e => {
              e.stopPropagation();
              setIsMenuOpen(open => !open);
            }}
          >
            <MenuIcon />
          </MenuButton>
          <Box sx={{ flex: 1 }} />
          <UserMenu />
        </AppToolbar>
      </AppBar>

      <Sidebar
        open={!narrow || isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        variant={narrow ? 'temporary' : 'permanent'}
      >
        <SidebarLogo>
          <Logo />
        </SidebarLogo>
        <NetworkMenu onItemClick={() => setIsMenuOpen(false)} />
      </Sidebar>

      <Content>
        <ContentWrapper sx={centeredSx}>
          {children}
          <Outlet />
        </ContentWrapper>
      </Content>
    </Main>
  );
};
