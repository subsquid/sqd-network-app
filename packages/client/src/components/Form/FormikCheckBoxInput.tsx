import React from 'react';

import {
  Box,
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  formControlLabelClasses,
  styled,
} from '@mui/material';
import { FormikProps } from 'formik';

export const Label = styled(FormControlLabel)<FormControlLabelProps>(
  ({ theme: { palette, breakpoints } }) => ({
    marginRight: 0,
    marginLeft: -10,
    [`& .${formControlLabelClasses.label}`]: {
      fontSize: '0.85rem',
      color: palette.text.secondary,
    },
    [breakpoints.down('xs')]: {
      [`& .${formControlLabelClasses.label}`]: {
        lineHeight: 1.5,
        fontSize: '14px',
      },
    },
  }),
);

interface FormikCheckBoxInputProps<T extends Record<string, any>> {
  id: keyof T;
  label: string | React.ReactElement;
  formik: FormikProps<T>;
  showErrorOnlyOfTouched?: boolean;
}

export const FormikCheckBoxInput = <T extends Record<string, any>>({
  label,
  id,
  formik,
  showErrorOnlyOfTouched = false,
}: FormikCheckBoxInputProps<T>) => {
  const actualError =
    !showErrorOnlyOfTouched || (showErrorOnlyOfTouched && formik.touched[id])
      ? (formik.errors[id] as string | undefined)
      : undefined;

  return (
    <Box>
      <Label
        control={
          <Checkbox
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
};
