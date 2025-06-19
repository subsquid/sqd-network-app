import React from 'react';
import { FormikProps } from 'formik';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import { FormControl, InputLabel } from '@mui/material';
import { StyledFormikTextField } from './FormikTextInput';

// A wrapper to make StyledFormikTextField compatible with DateTimePicker
const PickerTextField = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { label, ...other } = props;
  return (
    <FormControl fullWidth variant="standard">
      <InputLabel shrink>{label}</InputLabel>
      <StyledFormikTextField variant="filled" {...other} ref={ref} />
    </FormControl>
  );
});

type FormikDateTimePickerProps = Omit<DateTimePickerProps, 'value' | 'onChange' | 'renderInput'> & {
  formik: FormikProps<any>;
  name: string;
};

export const FormikDateTimePicker: React.FC<FormikDateTimePickerProps> = ({
  name,
  formik,
  ...rest
}) => {
  const { setFieldValue } = formik;

  return (
    <DateTimePicker
      {...rest}
      value={formik.values[name] || null}
      onChange={date => {
        setFieldValue(name, date);
      }}
      slots={{
        textField: PickerTextField,
      }}
      slotProps={{
        textField: {
          error: formik.touched[name] && Boolean(formik.errors[name]),
          helperText: formik.touched[name] && (formik.errors[name] as string),
        },
        calendarHeader: {},
        desktopPaper: {
          sx: {
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          },
        },
      }}
    />
  );
};
