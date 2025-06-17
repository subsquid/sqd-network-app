import React from 'react';
import { useField } from 'formik';
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
  name: string;
};

export const FormikDateTimePicker: React.FC<FormikDateTimePickerProps> = ({ name, ...rest }) => {
  const [field, meta, helpers] = useField(name);

  const { setValue } = helpers;

  return (
    <DateTimePicker
      {...rest}
      value={field.value || null}
      onChange={date => setValue(date)}
      slots={{
        textField: PickerTextField,
      }}
      slotProps={{
        textField: {
          error: meta.touched && Boolean(meta.error),
          helperText: meta.touched && meta.error,
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
