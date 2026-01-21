import React, { useState } from 'react';

import {
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  selectClasses,
  styled,
} from '@mui/material';

import { nonNullable } from '@lib/array';

export const PaperSelect = styled(Select, {
  name: 'PaperSelect',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  backgroundColor: theme.palette.background.paper,

  [`& .${selectClasses.icon}`]: {
    width: 20,
    height: 20,
    marginTop: 3,
  },
}));

export const PaperSelectControls = styled(Stack, {
  name: 'PaperSelectControls',
})(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  [`& a`]: {
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  [`& a.disabled`]: {
    cursor: 'default',
    opacity: 0.5,
  },
}));

export const PaperSelectMenuItem = styled(MenuItem, {
  name: 'PaperSelectMenuItem',
})(({ theme }) => ({
  backgroundColor: `${theme.palette.background.paper} !important`,
}));

export function StateSelect({
  options,
  selected,
  onChange,
  renderValue,
  renderMenuItem = item => item.name,
}: {
  options: { name: string; value: string }[];
  selected: string[];
  onChange: (value: { name: string; value: string }[]) => unknown;
  renderValue?: (value: { name: string; value: string }[]) => React.ReactNode;
  renderMenuItem?: (value: { name: string; value: string }) => React.ReactNode;
}) {
  const getAll = () => options.map(o => o.value);
  const [state, setState] = useState(selected.length ? selected : getAll());

  return (
    <PaperSelect
      multiple
      value={state}
      displayEmpty
      onChange={e => {
        if (!e.target.value) return;

        setState(e.target.value as string[]);
      }}
      onClose={() => {
        if (!state.length) {
          setState(selected.length ? selected : getAll());
          return;
        }

        onChange(state.map(v => options.find(o => o.value === v)).filter(nonNullable));
      }}
      MenuProps={{
        sx: {
          mt: 1,
        },
      }}
      renderValue={
        renderValue
          ? value =>
              renderValue(
                (value as string[]).map(v => options.find(o => o.value === v)).filter(nonNullable),
              )
          : undefined
      }
    >
      <PaperSelectControls justifyContent="space-around" direction="row">
        <a
          href="#"
          className={state.length == options.length ? 'disabled' : undefined}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setState(getAll());
          }}
        >
          Select all
        </a>
        <a
          href="#"
          className={state.length == 0 ? 'disabled' : undefined}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setState([]);
          }}
        >
          Clear all
        </a>
      </PaperSelectControls>
      {options.map(item => (
        <PaperSelectMenuItem key={item.value} value={item.value}>
          <Checkbox checked={state.includes(item.value)} />
          <ListItemText primary={renderMenuItem(item)} />
        </PaperSelectMenuItem>
      ))}
    </PaperSelect>
  );
}
