import React from 'react';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  styled,
} from '@mui/material';
import { FormikProps } from 'formik';

interface SelectOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export const FormSelect = styled(Select, {
  name: 'FormSelect',
})<SelectProps>(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
}));

interface FormikSelectProps<T extends Record<string, any>> {
  id: keyof T;
  formik: FormikProps<T>;
  options: SelectOption[];
  label?: string;
  disabled?: boolean;
  showErrorOnlyOfTouched?: boolean;
  onChange?: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
}

export const FormikSelect = <T extends Record<string, any>>({
  label,
  id,
  formik,
  options,
  disabled,
  showErrorOnlyOfTouched,
  onChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    formik.setFieldValue(id as string, event.target.value as string);
  },
}: FormikSelectProps<T>) => {
  const actualError =
    !showErrorOnlyOfTouched || (showErrorOnlyOfTouched && formik.touched[id])
      ? (formik.errors[id] as string | undefined)
      : undefined;

  return (
    <FormControl hiddenLabel={!label} variant="standard" fullWidth error={Boolean(actualError)}>
      {label && <InputLabel>{label}</InputLabel>}
      <FormSelect
        disabled={disabled}
        onChange={onChange}
        value={formik.values[id] || (options[0].value as string)}
        variant="outlined"
      >
        {options.map(option => (
          <MenuItem disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </FormSelect>
      {actualError && <FormHelperText error>{actualError}</FormHelperText>}
    </FormControl>
  );
};
