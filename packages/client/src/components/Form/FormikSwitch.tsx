import React from 'react';

import { Box, FormHelperText, Switch } from '@mui/material';
import { FormikProps } from 'formik';

import { Label } from './FormikCheckBoxInput';

interface FormikSwitchProps<T extends Record<string, any>> {
  id: keyof T;
  label: string | React.ReactElement;
  formik: FormikProps<T>;
  showErrorOnlyOfTouched?: boolean;
}

export function FormikSwitch<T extends Record<string, any>>({
  label,
  id,
  formik,
  showErrorOnlyOfTouched = false,
}: FormikSwitchProps<T>) {
  const actualError =
    !showErrorOnlyOfTouched || (showErrorOnlyOfTouched && formik.touched[id])
      ? (formik.errors[id] as string | undefined)
      : undefined;

  return (
    <Box>
      <Label
        control={
          <Switch
            id={id as string}
            checked={formik.values[id] as boolean}
            onChange={formik.handleChange}
            name={id as string}
          />
        }
        label={label}
      />
      {actualError && <FormHelperText error>{actualError}</FormHelperText>}
    </Box>
  );
}
