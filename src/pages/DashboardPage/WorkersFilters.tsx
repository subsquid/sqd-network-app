import { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SxProps,
} from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';

import { WorkerStatusChip, WorkerStatusLabel } from '@pages/WorkersPage/WorkerStatus';

const STATUS_OPTIONS: WorkerStatusLabel[] = [
  'online',
  'offline',
  'jailed',
  'registering',
  'deregistering',
  'deregistered',
];

const checkboxSx = {
  color: 'text.secondary',
  '&.Mui-checked': {
    color: 'info.main',
  },
};

const menuItemSx = { py: 0.5, minHeight: 'auto' };

interface WorkersFiltersProps {
  statusArray: string[];
  onStatusChange: (value: string[]) => void;
  minUptime: string;
  onMinUptimeChange: (value: string) => void;
  minWorkerAPR: string;
  onMinWorkerAPRChange: (value: string) => void;
  minDelegatorAPR: string;
  onMinDelegatorAPRChange: (value: string) => void;
  maxDelegationCapacity: string;
  onMaxDelegationCapacityChange: (value: string) => void;
}

export function WorkersFilters({
  sx,
  statusArray,
  onStatusChange,
  minUptime,
  onMinUptimeChange,
  minWorkerAPR,
  onMinWorkerAPRChange,
  minDelegatorAPR,
  onMinDelegatorAPRChange,
  maxDelegationCapacity,
  onMaxDelegationCapacityChange,
}: WorkersFiltersProps & { sx?: SxProps }) {
  // Local state for immediate input updates
  const [localMinUptime, setLocalMinUptime] = useState(minUptime);
  const [localMinWorkerAPR, setLocalMinWorkerAPR] = useState(minWorkerAPR);
  const [localMinDelegatorAPR, setLocalMinDelegatorAPR] = useState(minDelegatorAPR);
  const [localMaxDelegationCapacity, setLocalMaxDelegationCapacity] =
    useState(maxDelegationCapacity);

  // Sync local state with props when they change externally (e.g., URL state restoration)
  useEffect(() => {
    setLocalMinUptime(minUptime);
  }, [minUptime]);

  useEffect(() => {
    setLocalMinWorkerAPR(minWorkerAPR);
  }, [minWorkerAPR]);

  useEffect(() => {
    setLocalMinDelegatorAPR(minDelegatorAPR);
  }, [minDelegatorAPR]);

  // Debounced callbacks for parent state updates
  const debouncedOnMinUptimeChange = useDebouncedCallback(onMinUptimeChange, 500);
  const debouncedOnMinWorkerAPRChange = useDebouncedCallback(onMinWorkerAPRChange, 500);
  const debouncedOnMinDelegatorAPRChange = useDebouncedCallback(onMinDelegatorAPRChange, 500);
  const debouncedOnMaxDelegationCapacityChange = useDebouncedCallback(
    onMaxDelegationCapacityChange,
    500,
  );

  const handleMinUptimeChange = (value: string) => {
    setLocalMinUptime(value);
    debouncedOnMinUptimeChange(value);
  };

  const handleMinWorkerAPRChange = (value: string) => {
    setLocalMinWorkerAPR(value);
    debouncedOnMinWorkerAPRChange(value);
  };

  const handleMinDelegatorAPRChange = (value: string) => {
    setLocalMinDelegatorAPR(value);
    debouncedOnMinDelegatorAPRChange(value);
  };

  const handleMaxDelegationCapacityChange = (value: string) => {
    setLocalMaxDelegationCapacity(value);
    debouncedOnMaxDelegationCapacityChange(value);
  };

  return (
    <Grid container spacing={2} sx={sx}>
      <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Status
          </Typography>
          <Select
            fullWidth
            size="small"
            multiple
            value={statusArray}
            onChange={e => onStatusChange(e.target.value as string[])}
            variant="filled"
            displayEmpty
            renderValue={selected => {
              if (selected.length === 0) {
                return (
                  <Typography variant="body2" color="text.disabled">
                    All
                  </Typography>
                );
              }
              return (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, overflow: 'hidden' }}>
                  {selected.map(value => (
                    <WorkerStatusChip key={value} status={value as WorkerStatusLabel} />
                  ))}
                </Box>
              );
            }}
          >
            {STATUS_OPTIONS.map(status => (
              <MenuItem key={status} value={status} sx={menuItemSx}>
                <Checkbox checked={statusArray.indexOf(status) > -1} size="small" sx={checkboxSx} />
                <WorkerStatusChip status={status} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Min Uptime, %
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={localMinUptime}
            onChange={e => handleMinUptimeChange(e.target.value)}
            inputProps={{ min: 0, max: 100, step: 1 }}
            variant="filled"
            placeholder="0"
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Min Worker APR, %
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={localMinWorkerAPR}
            onChange={e => handleMinWorkerAPRChange(e.target.value)}
            inputProps={{ min: 0, step: 0.1 }}
            variant="filled"
            placeholder="0"
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Min Delegator APR, %
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={localMinDelegatorAPR}
            onChange={e => handleMinDelegatorAPRChange(e.target.value)}
            inputProps={{ min: 0, step: 0.1 }}
            variant="filled"
            placeholder="0"
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Max Delegation Capacity, %
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={localMaxDelegationCapacity}
            onChange={e => handleMaxDelegationCapacityChange(e.target.value)}
            inputProps={{ min: 0, step: 1 }}
            variant="filled"
            placeholder="0"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
