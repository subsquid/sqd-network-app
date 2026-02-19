import { Autocomplete, TextField, autocompleteClasses, styled } from '@mui/material';
import { FormikProps } from 'formik';

const inputHeight = 54;
const FormikAutocomplete = styled(Autocomplete<{ label: string; value: string }>)(
  ({ theme }) => ({
    [`& .${autocompleteClasses.inputRoot}`]: {
      paddingTop: 16,
    },

    [`&.no-label .${autocompleteClasses.inputRoot}`]: {
      paddingTop: 0,
      paddingBottom: 0,
      height: inputHeight,
    },
    [`&.no-label .${autocompleteClasses.input}`]: {
      margin: theme.spacing(0.5, 0),
    },
  }),
  { name: 'FormikAutocompleteInput' },
);

interface FormikAutoCompleteProps<T extends Record<string, any>> {
  id: keyof T;
  formik: FormikProps<T>;
  options: { label: string; value: string }[];
  label?: string;
  clearable?: boolean;
  showErrorOnlyOfTouched?: boolean;
}

export function FormikAutoComplete<T extends Record<string, any>>({
  label,
  id,
  formik,
  options,
  clearable,
  showErrorOnlyOfTouched = false,
}: FormikAutoCompleteProps<T>) {
  const actualError =
    !showErrorOnlyOfTouched || (showErrorOnlyOfTouched && formik.touched[id])
      ? (formik.errors[id] as string | undefined)
      : undefined;

  return (
    <FormikAutocomplete
      options={options}
      getOptionLabel={option => option.label}
      disableClearable={!clearable as any}
      onChange={(event, res) => {
        if (!res) return;
        formik.setFieldValue(id as string, res.value);
      }}
      value={options.find(v => v.value === formik.values[id])}
      renderInput={params => (
        <TextField
          {...params}
          className={label ? 'no-label' : undefined}
          label={label}
          variant="filled"
          InputProps={params.InputProps}
          error={Boolean(actualError)}
          helperText={actualError}
        />
      )}
    />
  );
}
