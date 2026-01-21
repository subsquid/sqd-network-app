import React from 'react';

import { EditIcon } from '@icons/EditIcon';
import {
  Box,
  BoxProps,
  IconButton,
  IconButtonProps,
  TextField,
  TextFieldProps,
  styled,
} from '@mui/material';
import classnames from 'classnames';

export const ClickableInput = styled(Box, {
  name: 'ClickableInput',
})<BoxProps>(() => ({
  cursor: 'pointer !important',
}));

export const ClickableIconButton = styled(IconButton, {
  name: 'ClickableIconButton',
})<IconButtonProps>(() => ({
  boxSizing: 'content-box',
  padding: 0,
  width: 36,
  height: 36,
}));

export const StyledTextField = styled(TextField, {
  name: 'ClickableTextField',
})<TextFieldProps>(({ theme }) => ({
  //'& > div': {
  //  backgroundColor: `${theme.palette.background.input} !important`,
  //  border: `1px solid ${theme.palette.background.default}`,
  //  '&:hover': {
  //    backgroundColor: `${theme.palette.background.input} !important`,
  //  },
  //
  //  '& input': {
  //    color: `${theme.palette.text.primary} !important`,
  //    textFillColor: `${theme.palette.text.primary} !important`,
  //    cursor: 'pointer !important',
  //  },
  //},
  //
  //'&.disabled': {
  //  '& input': {
  //    cursor: 'default !important',
  //    opacity: `0.5 !important`,
  //  },
  //
  //  '&:hover > div': {
  //    border: `1px solid ${theme.palette.background.default}`,
  //  },
  //},
  //
  //'& .MuiFormLabel-root.Mui-focused': {
  //  color: theme.palette.primary.main,
  //},
  //
  //'& svg': {
  //  stroke: theme.palette.primary.main,
  //},
}));

interface ClickableTextFieldProps {
  label: string;
  value?: string;
  onClick?: () => void;
  endIcon?: React.ReactElement;
  disabled?: boolean;
  className?: string;
  sx?: BoxProps['sx'];
}

export const ClickableTextField = ({
  label,
  value,
  onClick,
  endIcon,
  disabled = false,
  className,
  sx,
}: ClickableTextFieldProps) => {
  const editable = !disabled;

  return (
    <ClickableInput onClick={onClick} className={className} sx={sx}>
      <StyledTextField
        label={label}
        fullWidth
        variant="filled"
        value={value}
        disabled
        className={classnames({
          disabled: !editable,
        })}
        InputLabelProps={{
          focused: Boolean(value),
          shrink: Boolean(value),
        }}
        InputProps={{
          endAdornment: onClick ? (
            <ClickableIconButton onClick={onClick}>{endIcon || <EditIcon />}</ClickableIconButton>
          ) : undefined,
        }}
      />
    </ClickableInput>
  );
};
