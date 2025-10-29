import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Box, styled } from '@mui/material';

import { TextField } from '@components/Form';
import { SearchIcon } from '@icons/SearchIcon';

interface SearchProps {
  loading?: boolean;
  value?: string;
  onChange?: (value: string) => unknown;
  fullWidth?: boolean;
  placeholder?: string;
}

export const Search = ({ value, onChange, fullWidth, placeholder }: SearchProps) => {
  const [realTimeValue, setRealTimeValue] = useState(value || '');

  const debouncedOnChange = useDebouncedCallback((value: string) => onChange?.(value), 200);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setRealTimeValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, position: 'relative' }}>
      <TextField
        placeholder={placeholder}
        variant="filled"
        inputMode="search"
        value={realTimeValue}
        fullWidth
        onChange={handleInputChange}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        size='small'
      />
      {/*<CircularProgress*/}
      {/*  size={20}*/}
      {/*  sx={{*/}
      {/*    position: 'absolute',*/}
      {/*    top: 8,*/}
      {/*    right: 8,*/}
      {/*    opacity: loading ? 1 : 0,*/}
      {/*    transition: 'opacity 300ms ease-out',*/}
      {/*  }}*/}
      {/*/>*/}
    </Box>
  );
};
