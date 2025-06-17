import React from 'react';

import {
  styled,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material';

export const StyledTextField = styled(MuiTextField, {
  name: 'StyledTextField',
})<MuiTextFieldProps>(({ theme }) => ({
  '& > div': {
    backgroundColor: `${(theme.palette.background as any).input} !important`,
    border: `1px solid ${theme.palette.background.default}`,
    '&:hover': {
      backgroundColor: `${(theme.palette.background as any).input} !important`,
    },

    '& input': {
      color: `${theme.palette.text.primary} !important`,
      textFillColor: `${theme.palette.text.primary} !important`,
    },
  },

  '&.disabled': {
    '& input': {
      cursor: 'default !important',
      opacity: `0.5 !important`,
    },

    '&:hover > div': {
      border: `1px solid ${theme.palette.background.default}`,
    },
  },

  '& .MuiFormLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },

  '& svg': {
    stroke: theme.palette.primary.main,
  },
}));

export const TextField = React.forwardRef<HTMLDivElement, MuiTextFieldProps>((props, ref) => {
  return <StyledTextField {...props} ref={ref} />;
});
