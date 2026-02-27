import { createContext, forwardRef, useContext, useId } from 'react';

import { Box, styled } from '@mui/material';

/**
 * Property components for displaying label-value pairs in a responsive grid layout.
 *
 * Usage:
 *
 * 1. Single PropertyList (standalone):
 * ```tsx
 * <PropertyList>
 *   <Property label="Name" value="John Doe" />
 *   <Property label="Email" value="john@example.com" />
 * </PropertyList>
 * ```
 *
 * 2. Multiple PropertyLists aligned across entire page (using PropertyListGroup):
 * ```tsx
 * <PropertyListGroup>
 *   <Grid container>
 *     <Grid size={{ md: 6 }}>
 *       <Card>
 *         <PropertyList>
 *           <Property label="Name" value="John" />
 *         </PropertyList>
 *       </Card>
 *     </Grid>
 *     <Grid size={{ md: 6 }}>
 *       <Card>
 *         <PropertyList>
 *           <Property label="Email" value="john@example.com" />
 *         </PropertyList>
 *       </Card>
 *     </Grid>
 *   </Grid>
 * </PropertyListGroup>
 * ```
 * All PropertyLists inside PropertyListGroup automatically share the same sync ID.
 * The sync ID is auto-generated using React's useId() if not explicitly provided.
 *
 * 3. Manual sync for specific PropertyLists (using sync prop):
 * ```tsx
 * <PropertyList sync="myGroup">
 *   <Property label="Name" value="John" />
 * </PropertyList>
 * ```
 *
 * The sync mechanism adds a class name `PropertyList-sync-{value}` which can be used
 * for custom CSS styling or JavaScript-based alignment across separate containers.
 */

// Context for PropertyListGroup to communicate sync ID
const PropertyListGroupContext = createContext<string | undefined>(undefined);

// Parent wrapper that provides a sync context for all nested PropertyLists
// This component doesn't affect layout - it just provides a shared sync ID
interface PropertyListGroupProps {
  children: React.ReactNode;
  syncId?: string;
}

export function PropertyListGroup({ children, syncId }: PropertyListGroupProps) {
  // Auto-generate a unique ID if syncId is not provided
  const autoId = useId();
  const effectiveSyncId = syncId || `auto-${autoId}`.replace(/:/g, '-');

  return (
    <PropertyListGroupContext.Provider value={effectiveSyncId}>
      {children}
    </PropertyListGroupContext.Provider>
  );
}

// Base styled component for PropertyList
const PropertyListBase = styled(Box, {
  name: 'PropertyList',
  shouldForwardProp: prop => prop !== 'grouped',
})<{ grouped?: boolean }>(({ theme, grouped }) => ({
  display: grouped ? 'contents' : 'grid',
  gridTemplateColumns: grouped ? undefined : `minmax(auto, 0.5fr) minmax(auto, 1fr)`,
  columnGap: grouped ? undefined : theme.spacing(1),
  rowGap: grouped ? undefined : theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: grouped ? undefined : '1fr',
    rowGap: grouped ? undefined : theme.spacing(0.5),
  },
}));

// Wrapper component that adds sync class name
interface PropertyListProps {
  grouped?: boolean;
  sync?: string;
  children?: React.ReactNode;
}

export const PropertyList = forwardRef<HTMLDivElement, PropertyListProps>(
  ({ grouped, sync, children, ...props }, ref) => {
    // Auto-detect sync from PropertyListGroup context if not explicitly provided
    const contextSync = useContext(PropertyListGroupContext);
    const effectiveSync = sync || contextSync;

    const className = effectiveSync ? `PropertyList-sync-${effectiveSync}` : undefined;

    return (
      <PropertyListBase ref={ref} grouped={grouped} className={className} {...props}>
        {children}
      </PropertyListBase>
    );
  },
);

export const PropertyLabel = styled(Box, {
  name: 'PropertyLabel',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  wordBreak: 'break-word',
}));

export const PropertyValue = styled(Box, {
  name: 'PropertyValue',
})(({ theme }) => ({
  overflowWrap: 'anywhere',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
  },
}));

// Component for a single property (label-value pair)
export interface PropertyProps {
  label: React.ReactNode;
  value: React.ReactNode;
  action?: React.ReactNode;
}

export function Property({ label, value, action }: PropertyProps) {
  return (
    <>
      <PropertyLabel>{label}</PropertyLabel>
      <PropertyValue>
        <Box display="inline-block">{value || '-'}</Box>
        {action && <Box display="inline-block">{action}</Box>}
      </PropertyValue>
    </>
  );
}
