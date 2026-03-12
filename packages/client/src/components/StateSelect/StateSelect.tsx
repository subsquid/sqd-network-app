import React, { useMemo } from 'react';

import { Button, Checkbox, ListItemText, MenuItem, Select, Stack, styled } from '@mui/material';

import { nonNullable } from '@lib/array';

export const PaperSelect = Select;

export const PaperSelectMenuItem = styled(MenuItem, {
  name: 'PaperSelectMenuItem',
})(() => ({
  minWidth: 180,
}));

export function StateSelect({
  options,
  selected,
  onChange,
  renderValue,
  renderMenuItem = item => item.name,
  container,
  size = 'small',
  variant = 'outlined',
}: {
  options: { name: string; value: string }[];
  selected: string[];
  onChange: (value: { name: string; value: string }[]) => unknown;
  renderValue?: (value: { name: string; value: string }[]) => React.ReactNode;
  renderMenuItem?: (value: { name: string; value: string }) => React.ReactNode;
  container?: HTMLElement | null;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
}) {
  const allValues = useMemo(() => options.map(o => o.value), [options]);

  const allSelected = selected.length === 0;
  const noneSelected = selected.length === options.length;

  const commit = (nextValues: string[]) => {
    const items = nextValues.map(v => options.find(o => o.value === v)).filter(nonNullable);
    onChange(items);
  };

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      commit(selected.filter(v => v !== value));
    } else {
      commit([...selected, value]);
    }
  };

  return (
    <PaperSelect
      multiple
      size={size}
      variant={variant}
      value={selected}
      displayEmpty
      onChange={() => {}}
      MenuProps={{
        container,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        sx: { mt: 1 },
        PaperProps: { style: { width: 'auto' } },
      }}
      renderValue={
        renderValue
          ? () =>
              renderValue(selected.map(v => options.find(o => o.value === v)).filter(nonNullable))
          : undefined
      }
    >
      <Stack direction="row" justifyContent="space-around" sx={{ my: 0.5 }}>
        <Button
          variant="text"
          size="small"
          color="info"
          disabled={noneSelected}
          onMouseDown={e => {
            e.preventDefault();
            e.stopPropagation();
            commit(allValues);
          }}
        >
          Select all
        </Button>
        <Button
          variant="text"
          size="small"
          color="info"
          disabled={allSelected}
          onMouseDown={e => {
            e.preventDefault();
            e.stopPropagation();
            commit([]);
          }}
        >
          Clear all
        </Button>
      </Stack>
      {options.map(item => (
        <PaperSelectMenuItem
          key={item.value}
          value={item.value}
          disableRipple={false}
          sx={{
            '&.Mui-selected': { backgroundColor: 'transparent' },
            '&.Mui-selected:hover': { backgroundColor: 'action.hover' },
          }}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleToggle(item.value);
          }}
        >
          <Checkbox
            checked={selected.includes(item.value)}
            color="info"
            size="small"
            sx={{ p: 0, mr: 1 }}
          />
          <ListItemText primary={renderMenuItem(item)} />
        </PaperSelectMenuItem>
      ))}
    </PaperSelect>
  );
}
