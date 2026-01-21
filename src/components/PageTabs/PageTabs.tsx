import React from 'react';

import { Box, SxProps, Tab, TabProps, Tabs, TabsProps, Theme, styled } from '@mui/material';
import classnames from 'classnames';
import trimEnd from 'lodash-es/trimEnd';
import { useLocation, useNavigate } from 'react-router-dom';

export interface PageTab {
  /** The title to display in the tab */
  title: React.ReactNode;
  /** The path to navigate to when the tab is clicked */
  path: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Custom icon to display in the tab */
  icon?: React.ReactNode;
  /** Custom styles for the tab */
  sx?: SxProps<Theme>;
  /** Custom tooltip text for the tab */
  tooltip?: string;
}

export interface PageTabsProps {
  /** The tabs to display */
  tabs: PageTab[];
  /** Optional prefix to add to all tab paths */
  prefix?: string;
  /** Custom component to use instead of the default Tab */
  TabComponent?: React.ElementType<TabProps>;
  /** Custom styles for the tabs container */
  sx?: SxProps<Theme>;
  /** Whether to show scroll buttons on mobile */
  allowScrollButtonsMobile?: boolean;
  /** Whether to center the tabs */
  centered?: boolean;
  /** Whether to show the tab indicator */
  showIndicator?: boolean;
  /** Custom styles for the tab indicator */
  indicatorSx?: SxProps<Theme>;
}

export interface PageTabsRootProps extends TabsProps {
  /** Whether to show the tab indicator */
  showIndicator?: boolean;
  /** Custom styles for the tabs container */
  sx?: SxProps<Theme>;
}

export const PageTabsRoot = styled(Tabs, {
  name: 'PageTabs',
})<PageTabsRootProps>(({ theme, showIndicator = true }) => ({
  marginBottom: theme.spacing(3),
  maxWidth: '100%',

  '& .MuiTabs-indicator': {
    display: showIndicator ? 'block' : 'none',
  },

  [theme.breakpoints.down('xs')]: {
    marginBottom: theme.spacing(2),
  },
}));

export const PageTab = styled(Tab, { name: 'PageTab' })(({ theme }) => ({
  textTransform: 'none',
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease-in-out',

  '&.selected': {
    fontWeight: 500,
  },
}));

export function PageTabs({
  tabs,
  prefix = '',
  TabComponent = PageTab,
  sx,
  allowScrollButtonsMobile = false,
  centered = false,
  showIndicator = true,
  indicatorSx,
}: PageTabsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = trimEnd(location.pathname, '/');

  return (
    <PageTabsRoot
      variant="scrollable"
      allowScrollButtonsMobile={allowScrollButtonsMobile}
      centered={centered}
      showIndicator={showIndicator}
      sx={sx}
      TabIndicatorProps={{
        sx: indicatorSx,
      }}
    >
      {tabs.map(({ title, path, disabled, icon, sx: tabSx, tooltip }) => {
        const linkPath = `${prefix}${path}`;
        const active = currentPath === linkPath;

        return (
          <TabComponent
            key={linkPath}
            className={classnames({
              selected: active,
            })}
            onClick={() => navigate(linkPath)}
            disabled={disabled}
            data-before={title}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon}
                {title}
              </Box>
            }
            sx={tabSx}
            title={tooltip}
          />
        );
      })}
    </PageTabsRoot>
  );
}
