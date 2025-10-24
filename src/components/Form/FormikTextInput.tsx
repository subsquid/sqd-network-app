import React, { useState, useEffect } from 'react';

import {
  styled,
  SxProps,
  TextField as MaterialTextField,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Collapse,
  InputProps as StandardInputProps,
} from '@mui/material';
import { FormikProps } from 'formik';

import { VisibleIcon } from '@icons/VisibleIcon';
import { VisibleOffIcon } from '@icons/VisibleOffIcon';

export const StyledFormikTextField = styled(MaterialTextField)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  [theme.breakpoints.down('xs')]: {
    '& .MuiInputLabel-root': {
      left: '4px',
      fontSize: '14px',
    },
    '& .MuiFilledInput-input': {
      paddingLeft: '16px',
      fontSize: '14px',
    },
  },
}));

type CustomVariant = 'paper';

interface FormikTextInputProps<T extends Record<string, any>> {
  id: keyof T;
  label?: React.ReactNode;
  formik: FormikProps<T>;
  multiline?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  variant?: CustomVariant;
  helperText?: string;
  showErrorOnlyOfTouched?: boolean;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'password';
  sx?: SxProps;
  InputProps?: Partial<StandardInputProps>;
  autoComplete?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export const FormikTextInput = <T extends Record<string, any>>({
  label,
  id,
  formik,
  multiline,
  rows,
  minRows,
  maxRows,
  variant,
  helperText = '',
  placeholder,
  type = 'text',
  InputProps,
  error,
  sx,
  autoComplete,
  onFocus,
  onBlur,
  showErrorOnlyOfTouched = false,
  disabled,
}: FormikTextInputProps<T>) => {
  const [visible, setVisible] = useState(false);
  const [lastHelperText, setLastHelperText] = useState('');

  const handleToggleVisibility = () => setVisible(!visible);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(e);
    onBlur?.();
  };

  const actualError = error
    ? error
    : !showErrorOnlyOfTouched || (showErrorOnlyOfTouched && formik.touched[id])
      ? (formik.errors[id] as string | undefined)
      : undefined;

  const currentHelperText = actualError || helperText;
  useEffect(() => {
    if (!currentHelperText) {
      const timer = setTimeout(() => {
        setLastHelperText('');
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setLastHelperText(currentHelperText);
    }
  }, [currentHelperText]);

  const defaultInputProps =
    type === 'password'
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleVisibility} edge="end" sx={{ mr: '-5px' }}>
                {visible ? <VisibleOffIcon /> : <VisibleIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }
      : undefined;

  return (
    <FormControl fullWidth variant="standard">
      <InputLabel shrink>{label}</InputLabel>
      <StyledFormikTextField
        id={id as string}
        fullWidth
        className={variant}
        type={visible ? 'text' : type}
        variant="outlined"
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        rows={rows}
        placeholder={placeholder}
        value={formik.values[id] || ''}
        onChange={formik.handleChange}
        onBlur={handleBlur}
        onFocus={onFocus}
        error={!!actualError}
        sx={sx}
        helperText={
          <Collapse in={!!currentHelperText} unmountOnExit>
            <span>{currentHelperText || lastHelperText}</span>
          </Collapse>
        }
        autoComplete={autoComplete}
        InputProps={InputProps || defaultInputProps}
        disabled={disabled}
      />
    </FormControl>
  );
};
